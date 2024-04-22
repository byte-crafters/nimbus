import { TFSItem, TFile, TFolder } from '@/libs/request';

export const useOperations = (seletctedItems: TFSItem[]) => {
    return {
        canDelete: true,
        canRename: true,
        canDownload: true,
        canShare: true,
    };
};
