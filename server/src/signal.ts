/**
 * This is a slight modification of the default pubsub/signaling server from the y-webrtc package
 * @see https://github.com/yjs/y-webrtc/blob/master/bin/server.js
 */

import ws from 'ws';
import * as map from 'lib0/map';
import { IncomingMessage, Server } from 'http';

type message = {
    type?: string;
    topic?: string;
    topics?: string[];
};

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
const timeout = 30000;
const meetings = new Map();

function send(conn: ws, msg: message) {
    const isConnecting = conn.readyState !== wsReadyStateConnecting;
    const isOpen = conn.readyState !== wsReadyStateOpen;

    if (isConnecting && isOpen) conn.close();

    try {
        conn.send(JSON.stringify(msg));
    } catch (e) {
        conn.close();
    }
}

function onConnect(wss: ws) {
    let closed = false;
    let pongReceived = true;

    const subscribedTopics = new Set();

    const pingInterval = setInterval(() => {
        if (!pongReceived) {
            wss.close();
            clearInterval(pingInterval);
        } else {
            pongReceived = false;
            try {
                wss.ping();
            } catch (e) {
                wss.close();
            }
        }
    }, timeout);

    wss.on('pong', () => (pongReceived = true));

    wss.on('close', () => {
        subscribedTopics.forEach((topicName) => {
            const subs = meetings.get(topicName) || new Set();
            subs.delete(ws);
            if (subs.size === 0) {
                meetings.delete(topicName);
            }
        });
        subscribedTopics.clear();
        closed = true;
    });

    wss.on('message', (msg: message & string) => {
        if (typeof msg === 'string') msg = JSON.parse(msg);
        if (closed || !msg?.type) return;

        if (msg.type === 'subscribe') {
            msg.topics?.forEach((topicName: string) => {
                // add ws to topic
                const topic = map.setIfUndefined(
                    meetings,
                    topicName,
                    () => new Set()
                );
                topic.add(wss);
                // add topic to ws
                subscribedTopics.add(topicName);
            });
        } else if (msg.type === 'unsubscribe') {
            msg.topics?.forEach((topicName: string) => {
                const subs = meetings.get(topicName);
                if (subs) {
                    subs.delete(wss);
                }
            });
        } else if (msg.topic && msg.type === 'publish') {
            meetings
                .get(msg.topic)
                ?.forEach((receiver: ws) => send(receiver, msg));
        } else if (msg.type === 'ping') send(wss, { type: 'pong' });
    });
}

const config = (server: Server) => {
    const wss = new ws.Server({ server });

    wss.on('connection', onConnect);
};

export default {
    config,
};
