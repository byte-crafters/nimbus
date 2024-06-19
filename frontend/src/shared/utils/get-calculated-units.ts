export function getCalculatedUnits(bytes: number) {
    const units = ['B', 'KB', 'MB', 'GB'];

    let current = bytes,
        index = 0;

    while (current > 1024) {
        current = Math.round((current / 1024) * 10) / 10;
        index++;
    }

    return current + ' ' + units[index];
}
