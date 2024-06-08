type TExt = {
    size: number;
    extension: string;
};

type TInfo = {
    size: number;
    count: number;
};

export type TData = {
    max: number;
    value: number;
    extensions: Record<string, TInfo>;
};

const FILE_TYPES: Record<string, Array<string>> = {
    TEXT: ['text/plain', 'application/pdf', 'application/msword'],
    IMAGE: ['image/png', 'image/jpeg', 'application/octet-stream'],
    ARCHIVE: ['application/x-zip-compressed'],
};

export function parseExtensions(data: TExt[]): TData {
    const obj: Record<string, TInfo> = {};
    let generalValue = 0;

    for (const file of data) {
        generalValue += file.size;
        const type = getType(file.extension);

        if (obj[type]) {
            obj[type].size += file.size;
            obj[type].count++;
        } else {
            obj[type] = {
                size: file.size,
                count: 1,
            };
        }
    }

    return { max: 0, value: generalValue, extensions: obj };
}

function getType(ext: string): string {
    for (const key in FILE_TYPES) {
        if (FILE_TYPES[key].includes(ext)) {
            return key;
        }
    }

    return 'OTHER';
}
