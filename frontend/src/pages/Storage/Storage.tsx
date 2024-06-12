'use client';

import { fetcher } from '@/libs/request';
import { Box, Typography } from '@mui/material';
import { PieValueType } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import {
    calcGBytesFromBytes,
    calcMBytesFromBytes,
    calcPercentage,
    parseDataCharts,
    parseExtensions,
} from './utils';
import { TData } from './utils/parse-extensions';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

export function Storage() {
    const MAX_KBYTES = 5 * 1024 * 1024 * 1024; //

    const [storageData, setData] = useState<TData>({
        max: MAX_KBYTES,
        value: 0,
        extensions: {},
    });

    const [chartsData, setCharts] = useState<PieValueType[] | []>([]);

    useEffect(() => {
        fetcher.getStorageInfo().then(({ size }) => {
            const obj = parseExtensions(size);
            setData({ ...obj, max: MAX_KBYTES });
        });
    }, []);

    useEffect(() => {
        setCharts(parseDataCharts(storageData));
    }, [storageData]);


    const size = {
        width: 400,
        height: 300,
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            <div>
                <Typography variant="h6">Storage</Typography>
                <Box
                    sx={{
                        margin: 2,
                        width: 900,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <PieChart
                        series={[
                            {
                                innerRadius: 14,
                                outerRadius: 100,
                                paddingAngle: 0,
                                cornerRadius: 0,
                                startAngle: 0,
                                endAngle: 360,
                                cx: 150,
                                cy: 150,
                                data: chartsData,
                            },
                        ]}
                        {...size}
                    />
                    <Typography variant="h6">
                        {calcPercentage(storageData.value, storageData.max)}% of
                        storage used ({calcMBytesFromBytes(storageData.value)}{' '}
                        MB of {calcGBytesFromBytes(MAX_KBYTES)} GB)
                    </Typography>
                    <Typography variant="body1">
                        Make room for your photos, files, and more by cleaning
                        up space
                    </Typography>
                </Box>
            </div>
        </div>
    );
}
