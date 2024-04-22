import React, { PropsWithChildren, useState } from 'react';
import styles from './Dialog.module.scss';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { TFSItem, TFile, TFolder, fetcher } from '@/libs/request';
import { MODAL_TYPE, useModalContext } from '../Modal/ModalProvider';
import { StringDialog } from '../StringDialog';

interface IProps {}

export const RenameModal = ({}: PropsWithChildren<IProps>) => {
    const handleRename = (items: TFSItem[], newName: string) => {
        const item = items[0];
        if (!item?.extension) {
            fetcher.renameFolder(item.id, newName).then(({ folder }) => {
                console.log('RENAMED');
                console.log(folder);
            });
        }
    };

    return <StringDialog onSubmit={handleRename} />;
};

//stringConfirmation
//confirmation
