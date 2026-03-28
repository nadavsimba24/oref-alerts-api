import { CacheService } from './cache.service';
import { Logger } from '../utils/logger';
export interface Alert {
    data: string[];
    id: number;
    title: string;
}
export interface HistoryEntry {
    data: string;
    date: string;
    time: string;
    datetime: string;
}
export interface AlertResponse {
    alert: boolean;
    current: Alert;
}
export interface HistoryResponse {
    lastDay: HistoryEntry[];
}
export declare class OrefService {
    private cacheService;
    private logger;
    private readonly CURRENT_ALERTS_URL;
    private readonly HISTORY_URL;
    private readonly headers;
    constructor(cacheService: CacheService, logger: Logger);
    getCurrentAlerts(): Promise<AlertResponse>;
    getAlertHistory(): Promise<HistoryResponse>;
    getCitiesWithAlerts(): Promise<string[]>;
    hasAlertsForCity(city: string): Promise<boolean>;
    getAlertsByRegion(): Promise<Record<string, string[]>>;
}
//# sourceMappingURL=oref.service.d.ts.map