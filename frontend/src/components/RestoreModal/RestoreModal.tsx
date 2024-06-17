import { TFSItem, fetcher } from '@/libs/request';
import { PropsWithChildren } from 'react';
import { ConfirmationDialog } from '../ConfirmationDialog';

interface IProps {}

export const RestoreModal = ({}: PropsWithChildren<IProps>) => {
    const handleDelete = (items: TFSItem[]) => {
        items.map((item) => {
            if ('extension' in item) {
                fetcher
                    .recoverFile(item.id)
                    .then((obj) => {
                        console.log(obj);
                    })
                    .catch((e) => console.log(e));
            } else {
                fetcher
                    .recoverFolder(item.id)
                    .then((obj) => {
                        console.log(obj);
                    })
                    .catch((e) => console.log(e));
            }
        });
    };

    return (
        <ConfirmationDialog
            message={'You want to restore this file from bin?'}
            onSubmit={handleDelete}
        />
    );
};

//stringConfirmation
//confirmation
