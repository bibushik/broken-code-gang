module.exports = {
    /**
     * Get current user information
     */
    CURRENT_USER: 'CURRENT_USER',

    /**
     * Get current user information
     */
    SET_CURRENT_USER: 'SET_CURRENT_USER',

    /**
     * Logout current user
     */
    LOGOUT_CURRENT_USER: 'LOGOUT_CURRENT_USER',

    /**
     * Return list of all users
     */
    USERS: 'USERS',

    /**
     * Add new user to database
     */
    ADD_USER: 'ADD_USER',

    /**
     * Change online status of user
     */
    ONLINE: 'ONLINE',

    /**
     * Create new room
     */
    CREATE_ROOM: 'CREATE_ROOM',

    /**
     * Return all rooms
     */
    ROOMS: 'ROOMS',

    // /**
    //  * Return one room
    //  */
    // GET_ROOM: 'GET_ROOM',

    /**
     * Current user rooms
     */
    CURRENT_USER_ROOMS: 'CURRENT_USER_ROOMS',

    /**
     * Current user join to room channel
     * */
    CURRENT_USER_JOIN_CHANNEL: 'CURRENT_USER_JOIN_CHANNEL',

    /**
     * Current user join to room channel
     * */
    GET_USERS_OF_ROOM: 'GET_USERS_OF_ROOM',

    /**
     * Current user leave room channel
     * */
    CURRENT_USER_LEAVE_CHANNEL: 'CURRENT_USER_LEAVE_CHANNEL',

    /**
     * Join current user to the room
     */
    CURRENT_USER_JOIN_ROOM: 'CURRENT_USER_JOIN_ROOM',

    /**
     * Leave room
     */
    CURRENT_USER_LEAVE_ROOM: 'CURRENT_USER_LEAVE_ROOM',

    /**
     * Enter room
     */
    CURRENT_USER_ENTER_ROOM: 'CURRENT_USER_ENTER_ROOM',

    /**
     * Get last room visit
     */
    GET_LAST_ROOM_VISIT: 'GET_LAST_ROOM_VISIT',
    /**
     * Remove user from room
     */
    REMOVE_USER_FROM_ROOM: 'REMOVE_USER_FROM_ROOM',

    /**
     * Remove user from room
     */
    DROP_ROOM:'DROP_ROOM',

    /**
     * Rename room
     */
    RENAME_ROOM:'RENAME_ROOM',

    /**
     * Join user to the room
     */
    USER_JOIN_ROOM: 'USER_JOIN_ROOM',

    /**
     * User joined to room
     */
    USER_JOINED: 'USER_JOINED',

    /**
     * User leave the room
     */
    USER_LEAVED: 'USER_LEAVED',

    /**
     * Send message
     */
    SEND_MESSAGE: 'SEND_MESSAGE',

    /**
     * Send system message
     */
    SEND_SYSTEM_MESSAGE: 'SEND_SYSTEM_MESSAGE',

    /**
     * Show list of messages
     */
    MESSAGES: 'MESSAGES',

    /**
     * New message coming
     */
    MESSAGE: 'MESSAGE',

    /**
     * New room has been created
     */
    ROOM: 'ROOM',

    /**
     * Server error
     */
    ERROR: 'ERROR',

    /**
     * Pending socket connection
     */
    PENDING_CONNECTION: 'PENDING_CONNECTION'
};
