'use client';

import { PathContext, ProfileContext } from '@/app/providers';
import { fetcher } from '@/libs/request';
import { Sidebar } from '@/shared';
import { Box, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    calcGBytesFromBytes,
    calcMBytesFromBytes,
    calcPercentage,
    parseDataCharts,
    parseExtensions,
} from './utils';
import { TData } from './utils/parse-extensions';
import { PieValueType } from '@mui/x-charts';
import { TChartValue } from './utils/parse-data-charts';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

export function Storage() {
    const { openedFolder, setOpenedFolder } = useContext(PathContext);
    const { loggedUser } = useContext(ProfileContext);

    const MAX_KBYTES = 5 * 1024 * 1024 * 1024; //

    const [storageData, setData] = useState<TData>({
        max: MAX_KBYTES,
        value: 0,
        extensions: {},
    });

    const [chartsData, setCharts] = useState<PieValueType[] | []>([]);

    const router = useRouter();

    const filesInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetcher.getStorageInfo().then(({ size }) => {
            const obj = parseExtensions(size);
            setData({ ...obj, max: MAX_KBYTES });
        });
    }, []);

    useEffect(() => {
        /**
         * TODO: move this logic in template or layout
         */
        if (loggedUser === null) {
            router.push('/login');
        }
    }, [loggedUser]);

    useEffect(() => {
        console.log('AAAAAAAAAAA');
        console.log(storageData);
        setCharts(parseDataCharts(storageData));
    }, [storageData]);

    function handleCreateFolder() {
        const folderName = prompt('Folder name:');

        if (folderName !== null) {
            const parentFolderId = openedFolder!.id;

            fetcher
                .postCreateFolder(folderName, parentFolderId)
                .then(({ folders }) => {
                    // setFolders(folders);
                });
        }
    }

    function handleFileUpload(data: FormData) {
        if (openedFolder) {
            fetcher
                .uploadFiles(data, openedFolder?.id)
                .then(({ folders, currentFolder, files }) => {
                    // setFiles(files);
                    // setFolders(folders);
                    setOpenedFolder?.(currentFolder);
                });
        }
    }

    const size = {
        width: 400,
        height: 300,
    };

    return (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* <Sidebar
                onCreateFolder={handleCreateFolder}
                onUploadFile={handleFileUpload}
            /> */}
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
                                // arcLabel: (item) =>
                                //     `${item.label} (${item.value})`,
                                // arcLabelMinAngle: 45,
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
