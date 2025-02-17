import { TFSItem, fetcher } from '@/libs/request';
import { PropsWithChildren } from 'react';
import { ConfirmationDialog } from '../ConfirmationDialog';

interface IProps {}

export const DeleteBinModal = ({}: PropsWithChildren<IProps>) => {
    const handleDelete = (items: TFSItem[]) => {
        items.map((item) => {
            if ('extension' in item) {
                fetcher
                    .removeFile(item.id, false)
                    .then((obj) => {
                        console.log(obj);
                    })
                    .catch((e) => console.log(e));
            } else {
                fetcher
                    .deleteFolder(item.id, false)
                    .then((obj) => {
                        console.log(obj);
                    })
                    .catch((e) => console.log(e));
            }
        });
    };

    return (
        <ConfirmationDialog
            message={'You want to remove this file from bin?'}
            onSubmit={handleDelete}
        />
    );
};

//stringConfirmation
//confirmation
