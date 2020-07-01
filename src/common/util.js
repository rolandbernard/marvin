
export function stringMatchQuality(text, pattern) {
    if(text === pattern) {
        return 1;
    }
    let match = 0;
    let total = Math.abs(pattern.length - text.length) + 1;
    for(let l = 1; l <= text.length; l++) {
        let last_index = -1;
        for(let i = 0; i < 1 + text.length - l; i++) {
            total += l;
            let index = pattern.indexOf(text.substr(i, l), last_index + 1);
            if(index != -1) {
                last_index = index;
                match += l;
            }
        }
    }
    return match / total;
}
