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
import { TFile, TFolder } from '@/libs/request';
import { useModalContext } from '../Modal/ModalProvider';

interface IProps {
    message: string;
    onSubmit: (item: TFile | TFolder) => void;
}

export const ConfirmationDialog = ({
    onSubmit,
    message,
}: PropsWithChildren<IProps>) => {
    const { hideModal, store } = useModalContext();

    const { modalProps, modalType } = store || {};
    const { item } = modalProps || {};

    const handleModalToggle = () => {
        hideModal();
    };

    const handleSubmit = () => {
        onSubmit(item);
        hideModal();
    };

    return (
        <Dialog onClose={handleModalToggle} open={true}>
            <DialogTitle>{modalType}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalToggle}>Cancel</Button>
                <Button onClick={handleSubmit}>OK</Button>
            </DialogActions>
        </Dialog>
    );
};

//stringConfirmation
//confirmation
