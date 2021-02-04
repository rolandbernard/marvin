
import { config } from '../config';
import * as mathjs from 'mathjs';
import * as algebrite from 'algebrite';
import { clipboard } from 'electron';
import { getTranslation } from '../../common/local/locale';

const CalculatorModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query) => {
        const ret = [];
        if (config.modules.calculator.backend.includes('mathjs')) {
            try {
                ret.push({
                    type: 'icon_list_item',
                    material_icon: 'functions',
                    primary: '= ' + mathjs.evaluate(query).toString(),
                    secondary: query,
                    quality: config.modules.calculator.quality,
                    executable: true,
                });
            } catch (e) { }
            try {
                ret.push({
                    type: 'icon_list_item',
                    material_icon: 'functions',
                    primary: '= ' + mathjs.simplify(query).toString(),
                    secondary: query + ' ' + getTranslation(config, 'simplified'),
                    quality: config.modules.calculator.quality,
                    executable: true,
                });
            } catch (e) { }
            try {
                ret.push({
                    type: 'icon_list_item',
                    material_icon: 'functions',
                    primary: '= ' + mathjs.rationalize(query).toString(),
                    secondary: query + ' ' + getTranslation(config, 'rationalized'),
                    quality: config.modules.calculator.quality,
                    executable: true,
                });
            } catch (e) { }
        }
        if (config.modules.calculator.backend.includes('algebrite')) {
            try {
                ret.push({
                    type: 'icon_list_item',
                    material_icon: 'functions',
                    primary: '= ' + (algebrite.float(query).d || ''),
                    secondary: query,
                    quality: config.modules.calculator.quality,
                    executable: true,
                    query: query,
                });
            } catch (e) { }
            try {
                ret.push({
                    type: 'icon_list_item',
                    material_icon: 'functions',
                    primary: '= ' + (algebrite.eval(query).toString()),
                    secondary: query,
                    quality: config.modules.calculator.quality,
                    executable: true,
                    query: query,
                });
            } catch (e) { }
            try {
                ret.push({
                    type: 'icon_list_item',
                    material_icon: 'functions',
                    primary: '= ' + algebrite.simplify(query).toString(),
                    secondary: query + ' ' + getTranslation(config, 'simplified'),
                    quality: config.modules.calculator.quality,
                    executable: true,
                    query: query,
                });
            } catch (e) { }
            try {
                ret.push({
                    type: 'icon_list_item',
                    material_icon: 'functions',
                    primary: '= ' + algebrite.rationalize(query).toString(),
                    secondary: query + ' ' + getTranslation(config, 'rationalized'),
                    quality: config.modules.calculator.quality,
                    executable: true,
                    query: query,
                });
            } catch (e) { }
        }
        return ret.filter((val, index) =>
            val.primary.replace('=', '').trim() !== '' && val.primary.replace('=', '').trim() !== 'nil' &&
            val.primary.substr(2).replace(/ /g, '').trim() !== query.replace(/ /g, '').trim()
            && ret.findIndex((v) => v.primary === val.primary) === index
        );
    },
    execute: async (option) => {
        clipboard.writeText(option.primary.substr(2));
    },
}

export default CalculatorModule;
