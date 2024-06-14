import { createSlice } from '@reduxjs/toolkit';
import { TFile, TFolder, TPath } from '../request';

export type TSearchInitialState = {
    value: string
};

const initialState: TSearchInitialState = {
    value: ''
};
export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.value = action.payload;
        }
    },
});

export const { setSearch } = searchSlice.actions;

export const searchFilesReducer = searchSlice.reducer;
