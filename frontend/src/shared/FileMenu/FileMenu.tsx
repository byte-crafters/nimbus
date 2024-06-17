import { MODAL_TYPE, useModalContext } from '@/components/Modal/ModalProvider';
import { TFSItem, fetcher } from '@/libs/request';
import { MenuItem } from '@mui/material';
import { PropsWithChildren } from 'react';

interface IMenuProps {
    selectedItems: TFSItem[];
    onRename: (items: TFSItem[], name: string) => void;
    onDelete: (items: TFSItem[]) => void;
    onDeleteRestore: (items: TFSItem[]) => void;
    defaultGroup?: boolean;
    restoreGroup?: boolean;
    shareGroup?: boolean;
}

export function FileMenu({
    selectedItems,
    onRename,
    onDelete,
    onDeleteRestore,
    restoreGroup,
    defaultGroup,
    shareGroup,
}: PropsWithChildren<IMenuProps>) {
    const { showModal } = useModalContext();

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
                        a.download = 'temp+' + fileInfo.name;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    }
                });
            }
        }
    };

    return (
        <>
            {/* {options &&
                Object.keys(options).map((item) => {
                    const { name, handler } = options[item];

                    return (
                        <MenuItem
                            key={item}
                            onClick={() => {
                                console.log(handler);
                            }}
                        >
                            {name}
                        </MenuItem>
                    );
                })} */}
            {defaultGroup && (
                <>
                    <MenuItem onClick={showRenameModal}>Rename</MenuItem>
                    <MenuItem onClick={downloadFile}>Download</MenuItem>
                    <MenuItem onClick={showShareModal}>Share</MenuItem>
                    <MenuItem onClick={showDeleteModal}>Delete</MenuItem>
                </>
            )}

            {shareGroup && <></>}

            {restoreGroup && (
                <>
                    <MenuItem onClick={showRestoreModal}>Restore</MenuItem>
                    <MenuItem onClick={showDeleteBinModal}>Delete</MenuItem>
                </>
            )}
        </>
    );
}
