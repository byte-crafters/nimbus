import { MODAL_TYPE, useModalContext } from '@/components/Modal/ModalProvider';
import { TFSItem, fetcher } from '@/libs/request';
import { MenuItem } from '@mui/material';
import { PropsWithChildren } from 'react';
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

    return (
        <div className={styles.normal}>
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
        </div>
    );
}
