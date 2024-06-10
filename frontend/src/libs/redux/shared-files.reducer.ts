import { createSlice } from '@reduxjs/toolkit';
import { TFile, TFolder, TPath } from '../request';

export type TSharedFilesInitialState = {
    files: TFile[];
    folders: TFolder[];
    path: TPath[];
    openedFolder: TFolder | null;
};

const initialState: TSharedFilesInitialState = {
    files: [],
    folders: [],
    path: [],
    openedFolder: null
};
export const sharedFilesSlice = createSlice({
    name: 'sharedFiles',
    initialState,
    reducers: {
        setSharedFolders: (state, action) => {
            state.folders = action.payload;
        },
        setSharedFiles: (state, action) => {
            state.files = action.payload;
        },
        setSharedPath: (state, action) => {
            state.path = action.payload;
        },
        setSharedOpenedFolder: (state, action) => {
            state.openedFolder = action.payload;
        },
    },
});

export const { setSharedFolders, setSharedFiles, setSharedPath } = sharedFilesSlice.actions;

export const sharedFilesReducer = sharedFilesSlice.reducer;