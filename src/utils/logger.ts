export class Logger {
  private readonly colors = {
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

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  info(message: string, ...args: any[]): void {
    console.log(
      `${this.colors.cyan}[INFO]${this.colors.reset} ${this.getTimestamp()} ${message}`,
      ...args
    );
  }

  error(message: string, error?: any): void {
    console.error(
      `${this.colors.red}[ERROR]${this.colors.reset} ${this.getTimestamp()} ${message}`,
      error ? error : ''
    );
  }

  warn(message: string, ...args: any[]): void {
    console.warn(
      `${this.colors.yellow}[WARN]${this.colors.reset} ${this.getTimestamp()} ${message}`,
      ...args
    );
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `${this.colors.gray}[DEBUG]${this.colors.reset} ${this.getTimestamp()} ${message}`,
        ...args
      );
    }
  }

  success(message: string, ...args: any[]): void {
    console.log(
      `${this.colors.green}[SUCCESS]${this.colors.reset} ${this.getTimestamp()} ${message}`,
      ...args
    );
  }

  // Specialized loggers for API events
  apiRequest(method: string, url: string, statusCode: number, duration: number): void {
    const color = statusCode >= 400 ? this.colors.red : 
                  statusCode >= 300 ? this.colors.yellow : 
                  this.colors.green;
    
    console.log(
      `${this.colors.blue}[API]${this.colors.reset} ${this.getTimestamp()} ${method} ${url} ${color}${statusCode}${this.colors.reset} ${duration}ms`
    );
  }

  websocketEvent(type: string, clientCount: number): void {
    console.log(
      `${this.colors.magenta}[WS]${this.colors.reset} ${this.getTimestamp()} ${type} (clients: ${clientCount})`
    );
  }

  cacheEvent(event: string, key: string, hit: boolean): void {
    const hitColor = hit ? this.colors.green : this.colors.yellow;
    const hitText = hit ? 'HIT' : 'MISS';
    
    console.log(
      `${this.colors.cyan}[CACHE]${this.colors.reset} ${this.getTimestamp()} ${event} ${key} ${hitColor}${hitText}${this.colors.reset}`
    );
  }
}