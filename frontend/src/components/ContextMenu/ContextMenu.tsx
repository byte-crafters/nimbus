import React, { PropsWithChildren, useState } from 'react';
import { TFile, TFolder, fetcher } from '@/libs/request';
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Typography,
} from '@mui/material';
import styles from './ContextMenu.module.scss';
import Image from 'next/image';
import { Delete } from '@mui/icons-material';
import clsx from 'clsx';

interface IProps {
    // rightClickItem: any;
    positionX: number;
    positionY: number;
    toggled: boolean;
    buttons: any;
    contextMenuRef: any;
}

export type ContextMenuItem = {
    id: string;
    caption: string;
};

export const ContextMenu = ({
    // rightClickItem,
    positionX,
    positionY,
    toggled,
    buttons,
    contextMenuRef,
}: PropsWithChildren<IProps>) => {
    console.log(positionX, positionY, toggled);

    return (
        <menu
            style={{ top: positionY, left: positionX }}
            ref={contextMenuRef}
            className={styles['container' + (toggled ? '__visible' : '')]}
        >
            {buttons.map((button: any, index) => {
                function handleClick(e: React.MouseEvent) {
                    e.stopPropagation();
                    button.onClick(e);
                }

                return (
                    <>
                        <MenuItem key={index} onClick={handleClick}>
                            {/* <ListItemIcon>
                                <Delete fontSize="small" />
                            </ListItemIcon> */}
                            <ListItemText>{button.text}</ListItemText>
                            {/* <Typography variant="body2" color="text.secondary">
                                ⌘X
                            </Typography> */}
                        </MenuItem>
                    </>
                );
            })}
        </menu>
    );
};
