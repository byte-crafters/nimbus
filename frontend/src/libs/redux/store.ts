import { configureStore } from '@reduxjs/toolkit';
import { myFilesReducer } from './my-files.reducer';

export default configureStore({
    reducer: {
        myFiles: myFilesReducer,
    },
});