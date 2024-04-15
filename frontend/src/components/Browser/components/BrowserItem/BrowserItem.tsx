import React, { PropsWithChildren } from 'react';
import styles from './BrowserItem.module.scss';
import Image from 'next/image';
import { ListItem } from '@mui/material';
import clsx from 'clsx';
import { TFile, TFolder } from '@/libs/request';

interface IProps {
    item: TFolder | TFile;
    image: string;
    selected: boolean;
    handleClick: (e: React.MouseEvent) => void;
    handleDoubleClick?: (e: React.MouseEvent) => void;
    handleContextMenu: (e: React.MouseEvent) => void;
}

export const BrowserItem = ({
    item,
    image,
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
                src={image}
                alt=""
                className={styles.card__image}
                width={70}
                height={80}
            />
            {item.name}
        </ListItem>
    );
};
