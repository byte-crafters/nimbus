import { createSlice } from '@reduxjs/toolkit';
import { TFile, TFolder, TPath } from '../request';

export type TTrashFilesInitialState = {
    files: TFile[];
    folders: TFolder[];
    path: TPath[];
    openedFolder: TFolder | null;
};

const initialState: TTrashFilesInitialState = {
    files: [],
    folders: [],
    path: [],
    openedFolder: null,
};
export const trashFilesSlice = createSlice({
    name: 'trashFiles',
    initialState,
    reducers: {
        setTrashFolders: (state, action) => {
            state.folders = action.payload;
        },
        setTrashFiles: (state, action) => {
            state.files = action.payload;
        },
        setTrashPath: (state, action) => {
            state.path = action.payload;
        },
        setTrashOpenedFolder: (state, action) => {
            state.openedFolder = action.payload;
        },
    },
});

export const {
    setTrashFolders,
    setTrashFiles,
    setTrashPath,
    setTrashOpenedFolder,
} = trashFilesSlice.actions;

export const trashFilesReducer = trashFilesSlice.reducer;
