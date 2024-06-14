import AttachFileIcon from '@mui/icons-material/AttachFile';
import Button from '@mui/material/Button';
import { useContext, useRef } from 'react';
import { UploadedFilesContext } from '../UploadFilesProvider/UploadFilesProvider';

export type TDropzoneProps = {};

export const AttachFilesControl = ({}: TDropzoneProps) => {
    const filesInput = useRef<HTMLInputElement>(null);
    const [, setFilesLoaded] = useContext(UploadedFilesContext)

    const onAddFileManually = () => {
        for (const file of filesInput.current!.files!) {
            setFilesLoaded((prev) => {
                const newState = [...prev, file];
                console.log(newState);
                return newState;
            });
        }
    };

    return (
        <>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                color="secondary"
                endIcon={<AttachFileIcon />}
            >
                Add files
                <input
                    style={{
                        clip: 'rect(0 0 0 0)',
                        clipPath: 'inset(50%)',
                        height: 1,
                        overflow: 'hidden',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        whiteSpace: 'nowrap',
                        width: 1,
                    }}
                    ref={filesInput}
                    type="file"
                    name="files"
                    multiple
                    onChange={onAddFileManually}
                ></input>
            </Button>
        </>
    );
};
