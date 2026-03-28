export declare class CacheService {
    private cache;
    get<T>(key: string): T | null;
    set<T>(key: string, data: T, ttlSeconds: number): void;
    delete(key: string): boolean;
    clear(): void;
    has(key: string): boolean;
    getStats(): {
        total: number;
        valid: number;
        expired: number;
    };
    cleanup(): number;
}
//# sourceMappingURL=cache.service.d.ts.map