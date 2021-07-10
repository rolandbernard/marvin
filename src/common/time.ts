
import { match } from "./util";

export enum TimeUnit {
    MILLISECONDS = 'milliseconds',
    SECOND       = 'second',
    MINUTE       = 'minute',
    HOUR         = 'hour',
    DAY          = 'day',
    WEEK         = 'week',
    MONTH        = 'month',
    YEAR         = 'year',
};

export type Time = number;

export function time(amount: number, unit: TimeUnit): Time {
    return amount * match(unit, {
        'milliseconds': 1,
        'second': 1000,
        'minute': 1000 * 60,
        'hour': 1000 * 60 * 60,
        'day': 1000 * 60 * 60 * 24,
        'week': 1000 * 60 * 60 * 24 * 7,
        'month': 1000 * 60 * 60 * 24 * 30,
        'year': 1000 * 60 * 60 * 24 * 365.2425,
    });
}

export function shortUnit(unit: TimeUnit): string {
    return match(unit, {
        'milliseconds': 'ms',
        'second': 's',
        'minute': 'min',
        'hour': 'h',
        'day': 'd',
        'week': 'w',
        'month': 'm',
        'year': 'y',
    });
}

