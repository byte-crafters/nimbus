import { TFSItem, fetcher } from '@/libs/request';
import { PropsWithChildren } from 'react';
import { StringDialog } from '../StringDialog';

interface IProps {}

export const RenameModal = ({}: PropsWithChildren<IProps>) => {
    const handleRename = (items: TFSItem[], newName: string) => {
        const item = items[0];
        if ('extension' in item) {
            fetcher.renameFile(item.id, newName).then(({ file }) => {
                console.log(file);
            });
        } else {
            fetcher.renameFolder(item.id, newName).then(({ folder }) => {
                console.log(folder);
            });
        }
    };

    return <StringDialog onSubmit={handleRename} />;
};
