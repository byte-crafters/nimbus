import { createSlice } from '@reduxjs/toolkit';
import { TFile, TFolder, TPath } from '../request';

export type TMyFilesInitialState = {
    files: TFile[];
    folders: TFolder[];
    path: TPath[];
    openedFolder: TFolder | null;
};

const initialState: TMyFilesInitialState = {
    files: [],
    folders: [],
    path: [],
    openedFolder: null,
};
export const myFilesSlice = createSlice({
    name: 'myFiles',
    initialState,
    reducers: {
        setMyFolders: (state, action) => {
            state.folders = action.payload;
        },
        setMyFiles: (state, action) => {
            state.files = action.payload;
        },
        setMyPath: (state, action) => {
            state.path = action.payload;
        },
        setMyOpenedFolder: (state, action) => {
            state.openedFolder = action.payload;
        },
    },
});

export const { setMyFolders, setMyFiles, setMyPath, setMyOpenedFolder } =
    myFilesSlice.actions;

export const myFilesReducer = myFilesSlice.reducer;
