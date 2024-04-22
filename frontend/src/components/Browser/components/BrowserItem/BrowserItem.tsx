import React, { PropsWithChildren } from 'react';
import styles from './BrowserItem.module.scss';
import Image from 'next/image';
import { ListItem } from '@mui/material';
import clsx from 'clsx';
import { TFile, TFolder } from '@/libs/request';

const FOLDER_IMG = '/folder.png';
const FILE_IMG = '/file.png';

interface IProps {
    item: TFolder | TFile;
    selected: boolean;
    handleClick: (e: React.MouseEvent) => void;
    handleDoubleClick?: (e: React.MouseEvent) => void;
    handleContextMenu: (e: React.MouseEvent) => void;
}

export const BrowserItem = ({
    item,
    selected,
    handleClick,
    handleDoubleClick,
    handleContextMenu,
}: PropsWithChildren<IProps>) => {
    return (
        <ListItem
            className={clsx(
                styles.card,
                selected ? styles.card__selected : null
            )}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
        >
            <Image
                src={item?.extension ? FILE_IMG : FOLDER_IMG}
                alt=""
                className={styles.card__image}
                width={70}
                height={80}
            />
            {item.name}
        </ListItem>
    );
};
