import React from 'react';
import { TFile, TFolder, fetcher } from '@/libs/request';
import { List, ListItem } from '@mui/material';
import style from './Browser.module.scss';
import Image from 'next/image';
import { TFolderChilren } from '@/app/files/page';

const FOLDER_IMG = '/folder.png';
const FILE_IMG = '/file.png';

interface IProps {
    files: TFile[];
    folders: TFolder[];
    openFolder: (folder: TFolder, info: TFolderChilren) => void;
}

export function Browser({ files, folders, openFolder }: IProps) {
    return (
        <List className={style.container}>
            {folders.map((folder) => (
                <ListItem
                    className={style.card}
                    key={folder.id}
                    onContextMenu={console.log}
                    onDoubleClick={() => {
                        fetcher.getChildren(folder.id).then((info) => {
                            openFolder(folder, info);
                        });
                    }}
                >
                    <Image
                        src={FOLDER_IMG}
                        alt=""
                        className={style.card__image}
                        width={100}
                        height={100}
                    />
                    {folder.name}
                </ListItem>
            ))}

            {files.map((file) => (
                <ListItem className={style.card} key={file.id}>
                    <Image
                        src={FILE_IMG}
                        alt=""
                        className={style.card__image}
                        width={70}
                        height={80}
                    />
                    {file.name}
                </ListItem>
            ))}
        </List>
    );
}
