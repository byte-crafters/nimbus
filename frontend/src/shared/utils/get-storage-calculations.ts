export const calcKBytesFromBytes = (value: number) =>
    Math.round((value / 1024) * 10) / 10;

export const calcMBytesFromBytes = (value: number) =>
    Math.round((value / 1024 / 1024) * 10) / 10;

export const calcGBytesFromBytes = (value: number) =>
    Math.round((value / 1024 / 1024 / 1024) * 10) / 10;

export const calcPercentage = (value: number, max: number) =>
    Math.round((value / max) * 1000) / 10;
