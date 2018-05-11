import io from 'socket.io-client';
import * as MESSAGES from './server/messages';

class Api {
    constructor() {
        this.uniqueId = 0;

        this._connectPromise = fetch('/api/auth', { credentials: 'same-origin' })
            .then(() => this._setupSocket())
            .catch((err) => {
                console.error(`Auth problems: ${err.message}`);

                throw err;
            });
    }

    /**
     * Await for connection
     *
     * @return {Promise<*>}
     */
    _setupSocket() {
        this.io = io();

        return new Promise((resolve) => {
            this.io.on('connect', resolve);
        });
    }

    /**
     * Request data and wait response
     *
     * @param {string} type message type from MESSAGES
     * @param {*} [payload] any requested data
     *
     * @return {Promise<*>}
     * @private
     */
    async _requestResponse(type, payload) {
        await this._connectPromise;

        let id = this.uniqueId++,
            envelop = { payload, id };

        return new Promise((resolve) => {
            this.io.once(type + id, resolve);
            this.io.emit(type, envelop);
        });
    }

    /**
     * Return current user information
     *
     * @return {Promise<User>}
     */
    async getCurrentUser() {
        return this._requestResponse(MESSAGES.CURRENT_USER);
    }

    /**
     * Return all known users
     *
     * @param {{ [limit]: number, [_id]: string }} [filter] - you can pass next object here
     *
     * @return {Promise<Pagination<User>>}
     */
    async getUsers(filter) {
        return this._requestResponse(MESSAGES.USERS, filter);
    }

    /**
     * Set current user
     * @param {string} userId
     * @return {Promise<User>}
     * */
    async setCurrentUser(userId) {
        return this._requestResponse(MESSAGES.SET_CURRENT_USER, { userId: userId });
    }

    /**
     * logout current user
     * @param {string} userId
     * @return {Promise<User>}
     * */
    async logoutCurrentUser() {
        return this._requestResponse(MESSAGES.LOGOUT_CURRENT_USER);
    }

    /**
     * Return user by login and password*/
    async getUserByLogin(login, password) {
        return this.getUsers({ email: login, password: password }).then(result => result.items[0]);
    }

    /**
     * Add new user to database*/
    async addUser(login, password, name) {
        return this._requestResponse(MESSAGES.ADD_USER, { email: login, password: password, name: name });
    }

    /**
     * Get information about user
     *
     * @param {string} userId
     * @return {Promise<User>}
     */
    async getUser(userId) {
        return this.getUsers({ _id: userId }).then(result => result.items[0]);
    }

    /**
     * @param {Room} room
     *
     * @return {Promise<void>}
     */
    async createRoom(room) {
        return this._requestResponse(MESSAGES.CREATE_ROOM, room)
            .then((room) => {
                if (room.error) {
                    throw new Error(room.error);
                }

                return room;
            });
    }

    /**
     * Return list of ALL rooms
     *
     * @param {{ [limit]: number, [_id]: string }} [filter]
     *
     * @return {Promise<Pagination<Room>>}
     */
    async getRooms(filter) {
        return this._requestResponse(MESSAGES.ROOMS, filter);
    }

    /**
     * Return list of ALL rooms
     *
     * @param {String} [roomId]
     *
     * @return {Promise<Pagination<Room>>}
     */
    async getUsersOfRoom(roomId) {
        return this._requestResponse(MESSAGES.GET_USERS_OF_ROOM, roomId);
    }

    /**
     * Return room by id
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async getRoom(roomId) {
        return this.getRooms({ _id: roomId }).then(result => result.items[0]);
    }

    /**
     * Return list of rooms for current user
     *
     * @param {{ limit: number }} [filter]
     *
     * @return {Promise<Pagination<Room>>}
     */
    async getCurrentUserRooms(filter) {
        return this._requestResponse(MESSAGES.CURRENT_USER_ROOMS, filter);
    }

    /**
     * Join current user to the room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async currentUserJoinChannel(roomId) {
        return this._requestResponse(MESSAGES.CURRENT_USER_JOIN_CHANNEL, roomId);
    }

    /**
     * Join current user to the room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async currentUserLeaveChannel(roomId) {
        return this._requestResponse(MESSAGES.CURRENT_USER_LEAVE_CHANNEL, roomId);
    }

    /**
     * Join current user to the room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async currentUserJoinRoom(roomId) {
        return this._requestResponse(MESSAGES.CURRENT_USER_JOIN_ROOM, { roomId });
    }

    /**
     * Join current user to the room
     *
     * @param {string} userId
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async userJoinRoom(userId, roomId) {
        return this._requestResponse(MESSAGES.USER_JOIN_ROOM, { userId, roomId });
    }

    /**
     * Drop room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async dropRoom(roomId) {
        return this._requestResponse(MESSAGES.DROP_ROOM, roomId);
    }

    /**
     * Rename room
     *
     * @param {string} roomId
     * @param {string} userId
     * @param {string} newName
     *
     * @return {Promise<Room>}
     */
    async renameRoom(roomId, userId, newName) {
        return this._requestResponse(MESSAGES.RENAME_ROOM, {roomId, userId, newName});
    }

    /**
     * Current user leave the room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async currentUserLeaveRoom(roomId) {
        return this._requestResponse(MESSAGES.CURRENT_USER_LEAVE_ROOM, { roomId });
    }

    /**
     * Current user leave the room
     *
     * @param {string} roomId
     *
     * @return {Promise<Room>}
     */
    async currentUserEnterRoom(roomId) {
        return this._requestResponse(MESSAGES.CURRENT_USER_ENTER_ROOM, { roomId });
    }

    /**
     * Remove user from room
     *
     * @param {string} roomId
     * @param {string} userId
     *
     * @return {Promise<Room>}
     */
    async removeUserFromRoom(userId,roomId) {
        return this._requestResponse(MESSAGES.REMOVE_USER_FROM_ROOM, {userId, roomId });
    }

    /**
     * Send message to the room
     *
     * @param {string} roomId
     * @param {string} message
     *
     * @return {Promise<Message>}
     */
    async sendMessage(roomId, message) {
        return this._requestResponse(MESSAGES.SEND_MESSAGE, { roomId, message });
    }

    /**
     * Send system message to the room
     *
     * @param {string} roomId
     * @param {string} message
     *
     * @return {Promise<Message>}
     */
    async sendSystemMessage(roomId, message) {
        return this._requestResponse(MESSAGES.SEND_SYSTEM_MESSAGE, { roomId, message });
    }

    /**
     * Return list of messages
     *
     * @param {{}} [filter]
     *
     * @return {Promise<Pagination<Message>>}
     */
    async getMessages(filter) {
        return this._requestResponse(MESSAGES.MESSAGES, filter);
    }

    /**
     * Return list of messages in room
     *
     * @param {{}} roomId
     *
     * @return {Promise<Pagination<Message>>}
     */
    async getRoomMessages(roomId) {
        return this.getMessages({ roomId });
    }

    /**
     * Return list of messages in room
     *
     * @param {{}} roomId
     *
     * @return {Promise<Pagination<Message>>}
     */
    async getLastRoomMessages(roomId) {
        return this.getMessages({ roomId ,limit:1});
    }

    /**
     * Invoke callback, when someone change his status
     *
     * @param {function({userId: string, status: boolean})} callback
     *
     * @return Promise<void>
     */
    async onUserChangeStatus(callback) {
        await this._connectPromise;

        this.io.on(MESSAGES.ONLINE, callback);
    }

    /**
     * Invoke callback, when someone joined one of your rooms
     *
     * @param {function({userId: string, roomId: string})} callback
     *
     * @return Promise<void>
     */
    async onUserJoinedRoom(callback) {
        await this._connectPromise;

        this.io.on(MESSAGES.USER_JOINED, callback);
    }

    /**
     * Invoke callback, when someone leaved one of your rooms
     *
     * @param {function({userId: string, roomId: string})} callback
     *
     * @return Promise<void>
     */
    async onUserLeavedRoom(callback) {
        await this._connectPromise;

        this.io.on(MESSAGES.USER_LEAVED, callback);
    }

    /**
     * Invoke callback, when someone joined one of your rooms
     *
     * @param {function(Message)} callback
     *
     * @return Promise<void>
     */
    async onMessage(callback) {
        await this._connectPromise;
        this.io.on(MESSAGES.MESSAGE, callback);
    }

    async onPendingConnection(callback) {
        await this._connectPromise;
        this.io.on(MESSAGES.PENDING_CONNECTION, callback);
    }
}

export default new Api();
