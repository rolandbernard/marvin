
import { config } from "../config";
import * as math from 'mathjs';
import { clipboard } from 'electron';
import { getTranslation } from '../../common/local/locale';

const CalculatorModule = {
    valid: (query) => {
        return query.trim().length >= 1;
    },
    search: async (query) => {
        const ret = [];
        try {
            ret.push({
                type: 'icon_list_item',
                material_icon: 'functions',
                primary: '= ' + math.evaluate(query).toString(),
                secondary: query,
                quality: config.modules.calculator.quality,
                executable: true,
            });
        } catch(e) { }
        try {
            ret.push({
                type: 'icon_list_item',
                material_icon: 'functions',
                primary: '= ' + math.simplify(query).toString(),
                secondary: query + ' ' + getTranslation(config, 'simplified'),
                quality: config.modules.calculator.quality,
                executable: true,
            });
        } catch(e) { }
        try {
            ret.push({
                type: 'icon_list_item',
                material_icon: 'functions',
                primary: '= ' + math.rationalize(query).toString(),
                secondary: query + ' ' + getTranslation(config, 'rationalized'),
                quality: config.modules.calculator.quality,
                executable: true,
            });
        } catch(e) { }
        return ret.filter((val, index) => val.primary.substr(2).trim() != query.trim() && ret.findIndex((v) => v.primary === val.primary) === index);
    },
    execute: async (option) => {
        clipboard.writeText(option.primary.substr(2));
    },
}

export default CalculatorModule;
