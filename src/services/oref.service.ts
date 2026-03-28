import axios from 'axios';
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

export class OrefService {
  private readonly CURRENT_ALERTS_URL = 'https://www.oref.org.il/WarningMessages/alert/alerts.json';
  private readonly HISTORY_URL = 'https://www.oref.org.il//Shared/Ajax/GetAlarmsHistory.aspx?lang=he&mode=1';
  
  private readonly headers = {
    'User-Agent': 'https://www.oref.org.il/',
    'Referer': 'https://www.oref.org.il//12481-he/Pakar.aspx',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
  };

  constructor(
    private cacheService: CacheService,
    private logger: Logger
  ) {}

  async getCurrentAlerts(): Promise<AlertResponse> {
    const cacheKey = 'current_alerts';
    const cached = this.cacheService.get<AlertResponse>(cacheKey);
    
    if (cached) {
      this.logger.debug('Returning cached current alerts');
      return cached;
    }

    try {
      this.logger.info('Fetching current alerts from Oref API');
      
      const response = await axios.get<Alert>(this.CURRENT_ALERTS_URL, {
        headers: this.headers,
        timeout: 10000,
      });

      const result: AlertResponse = {
        alert: response.data.data && response.data.data.length > 0,
        current: response.data
      };

      // Cache for 30 seconds (API updates frequently)
      this.cacheService.set(cacheKey, result, 30);
      
      this.logger.info(`Fetched ${response.data.data?.length || 0} current alerts`);
      return result;

    } catch (error) {
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

  async getAlertHistory(): Promise<HistoryResponse> {
    const cacheKey = 'alert_history';
    const cached = this.cacheService.get<HistoryResponse>(cacheKey);
    
    if (cached) {
      this.logger.debug('Returning cached alert history');
      return cached;
    }

    try {
      this.logger.info('Fetching alert history from Oref API');
      
      const response = await axios.get<HistoryEntry[]>(this.HISTORY_URL, {
        headers: this.headers,
        timeout: 10000,
      });

      const result: HistoryResponse = {
        lastDay: response.data || []
      };

      // Cache for 5 minutes (history doesn't change as frequently)
      this.cacheService.set(cacheKey, result, 300);
      
      this.logger.info(`Fetched ${result.lastDay.length} history entries`);
      return result;

    } catch (error) {
      this.logger.error('Failed to fetch alert history', error);
      
      // Return empty response on error
      return {
        lastDay: []
      };
    }
  }

  async getCitiesWithAlerts(): Promise<string[]> {
    try {
      const alerts = await this.getCurrentAlerts();
      return alerts.current.data || [];
    } catch (error) {
      this.logger.error('Failed to get cities with alerts', error);
      return [];
    }
  }

  // Helper method to check if a specific city has alerts
  async hasAlertsForCity(city: string): Promise<boolean> {
    const cities = await this.getCitiesWithAlerts();
    return cities.some(c => c.includes(city));
  }

  // Get alerts grouped by region (simple heuristic)
  async getAlertsByRegion(): Promise<Record<string, string[]>> {
    const cities = await this.getCitiesWithAlerts();
    const regions: Record<string, string[]> = {};

    // Simple region detection based on city names
    cities.forEach(city => {
      let region = 'אחר';
      
      if (city.includes('תל אביב') || city.includes('רמת גן') || city.includes('גבעתיים')) {
        region = 'מרכז';
      } else if (city.includes('ירושלים') || city.includes('בית שמש')) {
        region = 'ירושלים והסביבה';
      } else if (city.includes('חיפה') || city.includes('קרית')) {
        region = 'חיפה והצפון';
      } else if (city.includes('באר שבע') || city.includes('אילת')) {
        region = 'דרום';
      } else if (city.includes('אשדוד') || city.includes('אשקלון')) {
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