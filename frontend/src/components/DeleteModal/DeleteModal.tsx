import { TFSItem, fetcher } from '@/libs/request';
import { PropsWithChildren } from 'react';
import { ConfirmationDialog } from '../ConfirmationDialog';

interface IProps {}

export const DeleteModal = ({}: PropsWithChildren<IProps>) => {
    const handleDelete = (items: TFSItem[]) => {
        items.map((item) => {
            if (item?.extension) {
                fetcher
                    .removeFile(item.id, true)
                    .then(({ folders, files, currentFolder }) => {
                        // setShowFolders(folders);
                        // setOpenedFolder?.(currentFolder);
                        // setFiles(files);
                    });
            } else {
                fetcher
                    .deleteFolder(item.id, false)
                    .then((obj) => {
                        // console.log('RENAMED');
                        console.log(obj);
                    })
                    .catch((e) => console.log(e));
            }
        });
    };

    return (
        <ConfirmationDialog
            message={'You want to remove this file?'}
            onSubmit={handleDelete}
        />
    );
};

//stringConfirmation
//confirmation
