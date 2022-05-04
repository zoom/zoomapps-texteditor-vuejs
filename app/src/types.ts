declare type configOpts = {
    js_api_lists?: string[];
    capabilities: string[];
};

declare type config = {
    runningContext: string;
};

declare type user = {
    id: string;
    role: string;
    screenName: string;
};

export interface ZoomSDK {
    config: (opts: configOpts) => Promise<config>;
    connect: () => Promise<void>;
    getUserContext: () => Promise<user>;
    getMeetingUUID: () => Promise<{ meetingUUID: string; parentUUID?: string }>;
    postMessage: (opts: never) => Promise<void>;
    onMessage: (func: (opts: never) => void) => void;
}
