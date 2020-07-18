
import { config } from "../config";
import * as math from 'mathjs';

const CalculatorModule = {
    valid: (query) => {
        return config.modules.calculator.active && query.trim().length >= 1;
    },
    search: async (query) => {
        try {
            return [{
                type: 'icon_list_item',
                material_icon: 'functions',
                primary: '= ' + math.evaluate(query),
                secondary: query,
                quality: config.modules.calculator.quality,
            }];
        } catch(e) {
            return [];
        }
    },
}

export default CalculatorModule;
