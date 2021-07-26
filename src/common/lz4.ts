
export function decompressData(data: Buffer): Buffer {
    const decompressed = Buffer.alloc(data.readUInt32LE(8));
    decompressBlock(data, decompressed, 12, data.length - 12, 0);
    return decompressed;
}

export function decompressBlock(source: Buffer, destination: Buffer, sindex: number, slength: number, dindex: number) {
    if (slength < 5) {
        source.copy(destination, dindex, sindex, slength);
    } else {
        const length = sindex + slength;
        function readToken() {
            const number = source.readUInt8(sindex);
            sindex++;
            return {
                literal: (number & 0xf0) >> 4,
                match: number & 0x0f,
            };
        }
        function readLength(start: number) {
            if (start === 15) {
                let res = start;
                for (let number = 255; number === 255 && sindex < length; sindex++) {
                    number = source.readUInt8(sindex);
                    res += number;
                }
                return res;
            } else {
                return start;
            }
        }
        while (sindex < length) {
            const { literal, match } = readToken();
            const literal_length = readLength(literal);
            for (let i = 0; i < literal_length && sindex < length; i++, sindex++, dindex++) {
                destination.writeUInt8(source.readUInt8(sindex), dindex);
            }
            if (sindex + 1 < length) {
                const offset = source.readUInt16LE(sindex);
                sindex += 2;
                if (offset > 0 && offset <= dindex) {
                    const match_length = readLength(match) + 4;
                    for (let i = 0; i < match_length; i++, dindex++) {
                        destination.writeUInt8(destination.readUInt8(dindex - offset), dindex);
                    }
                }
            }
        }
    }
}

