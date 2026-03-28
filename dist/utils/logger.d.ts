export declare class Logger {
    private readonly colors;
    private getTimestamp;
    info(message: string, ...args: any[]): void;
    error(message: string, error?: any): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    success(message: string, ...args: any[]): void;
    apiRequest(method: string, url: string, statusCode: number, duration: number): void;
    websocketEvent(type: string, clientCount: number): void;
    cacheEvent(event: string, key: string, hit: boolean): void;
}
//# sourceMappingURL=logger.d.ts.map