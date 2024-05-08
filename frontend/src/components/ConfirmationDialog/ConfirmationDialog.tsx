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
import { TFSItem, TFile, TFolder } from '@/libs/request';
import { useModalContext } from '../Modal/ModalProvider';

interface IProps {
    message: string;
    onSubmit: (items: TFSItem[]) => void;
}

export const ConfirmationDialog = ({
    onSubmit,
    message,
}: PropsWithChildren<IProps>) => {
    const { hideModal, store } = useModalContext();

    const { modalProps, modalType } = store || {};
    const { items, handler } = modalProps || {};

    const handleModalToggle = () => {
        hideModal();
    };

    const handleSubmit = () => {
        onSubmit(items);
        handler(items)
        hideModal();
    };

    return (
        <Dialog onClose={handleModalToggle} open={true}>
            <DialogTitle>{modalType}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={handleModalToggle}>
                    Cancel
                </Button>
                <Button color="secondary" onClick={handleSubmit}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

//stringConfirmation
//confirmation
