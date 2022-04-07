import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import debug from 'debug';
import { appName } from './config.js';

const dbg = debug(`${appName}:mongodb`);

/**
 * Connect to MongoDB
 */
async function connect(uri: string) {
    if (!uri) throw new Error('mongodb connection string is invalid');

    mongoose.connection.on('connecting', () => dbg('Connecting...'));
    mongoose.connection.on('connected', () => dbg('Connected'));
    mongoose.connection.on('error', (err) => dbg('Error', err));
    mongoose.connection.on('disconnecting', () => dbg('Disconnecting...'));
    mongoose.connection.on('disconnected', () => dbg('Disconnected'));

    await mongoose.connect(uri);

    mongoose.Promise = global.Promise;
}

/**
 * Disconnect from MongoDB
 */
function disconnect(): Promise<void> {
    return mongoose.disconnect();
}

/**
 * Create a store for use with express-session
 */
function createStore(): MongoStore {
    if (mongoose.connection.readyState !== 1)
        throw new Error('cannot create store without a mongodb connection');

    // https://github.com/jdesboeufs/connect-mongo/issues/433
    return MongoStore.create({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore TS2322
        client: mongoose.connection.getClient(),
        collectionName: 'sessions',
    });
}

export default {
    connect,
    disconnect,
    createStore,
};
