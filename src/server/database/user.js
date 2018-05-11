const { ObjectId } = require('mongodb');

const { getSessionInfo, saveSessionInfo, deleteSessionInfo } = require('./session');
const { pageableCollection } = require('./helpers');

const TABLE = 'users';

/**
 * @typedef {{
 *  [_id]: string,
 *  name: string,
 *  email: string,
 *  phone: string,
 *  [status]: boolean
 * }} User
 */

/**
 * @param {Db} db
 * @param {string} sid Session ID
 *
 * @returns {Promise<User>}
 */
async function findUserBySid(db, sid) {
    const session = await getSessionInfo(db, sid);
    console.log(session);
    return getUser(db, session.userId);
}

/**
 * @param {Db} db
 * @param {string} userId
 *
 * @returns {Promise<User>}
 */
async function getUser(db, userId) {
    if (!userId){
        return null;
    }
    return db.collection(TABLE).findOne({ _id: ObjectId(userId.toString()) });
}

/**
 * @param {Db} db
 * @param {String} userId
 * @param {String} sid
 *
 * @returns {Promise<User>}
 */
async function setCurrentUser(db, { userId, sid, socketId }) {
    if (!userId) {
        throw new Error('User id required');
    }

    if (!sid) {
        throw new Error('Session id required');
    }

    await deleteSessionInfo(db, sid, socketId);
    let session = {
        userId: ObjectId(userId),
        sid: sid,
        socketId: socketId
    };
    await saveSessionInfo(db, session);
    return await findUserBySid(db, sid);
}

/**
 * @param {Db} db
 * @param {String} sid
 *
 * @returns {Promise<User>}
 */
async function logoutUser(db, sid) {
    if (!sid) {
        throw new Error('Session id required');
    }

    return await deleteSessionInfo(db, sid);
}

/**
 * @param {Db} db
 * @param {{}} [filter]
 *
 * @return {Promise<Pagination<User>>}
 */
async function getUsers(db, filter) {
    return pageableCollection(db.collection(TABLE), filter);
}

/**
 * @param {Db} db
 * @param {string} email
 * @param {string} password
 *
 * @return {Promise<Message>}
 */
async function addUser(db, { email, password, name }) {
    if (!email) {
        throw new Error('User email required');
    }

    if (!password) {
        throw new Error('User password required');
    }

    if (!name) {
        throw new Error('User name required');
    }

    const userEntity = {
        email: email,
        password: password,
        name: name
    };
    const result = await db.collection(TABLE).insertOne(userEntity);
    userEntity._id = result.insertedId;

    return userEntity;
}

module.exports = {
    findUserBySid,
    getUsers,
    getUser,
    addUser,
    setCurrentUser,
    logoutUser,
};
