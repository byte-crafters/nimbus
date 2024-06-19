import { MODAL_TYPE, useModalContext } from '@/components/Modal/ModalProvider';
import { TFSItem, fetcher } from '@/libs/request';
import { MenuItem } from '@mui/material';
import { PropsWithChildren, useEffect, useState } from 'react';
import styles from './FileMenu.module.scss';

interface IMenuProps {
    selectedItems: TFSItem[];
    onRename?: (items: TFSItem[], name: string) => void;
    onDelete?: (items: TFSItem[]) => void;
    onDeleteRestore?: (items: TFSItem[]) => void;
    defaultGroup?: boolean;
    restoreGroup?: boolean;
    shareGroup?: boolean;
    onMenuClose: () => void;
    canShare: boolean;
    canEdit: boolean;
}

export function FileMenu({
    selectedItems,
    onRename,
    onDelete,
    onDeleteRestore,
    restoreGroup,
    defaultGroup,
    shareGroup,
    onMenuClose,
    canShare,
    canEdit,
}: PropsWithChildren<IMenuProps>) {
    const { showModal } = useModalContext();
    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        if (selectedItems) resolveEdit();
    }, []);

    const showRenameModal = () => {
        showModal(MODAL_TYPE.RENAME, {
            items: selectedItems,
            handler: onRename,
        });
    };

    const showDeleteModal = () => {
        showModal(MODAL_TYPE.DELETE, {
            items: selectedItems,
            handler: onDelete,
        });
    };

    const showDeleteBinModal = () => {
        showModal(MODAL_TYPE.DELETE_BIN, {
            items: selectedItems,
            handler: onDeleteRestore,
        });
    };

    const showRestoreModal = () => {
        showModal(MODAL_TYPE.RESTORE, {
            items: selectedItems,
            handler: onDeleteRestore,
        });
    };

    const showShareModal = () => {
        showModal(MODAL_TYPE.SHARE, {
            items: selectedItems,
            handler: () => {},
        });
    };

    const downloadFile = () => {
        console.log(selectedItems);

        for (const item of selectedItems) {
            if ('extension' in item) {
                Promise.all([
                    fetcher.downloadFile(item.id),
                    fetcher.getFileInfo(item.id),
                ]).then(([blob, fileInfo]) => {
                    console.log(blob, fileInfo);
                    if (blob != null) {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = fileInfo.name;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                });
            }
        }
    };

    function resolveEdit() {
        fetcher.getUserProfile().then((user) => {
            const currentUserId = user.id;
            const promises = [];
            for (const item of selectedItems) {
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
                                name: el.user.username,
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

                    console.log(obj);
                    console.log(currentUserId);

                    if (canShare) {
                        setEdit(true);
                    } else {
                        const rights = obj[currentUserId].rights;
                        const canEdit = allEqual(rights) && rights[0] == 2;

                        setEdit(canEdit);
                    }
                });
        });
    }

    const allEqual = (arr: any) => arr.every((v) => v === arr[0]);

    return (
        <div className={styles.normal}>
            {defaultGroup && (
                <>
                    {edit && selectedItems.length == 1 && (
                        <MenuItem onClick={showRenameModal}>Rename</MenuItem>
                    )}
                    <MenuItem onClick={downloadFile}>Download</MenuItem>
                    {canShare && (
                        <MenuItem onClick={showShareModal}>Share</MenuItem>
                    )}
                    {edit && (
                        <MenuItem onClick={showDeleteModal}>Delete</MenuItem>
                    )}
                </>
            )}

            {shareGroup && <></>}

            {restoreGroup && (
                <>
                    <MenuItem onClick={showRestoreModal}>Restore</MenuItem>
                    <MenuItem onClick={showDeleteBinModal}>Delete</MenuItem>
                </>
            )}
        </div>
    );
}
