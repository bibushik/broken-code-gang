const { insertOrUpdateEntity } = require('./helpers');
const { ObjectId } = require('mongodb');

const TABLE = 'sessions';

/**
 * @typedef {{_id: string, sid: string}} UserSession
 */

/**
 * @param {Db} db
 * @param {string} sid
 *
 * @return {Promise<UserSession>}
 */
async function getSessionInfo(db, sid) {
    return db.collection(TABLE).findOne({ sid }).then(result => result || { sid });
}

/**
 * @param {Db} db
 * @param {UserSession} session
 *
 * @returns {Promise}
 */
async function saveSessionInfo(db, session) {
    return insertOrUpdateEntity(db.collection(TABLE), session);
}

/**
 * @param {Db} db
 * @param {sid} sid
 *
 * @returns {Promise}
 */
async function deleteSessionInfo(db, sid) {
    return db.collection(TABLE).deleteMany({ sid: sid }).then(result => result || false);
}

/**
 * @param {Db} db
 * @param {userId} userId
 *
 * @returns {Promise}
 */

async function getSessionInfoByUserId (db, userId) {
    return db.collection(TABLE).findOne({ userId: ObjectId(userId.toString()) });
}


async function updateSocketIdBySid (db, sid, socketId) {
    console.log("Ready to change");
    return db.collection(TABLE).updateOne({ sid: sid }, {$set: {socketId: socketId}} );
}

module.exports = {
    getSessionInfo,
    saveSessionInfo,
    deleteSessionInfo,
    getSessionInfoByUserId,
    updateSocketIdBySid
};
