
import { clipboard, app } from 'electron';
import { config } from '../config';
import fetch from 'node-fetch';

const currency_symbols = {
    'USD': [ 'USD' ],
    'EUR': [ 'EUR' ],
    'JPY': [ 'JPY' ],
    'BGN': [ 'BGN' ],
    'CZK': [ 'CZK' ],
    'DKK': [ 'DKK' ],
    'GBP': [ 'GBP' ],
    'HUF': [ 'HUF' ],
    'PLN': [ 'PLN' ],
    'RON': [ 'RON' ],
    'SEK': [ 'SEK' ],
    'CHF': [ 'CHF' ],
    'ISK': [ 'ISK' ],
    'NOK': [ 'NOK' ],
    'HRK': [ 'HRK' ],
    'RUB': [ 'RUB' ],
    'TRY': [ 'TRY' ],
    'AUD': [ 'AUD' ],
    'BRL': [ 'BRL' ],
    'CAD': [ 'CAD' ],
    'CNY': [ 'CNY' ],
    'HKD': [ 'HKD' ],
    'IDR': [ 'IDR' ],
    'ILS': [ 'ILS' ],
    'INR': [ 'INR' ],
    'KRW': [ 'KRW' ],
    'MXN': [ 'MXN' ],
    'MYR': [ 'MYR' ],
    'NZD': [ 'NZD' ],
    'PHP': [ 'PHP' ],
    'SGD': [ 'SGD' ],
    'THB': [ 'THB' ],
    'ZAR': [ 'ZAR' ],
};

function parseCurrencyQuery(query) {
    const match = query.match(/^(\d+.?|\d*.?\d+)\s*(.+)\s+(to|in)\s+(.+)$/i);
    if (match) {
        const from = match[2].toUpperCase();
        const to = match[4].toUpperCase();
        if (currency_symbols[from] && currency_symbols[to]) {
            return {
                value: parseFloat(match[1]),
                from: from,
                to: to,
            };
        } else {
            return null;
        }
    }
}

let cached_rates = null;
let last_cache = null;

async function loadCurrencyRates() {
    if (
        last_cache == null
        || ((new Date()).getTime() - last_cache.getTime()) / 1000 / 60 > config.modules.currency_converter.refresh_interval_min
    ) {
        const response = await fetch('https://api.exchangeratesapi.io/latest');
        const json = await response.json();
        cached_rates = json.rates;
        cached_rates[json.base] = 1.0;
        last_cache = new Date();
    }
}

const CurrencyConverterModule = {
    valid: (query) => {
        return parseCurrencyQuery(query);
    },
    search: async (query) => {
        const req = parseCurrencyQuery(query);
        await loadCurrencyRates();
        const result = req.value / cached_rates[req.from] * cached_rates[req.to];
        return [{
            type: 'icon_list_item',
            material_icon: 'timeline',
            primary: '= ' + (Math.round(result * 100) / 100) + ' ' + req.to,
            secondary: req.value + ' ' + req.from,
            executable: true,
            quality: 1.0,
        }];
    },
    execute: async (option) => {
        clipboard.writeText(option.primary);
    },
}

export default CurrencyConverterModule;