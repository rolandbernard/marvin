
import BooleanSetting from './boolean-setting';
import ColorSetting from './color-setting';
import SelectSetting from './select-setting';
import ShortcutSetting from './shortcut-setting';
import SizeSetting from './size-setting';
import QualitySetting from './quality-setting';
import ArraySetting from './array-setting';
import PathSetting from './path-setting';
import TextSetting from './text-setting';
import CodeSetting from './code-setting';

const setting_types = {
    boolean: BooleanSetting,
    color: ColorSetting,
    select: SelectSetting,
    shortcut: ShortcutSetting,
    size: SizeSetting,
    quality: QualitySetting,
    array: ArraySetting,
    path: PathSetting,
    text: TextSetting,
    code: CodeSetting,
};

export default setting_types;
