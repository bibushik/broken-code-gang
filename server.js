const {createServer} = require('./src/server/server');

const {
    //MONGO_USER = 'broken-code-gang',
    //MONGO_PASSWORD = '123',
    MONGO_USER = 'maxishake',
    MONGO_PASSWORD = '',
    MONGO_LOCAL = 'false',
    MONGO_DATABSE = 'shri_messanger_maxishake',
    //MONGO_HOST = 'localhost',
    //MONGO_PORT = '27017',
    MONGO_HOST = 'ds111370.mlab.com',
    MONGO_PORT = 11370,
    SERVER_HOST = 'localhost',
    SERVER_PORT = 3001
} = process.env;

/**
 * Setup mongo configuration
 */
const DATABASE_CONFIG = {
    user: MONGO_USER,
    password: MONGO_PASSWORD,
    host: MONGO_HOST,
    port: MONGO_PORT,
    local: MONGO_LOCAL !== 'false',
    database: MONGO_DATABSE
};

/**
 * Socket.io server
 */
const SERVER_CONFIG = {
    host: process.env.HOST || process.env.SERVER_HOST || 'localhost',
    port: process.env.PORT || 3001,
};

createServer(SERVER_CONFIG, DATABASE_CONFIG)
    .catch(err => {
        console.log(err);
    });
