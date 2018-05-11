const { ObjectId } = require('mongodb');
const { insertOrUpdateEntity, pageableCollection } = require('./helpers');
const { getUser } = require('./user');

const TABLE = 'rooms';
const TABLE_VISIT = 'rooms_last_visit';

/**
 * @typedef {{
 *  [_id]: string,
 *  name: string,
 *  users: string[]
 * }} Room
 */

/**
 * @param {Db} db
 * @param {string} id
 *
 * @return {Promise<Room>}
 */
async function getRoom(db, id) {
    return db.collection(TABLE).findOne({ _id: ObjectId(id.toString()) });
}

/**
 * @param {Db} db
 * @param {Room} room
 *
 * @return {Promise<Room>}
 */
async function saveRoom(db, room) {
    return insertOrUpdateEntity(db.collection(TABLE), room);
}

/**
 * @param {Db} db
 * @param {{}} filter
 *
 * @return {Promise<Pagination<Room>>}
 */
async function getRooms(db, filter) {
    return pageableCollection(db.collection(TABLE), filter);
}

/**
 * @param {Db} db
 * @param {string} userId
 * @param {{}} [filter]
 *
 * @return {Promise<Pagination<Room>>}
 */
async function getUserRooms(db, userId, filter) {
    return pageableCollection(db.collection(TABLE), {
        ...filter,
        users: ObjectId(userId.toString()),
    });
}

/**
 * @param {Db} db
 * @param {User} currentUser
 * @param {Room} room
 *
 * @return {Promise<Room>}
 */
async function createRoom(db, currentUser, room) {
    if (!room.name) {
        throw new Error('Cannot create room without name');
    }

    let collection = db.collection(TABLE),
        existsRoom = await collection.findOne({ name: room.name });

    if (!existsRoom) {
    // If we clone room
        delete room._id;

        room.users = room.users || [];
        room.users.push(currentUser._id);

        return insertOrUpdateEntity(collection, room);
    }

    return {
        error: 'Room with same name already exists',
        code: 409,
    };
}

/**
 *
 * @param {Db} db
 * @param {string} roomId
 * @param {string} userId
 *
 * @return {Promise<Room>}
 */
async function joinRoom(db, { roomId, userId }) {
    if (!roomId) {
        throw new Error('You must specify roomId to join');
    }

    if (!userId) {
        throw new Error('You must specify userId to join');
    }

    let collection = db.collection(TABLE),
     [ room, user ] = await Promise.all([getRoom(db, roomId), getUser(db, userId)]);


    if (!room) {
        throw new Error(`Cannot find room with id=${roomId}`);
    }

    if (!user) {
        throw new Error(`Unknown user with id=${userId}`);
    }

    const users = room.users.map(user => user.toString());

    if (users.indexOf(userId.toString()) > -1) {
        return room;
    }

    users.push(userId.toString());

    // Make array unique
    room.users = [...new Set(users)].map(userId => ObjectId(userId));

    // Save users to database
    await collection.updateOne({ _id: room._id }, { $set: { users: room.users } });

    const payload = {
        roomId,
        userId,
    };

    const renamedRoom = await renameRoom(db, payload);

    return renamedRoom;
}

/**
 * @param {Db} db
 * @param {string} roomId
 *
 * @return {Promise<Room>}
 */
async function dropRoom(db, roomId) {
    if (!roomId) {
        throw new Error('You must specify roomId to drop');
    }

    const query = {
        _id:ObjectId(roomId.toString()),
    };

    return await db.collection(TABLE).deleteOne(query);
}

/**
 * @param {Db} db
 * @param {string} roomId
 * @param {string} userId
 *
 * @return {Promise<Room>}
 */
async function leaveRoom(db, { roomId, userId }) {
    if (!roomId) {
        throw new Error('You must specify roomId to join');
    }

    if (!userId) {
        throw new Error('You must specify userId to join');
    }

    let collection = db.collection(TABLE),
        [room, user] = await Promise.all([getRoom(db, roomId), getUser(db, userId)]);

    if (!room) {
        throw new Error(`Cannot find room with id=${roomId}`);
    }

    if (!user) {
        throw new Error(`Unknown user with id=${userId}`);
    }

    room.users = room.users
        .filter(user => user.toString() !== userId.toString());

    // Save users to database
    await collection.updateOne({ _id: room._id }, { $set: { users: room.users } });

    const payload = {
        roomId,
        userId,
    };

    const renamedRoom = await renameRoom(db, payload);

    return renamedRoom;
}

/**
 * @param {Db} db
 * @param {string} roomId
 * @param {string} userId
 *
 * @return {Promise<Room>} // last visit timestamp
 */
async function enterRoom(db, { roomId, userId }) {
    console.log('enterRoom roomId userId' + roomId + " " + userId);
    if (!roomId) {
        throw new Error('You must specify roomId to join');
    }

    if (!userId) {
        throw new Error('You must specify userId to join');
    }

    let collection = db.collection(TABLE_VISIT),
        [room, user] = await Promise.all([getRoom(db, roomId), getUser(db, userId)]);

    if (!room) {
        throw new Error(`Cannot find room with id=${roomId}`);
    }

    if (!user) {
        throw new Error(`Unknown user with id=${userId}`);
    }

    // Save last visit to database
    const lastVisit = Date.now();

    const previousVisit = await collection.findOne({$and: [{ room_id: ObjectId(roomId) }, {user_id: ObjectId(userId)} ]});
    if(previousVisit) {
        await collection.updateOne({$and: [{ room_id: ObjectId(roomId) }, {user_id: ObjectId(userId)} ]}, { $set: { last_visit: lastVisit  } });
    } else {
        await collection.insertOne({ room_id: ObjectId(roomId), user_id: ObjectId(userId), last_visit: lastVisit });
    }
    return lastVisit;
}

/**
 *
 */

async function getLastRoomVisit(db, {roomId, userId}) {
    if (!roomId) {
        throw new Error('You must specify roomId to join');
    }

    let collection = db.collection(TABLE_VISIT);

    const lastVisitObj = await collection.findOne({$and: [{ room_id: ObjectId(roomId) }, {user_id: ObjectId(userId)} ]});

    return lastVisitObj;
}

/**
 * @param {Db} db
 * @param {*} data {roomId, userId - new user in room, newName - custom room name}
 *
 * @return {Promise<Room>}
 */

async function renameRoom(db, data) {
    let { roomId, userId, newName } = data;

    if (!roomId) {
        throw new Error('You must specify roomId to rename');
    }

    if (!userId && !newName) {
        throw new Error('You must specify new room user or room name');
    }

    let collection = db.collection(TABLE),
        [room, user] = await Promise.all([getRoom(db, roomId), getUser(db, userId)]);

    if (!room) {
        throw new Error(`Cannot find room with id=${roomId}`);
    }

    if (userId && !room.customName) {

        if (!user) {
            throw new Error(`Unknown user with id=${userId}`);
        }

        let roomUsersNames = [];
        for (let i = 0; i < room.users.length; i ++){
            let userId = room.users[i];
            let user = await getUser(db, userId);
            roomUsersNames.push(user.name);
        }
        let newRoomName = roomUsersNames.join(', ');
        room.name = `${newRoomName}`;

        // Save nem room name to database
        await collection.updateOne({ _id: room._id }, { $set: { name: room.name } });
        return room;

    } else if (newName) {
        // Save nem room name to database
        await collection.updateOne({ _id: room._id }, { $set: { name: newName, customName: true } });
        let renamedRoom = await getRoom(db, room._id);
        return renamedRoom;
    }

    return room;
}

module.exports = {
    saveRoom,
    getRooms,
    getUserRooms,
    createRoom,
    getRoom,
    joinRoom,
    leaveRoom,
    dropRoom,
    renameRoom,
    enterRoom,
    getLastRoomVisit
};
