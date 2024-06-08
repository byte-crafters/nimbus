import { PieValueType } from '@mui/x-charts';
import { TData } from './parse-extensions';

export type TChartValue = {
    value: number;
    label: string;
};
export function parseDataCharts(storageData: TData): PieValueType[] {
    let arr: TChartValue[] = [];
    const { extensions } = storageData;
    for (const key in extensions) {
        arr.push({
            value: extensions[key].size / storageData.max,
            label: key,
        });
    }

    return arr as PieValueType[];
}
