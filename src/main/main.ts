
import { GlobalConfig } from 'common/config';

import { loadModules } from 'main/modules';

const config = new GlobalConfig(loadModules());

console.log(config);
console.log(config.definition);

