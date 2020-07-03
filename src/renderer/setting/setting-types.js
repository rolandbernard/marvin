
import ActiveSetting from './active-setting';
import ColorSetting from './color-setting';
import LanguageSetting from './language-setting';
import ShortcutSetting from './shortcut-setting';
import SizeSetting from './size-setting';
import QualitySetting from './quality-setting';
import ArraySetting from './array-setting';
import PathSetting from './path-setting';

const setting_types = {
    active: ActiveSetting,
    color: ColorSetting,
    language: LanguageSetting,
    shortcut: ShortcutSetting,
    size: SizeSetting,
    quality: QualitySetting,
    array: ArraySetting,
    path: PathSetting,
};

export default setting_types;
