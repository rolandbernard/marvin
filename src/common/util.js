
export function stringMatchQuality(text, pattern) {
	// TODO: Improve this
	text = text.toUpperCase();
	pattern = pattern.toUpperCase();
	if (text === pattern) {
		return 0.9;
	} else if(pattern.startsWith(text)) {
		return 0.8;
	} else if (pattern.includes(text)) {
		return 0.7;
	} else {
		return 0;
	}
}

function isObject(item) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target, ...sources) {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}
