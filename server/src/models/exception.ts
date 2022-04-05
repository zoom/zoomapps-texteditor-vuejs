import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class Exception extends Error {
    name: string;
    message: string;
    status?: number;
    code?: string;
    syscall?: string;
    stack?: string;
    request?: AxiosRequestConfig;
    response?: AxiosResponse;

    constructor(message: string, status = 500) {
        super();

        this.name = 'Express Exception';
        this.message = message;
        this.status = status;
        this.code = status.toString();
    }
}
