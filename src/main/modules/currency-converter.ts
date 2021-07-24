
import { clipboard } from 'electron';
import fetch from 'node-fetch';

import { configKind, ModuleConfig } from 'common/config';
import { Query } from 'common/query';
import { SimpleResult } from 'common/result';
import { Module } from 'common/module';
import { time, TimeUnit } from 'common/time';

import { moduleConfig } from 'main/config';
import { module } from 'main/modules';

const API_ROOT = 'https://api.exchangerate.host';

const CURRENCY_SYMBOLS = [
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS',
    'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN',
    'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD',
    'BTC', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF',
    'CHF', 'CLF', 'CLP', 'CNH', 'CNY', 'COP', 'CRC',
    'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP',
    'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP',
    'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF',
    'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF',
    'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK',
    'JEP', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR',
    'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK',
    'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL',
    'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRO', 'MRU',
    'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD',
    'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB',
    'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR',
    'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR',
    'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD',
    'SSP', 'STD', 'STN', 'SVC', 'SYP', 'SZL', 'THB',
    'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD',
    'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF',
    'VES', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU',
    'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'YER',
    'ZAR', 'ZMW', 'ZWL'
];

const MODULE_ID = 'currency_converter';

class CurrencyConfig extends ModuleConfig {
    @configKind('time')
    refresh_interval_min = time(60, TimeUnit.MINUTE);

    @configKind('amount')
    round_to = 2;

    @configKind('quality')
    quality = 0.75;

    constructor() {
        super(true);
    }
}

@module(MODULE_ID)
export class CurrencyConverterModule implements Module<SimpleResult> {
    readonly configs = CurrencyConfig;

    last_rate?: number;
    rates?: Record<string, number>;

    get config() {
        return moduleConfig<CurrencyConfig>(MODULE_ID);
    }

    async loadCurrencyRates() {
        if (!this.last_rate || !this.rates || Date.now() - this.last_rate > this.config.refresh_interval_min) {
            const response = await fetch(`${API_ROOT}/latest`);
            const json = await response.json();
            this.rates = json.rates;
            this.last_rate = Date.now();
        }
    }

    parseQuery(query: string): { value?: number, from?: string, to?: string } {
        const match = query.match(/^(\d+.?|\d*.?\d+)\s*(.+)\s+(to|in)\s+(.+)$/i);
        if (match) {
            const from = match[2].toUpperCase();
            const to = match[4].toUpperCase();
            if (CURRENCY_SYMBOLS.includes(from) && CURRENCY_SYMBOLS.includes(to)) {
                return {
                    value: parseFloat(match[1]),
                    from: from,
                    to: to,
                };
            }
        }
        return { };
    }

    async search(query: Query): Promise<SimpleResult[]> {
        if (query.text.length > 0) {
            const { value, from, to } = this.parseQuery(query.text);
            if (value && from && to) {
                await this.loadCurrencyRates();
                const round = Math.pow(10, this.config.round_to);
                const result = Math.round(value / this.rates![from] * this.rates![to] * round) / round;
                return [{
                    module: MODULE_ID,
                    query: query.text,
                    kind: 'simple-result',
                    icon: { material: 'timeline' },
                    primary: `= ${result} ${to}`,
                    secondary: `${value} ${from}`,
                    autocomplete: `${query.raw} = ${result} ${to}`,
                    quality: this.config.quality,
                }];
            }
        }
        return [];
    }

    async execute(result: SimpleResult) {
        clipboard.writeText(result.primary.substr(2));
    }
}

