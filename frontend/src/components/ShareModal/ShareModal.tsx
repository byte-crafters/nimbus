import { TFSItem, fetcher } from '@/libs/request';
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import React, { PropsWithChildren, useEffect, useState } from 'react';
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
    const [newUsers, setNewUsers] = useState<any>([]);
    //useMemo https://mui.com/material-ui/react-autocomplete/
    const [userList, setList] = useState<any>({});

    const handleShare = (items: TFSItem[], users: any) => {
        for (const user of users) {
            const userId = user.id;
            for (const item of items) {
                if ('extension' in item) {
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

    useEffect(() => {
        getItemsShares();
        handleChange();
    }, []);

    useEffect(() => {
        console.log(userList);
    }, [userList]);

    function getItemsShares() {
        const promises = [];
        for (const item of items) {
            if ('extension' in item) {
                promises.push(fetcher.getFileShares(item.id));
            } else {
                promises.push(fetcher.getFolderShares(item.id));
            }
        }

        const list = [];

        Promise.all(promises)
            .then((values) => {
                console.log(values);
                const arr = [];

                for (const index in values) {
                    arr.push(...values[index]);
                }

                return arr;
            })
            .then((arr) => {
                console.log(arr);
                const obj: any = {};

                for (const el of arr) {
                    const id = el.userId;

                    if (!obj[id]) {
                        obj[id] = {
                            name: id,
                            items: [],
                            rights: [],
                        };
                    }
                    if ('fileId' in el) {
                        obj[id].items.push(el.fileId);
                    } else if ('folderId' in el)
                        obj[id].items.push(el.folderId);
                    obj[id].rights.push(el.userRights);
                }

                setList(obj);
            });
    }

    function handleChange(val: string = '') {
        fetcher.getUserProfile().then(({ username }) => {
            fetcher
                .getPossibleUsers(val)
                .then((users) => {
                    setNewUsers(
                        users.filter((user) => user.username != username)
                    );
                })
                .catch((e) => console.log(e));
        });
    }

    const allEqual = (arr: any) => arr.every((v) => v === arr[0]);

    return (
        <Dialog onClose={hideModal} open={true}>
            <DialogTitle>{modalType}</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Add people</Typography>
                <Box sx={{ width: 400, display: 'flex' }}>
                    <Autocomplete
                        multiple
                        limitTags={2}
                        size={'small'}
                        disablePortal
                        options={newUsers.map(
                            (u: { username: any; id: any }) => {
                                return { label: u.username, id: u.id };
                            }
                        )}
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
                </Box>
                <Typography variant="h6">People with access</Typography>
                <List
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {Object.keys(userList).map((key) => {
                        const { rights } = userList[key];
                        const equal = allEqual(rights);

                        const value =
                            rights.length != items.length || !equal
                                ? 3
                                : rights[0];

                        return (
                            <ListItem key={key}>
                                <ListItemText primary={key} />
                                <Select
                                    value={value}
                                    // onChange={(e) => setAccess(e.target.value)}
                                    inputProps={{
                                        'aria-label': 'Without label',
                                    }}
                                    sx={{ height: 40, width: 100 }}
                                >
                                    <MenuItem value={0}>
                                        <em>Remove access</em>
                                    </MenuItem>
                                    <MenuItem value={1}>
                                        <em>View</em>
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        <em>Edit</em>
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        <em>Mixed</em>
                                    </MenuItem>
                                </Select>
                            </ListItem>
                        );
                    })}
                </List>
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
