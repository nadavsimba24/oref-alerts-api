"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrefService = void 0;
const axios_1 = __importDefault(require("axios"));
class OrefService {
    constructor(cacheService, logger) {
        this.cacheService = cacheService;
        this.logger = logger;
        this.CURRENT_ALERTS_URL = 'https://www.oref.org.il/WarningMessages/alert/alerts.json';
        this.HISTORY_URL = 'https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=1';
        this.headers = {
            'User-Agent': 'https://www.oref.org.il/',
            'Referer': 'https://www.oref.org.il//12481-he/Pakar.aspx',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
        };
    }
    async getCurrentAlerts() {
        const cacheKey = 'current_alerts';
        const cached = this.cacheService.get(cacheKey);
        if (cached) {
            this.logger.debug('Returning cached current alerts');
            return cached;
        }
        try {
            this.logger.info('Fetching current alerts from Oref API');
            const response = await axios_1.default.get(this.CURRENT_ALERTS_URL, {
                headers: this.headers,
                timeout: 10000,
            });
            const result = {
                alert: response.data.data && response.data.data.length > 0,
                current: response.data
            };
            // Cache for 30 seconds (API updates frequently)
            this.cacheService.set(cacheKey, result, 30);
            this.logger.info(`Fetched ${response.data.data?.length || 0} current alerts`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to fetch current alerts', error);
            // Return empty response on error
            return {
                alert: false,
                current: {
                    data: [],
                    id: Date.now(),
                    title: 'התרעות פיקוד העורף'
                }
            };
        }
    }
    async getAlertHistory() {
        const cacheKey = 'alert_history';
        const cached = this.cacheService.get(cacheKey);
        if (cached) {
            this.logger.debug('Returning cached alert history');
            return cached;
        }
        try {
            this.logger.info('Fetching alert history from Oref API');
            const response = await axios_1.default.get(this.HISTORY_URL, {
                headers: this.headers,
                timeout: 10000,
            });
            const result = {
                lastDay: response.data || []
            };
            // Cache for 5 minutes (history doesn't change as frequently)
            this.cacheService.set(cacheKey, result, 300);
            this.logger.info(`Fetched ${result.lastDay.length} history entries`);
            return result;
        }
        catch (error) {
            this.logger.error('Failed to fetch alert history', error);
            // Return empty response on error
            return {
                lastDay: []
            };
        }
    }
    async getCitiesWithAlerts() {
        try {
            const alerts = await this.getCurrentAlerts();
            return alerts.current.data || [];
        }
        catch (error) {
            this.logger.error('Failed to get cities with alerts', error);
            return [];
        }
    }
    // Helper method to check if a specific city has alerts
    async hasAlertsForCity(city) {
        const cities = await this.getCitiesWithAlerts();
        return cities.some(c => c.includes(city));
    }
    // Get alerts grouped by region (simple heuristic)
    async getAlertsByRegion() {
        const cities = await this.getCitiesWithAlerts();
        const regions = {};
        // Simple region detection based on city names
        cities.forEach(city => {
            let region = 'אחר';
            if (city.includes('תל אביב') || city.includes('רמת גן') || city.includes('גבעתיים')) {
                region = 'מרכז';
            }
            else if (city.includes('ירושלים') || city.includes('בית שמש')) {
                region = 'ירושלים והסביבה';
            }
            else if (city.includes('חיפה') || city.includes('קרית')) {
                region = 'חיפה והצפון';
            }
            else if (city.includes('באר שבע') || city.includes('אילת')) {
                region = 'דרום';
            }
            else if (city.includes('אשדוד') || city.includes('אשקלון')) {
                region = 'שפלה';
            }
            if (!regions[region]) {
                regions[region] = [];
            }
            regions[region].push(city);
        });
        return regions;
    }
}
exports.OrefService = OrefService;
//# sourceMappingURL=oref.service.js.map