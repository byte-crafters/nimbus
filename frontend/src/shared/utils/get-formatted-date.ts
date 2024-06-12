export function getFormattedDate(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const day = date.getDate();

    return month + ' ' + day + ', ' + year;
}
