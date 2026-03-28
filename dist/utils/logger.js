"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor() {
        this.colors = {
            reset: '\x1b[0m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            gray: '\x1b[90m'
        };
    }
    getTimestamp() {
        return new Date().toISOString();
    }
    info(message, ...args) {
        console.log(`${this.colors.cyan}[INFO]${this.colors.reset} ${this.getTimestamp()} ${message}`, ...args);
    }
    error(message, error) {
        console.error(`${this.colors.red}[ERROR]${this.colors.reset} ${this.getTimestamp()} ${message}`, error ? error : '');
    }
    warn(message, ...args) {
        console.warn(`${this.colors.yellow}[WARN]${this.colors.reset} ${this.getTimestamp()} ${message}`, ...args);
    }
    debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(`${this.colors.gray}[DEBUG]${this.colors.reset} ${this.getTimestamp()} ${message}`, ...args);
        }
    }
    success(message, ...args) {
        console.log(`${this.colors.green}[SUCCESS]${this.colors.reset} ${this.getTimestamp()} ${message}`, ...args);
    }
    // Specialized loggers for API events
    apiRequest(method, url, statusCode, duration) {
        const color = statusCode >= 400 ? this.colors.red :
            statusCode >= 300 ? this.colors.yellow :
                this.colors.green;
        console.log(`${this.colors.blue}[API]${this.colors.reset} ${this.getTimestamp()} ${method} ${url} ${color}${statusCode}${this.colors.reset} ${duration}ms`);
    }
    websocketEvent(type, clientCount) {
        console.log(`${this.colors.magenta}[WS]${this.colors.reset} ${this.getTimestamp()} ${type} (clients: ${clientCount})`);
    }
    cacheEvent(event, key, hit) {
        const hitColor = hit ? this.colors.green : this.colors.yellow;
        const hitText = hit ? 'HIT' : 'MISS';
        console.log(`${this.colors.cyan}[CACHE]${this.colors.reset} ${this.getTimestamp()} ${event} ${key} ${hitColor}${hitText}${this.colors.reset}`);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map