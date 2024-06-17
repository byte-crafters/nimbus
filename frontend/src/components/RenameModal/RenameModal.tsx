import { TFSItem, fetcher } from '@/libs/request';
import { PropsWithChildren } from 'react';
import { StringDialog } from '../StringDialog';

interface IProps {}

export const RenameModal = ({}: PropsWithChildren<IProps>) => {
    const handleRename = (items: TFSItem[], newName: string) => {
        const item = items[0];
        if ('extension' in item) {
        } else {
            fetcher.renameFolder(item.id, newName).then(({ folder }) => {
                console.log('RENAMED');
                console.log(folder);
            });
        }
    };

    return <StringDialog onSubmit={handleRename} />;
};
