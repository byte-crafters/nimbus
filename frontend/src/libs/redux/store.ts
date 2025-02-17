import { configureStore } from '@reduxjs/toolkit';
import { myFilesReducer } from './my-files.reducer';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { sharedFilesReducer } from './shared-files.reducer';
import { trashFilesReducer } from './trash-files.reducer';
import { searchFilesReducer } from './search.reducer';

export const store = configureStore({
    reducer: {
        myFiles: myFilesReducer,
        sharedFiles: sharedFilesReducer,
        trashFiles: trashFilesReducer,
        search: searchFilesReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
