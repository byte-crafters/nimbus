import {
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    createContext,
    useState,
} from 'react';

export const UploadedFilesContext = createContext<
    [File[], Dispatch<SetStateAction<File[]>>]
>([[], () => {}]);

export const UploadFilesProvider = ({ children }: PropsWithChildren) => {
    const uploadFilesState = useState<File[]>([]);

    return (
        <UploadedFilesContext.Provider value={uploadFilesState}>
            {children}
        </UploadedFilesContext.Provider>
    );
};
