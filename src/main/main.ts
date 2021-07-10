
import { GlobalConfig } from "common/config";
import { loadModules } from "main/modules";

console.log(new GlobalConfig(loadModules()));

