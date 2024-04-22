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
    onSubmit: (items: TFSItem[], newName: string) => void;
}

export const StringDialog = ({ onSubmit }: PropsWithChildren<IProps>) => {
    const { hideModal, store } = useModalContext();

    const { modalProps, modalType } = store || {};
    const { items } = modalProps || {};

    const handleModalToggle = () => {
        hideModal();
    };

    const handleSubmit = () => {
        onSubmit(items, data);
        hideModal();
    };

    const [data, setData] = useState<string>(items[0].name);

    return (
        <Dialog onClose={handleModalToggle} open={true}>
            <DialogTitle>{modalType}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    fullWidth
                    defaultValue={data}
                    onChange={(e) => setData(e.target.value)}
                    size="small"
                    style={{ width: '320px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleModalToggle}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

//stringConfirmation
//confirmation
