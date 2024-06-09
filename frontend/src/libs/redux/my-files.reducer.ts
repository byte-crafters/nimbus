import { createSlice } from '@reduxjs/toolkit';

export const myFilesSlice = createSlice({
    name: 'myFiles',
    initialState: {
        value: {
            files: [],
            folders: []
        },
    },
    reducers: {
        addFolders: (state, action) => {
            state.value.folders = action.payload;
        },
        addFiles: (state, action) => {
            state.value.files = action.payload;
        },
    },
});

export const { addFolders, addFiles } = myFilesSlice.actions;

export const myFilesReducer = myFilesSlice.reducer;