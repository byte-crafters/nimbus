import { TFSItem, fetcher } from '@/libs/request';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { useModalContext } from '../Modal/ModalProvider';

interface IProps {}

export const ShareModal = ({}: PropsWithChildren<IProps>) => {
    const { hideModal, store } = useModalContext();

    const { modalProps, modalType } = store || {};
    const { items, handler } = modalProps || {};

    const handleSubmit = () => {
        handleShare(items, data);
        handler(items, data);
        hideModal();
    };

    const handleShare = (items: TFSItem[], username: string) => {
        console.log(username);
        fetcher
            .getPossibleUsers(username)
            .then((users) => {
                console.log(users);
                if (users.length) {
                    const userId = users[0].id;
                    for (const item of items) {
                        if (item?.extension) {
                            fetcher
                                .shareFiles(item.id, userId)
                                .then((response) => {
                                    console.log(response);
                                });
                        } else {
                            fetcher
                                .shareFolders(item.id, userId)
                                .then((response) => {
                                    console.log(response);
                                });
                        }
                    }
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const [data, setData] = useState<string>('');

    return (
        <Dialog onClose={hideModal} open={true}>
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
                <Button color="secondary" onClick={hideModal}>
                    Cancel
                </Button>
                <Button color="secondary" onClick={handleSubmit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
