import { TFSItem, fetcher } from '@/libs/request';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import React, { PropsWithChildren, useState } from 'react';
import { useModalContext } from '../Modal/ModalProvider';

export const ACCESS_RIGHTS = {
    VIEW: '1',
    EDIT: '2',
};

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

    const [data, setData] = useState<any>('');
    const [access, setAccess] = useState<string>(ACCESS_RIGHTS.VIEW);
    const [users, setUsers] = useState<any>([]);
    //useMemo https://mui.com/material-ui/react-autocomplete/

    const handleShare = (items: TFSItem[], users: any) => {
        for (const user of users) {
            const userId = user.id;
            for (const item of items) {
                if (item?.extension) {
                    fetcher.shareFiles(item.id, userId).then((response) => {
                        console.log(response);
                    });
                } else {
                    fetcher.shareFolders(item.id, userId).then((response) => {
                        console.log(response);
                    });
                }
            }
        }
    };

    function handleChange(val: string) {
        fetcher
            .getPossibleUsers(val)
            .then((users) => {
                setUsers(users);
            })
            .catch((e) => console.log(e));
    }

    return (
        <Dialog onClose={hideModal} open={true}>
            <DialogTitle>{modalType}</DialogTitle>
            <DialogContent sx={{ height: 200, width: 400, display: 'flex' }}>
                <Autocomplete
                    multiple
                    limitTags={2}
                    size={'small'}
                    disablePortal
                    options={users.map((u) => {
                        return { label: u.username, id: u.id };
                    })}
                    // getOptionLabel={}
                    sx={{ width: 280 }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            autoFocus
                            onChange={(e) => handleChange(e.target.value)}
                        />
                    )}
                    onChange={(e, val) => setData(val)}
                />
                <Select
                    value={access}
                    onChange={(e) => setAccess(e.target.value)}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{ height: 40, width: 100 }}
                >
                    <MenuItem value={1}>
                        <em>View</em>
                    </MenuItem>
                    <MenuItem value={2}>
                        <em>Edit</em>
                    </MenuItem>
                </Select>
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
