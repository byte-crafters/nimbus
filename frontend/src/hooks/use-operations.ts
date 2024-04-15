import { TFile, TFolder } from '@/libs/request';

export const useOperations = (files: TFile[], folders: TFolder[]) => {
    return {
        canDelete: true,
        canRename: true,
        canDownload: true,
        canShare: true,
    };
};
