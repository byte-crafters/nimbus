import Button from "@mui/material/Button";
import { useRef, useState, useEffect } from "react";
import UploadIcon from '@mui/icons-material/Upload';
import { setMyFiles, setMyFolders, setMyOpenedFolder } from "@/libs/redux/my-files.reducer";
import { useAppDispatch, useAppSelector } from "@/libs/redux/store";
import { fetcher } from "@/libs/request";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export type TDropzoneProps = {};

export const Dropzone = ({ }: TDropzoneProps) => {

    const dropzoneRef = useRef<HTMLDivElement>(null);
    const [dropzoneActive, setDropzoneActive] = useState(false);

    const filesInput = useRef<HTMLInputElement>(null);
    const [filesLoaded, setFilesLoaded] = useState<File[]>([]);
    const { files, folders, path, openedFolder } = useAppSelector((state) => state.myFiles);

    const dispatch = useAppDispatch();

    function addFile(file: File) {
        setFilesLoaded((prev) => {
            const newState = [...prev, file];
            console.log(newState);
            return newState;
        });
    }

    useEffect(() => {
        if (dropzoneRef.current) {
            dropzoneRef.current.addEventListener('dragenter', (e) => {
                e.preventDefault();

                setDropzoneActive(true);
            });

            dropzoneRef.current.addEventListener('dragleave', (e) => {
                e.preventDefault();

                setDropzoneActive(false);
            });

            dropzoneRef.current.addEventListener('dragover', (e) => {
                /** Need to preventDefault to let `drop` event fire */
                e.preventDefault();
            });
        }

        // TODO: clear
    });

    const onDrop = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();

        console.log(e.dataTransfer.items);
        // console.log(e.dataTransfer.files[0].name!)

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...e.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file !== null) {
                        console.log(file);
                        console.log(`… file[${i}].name = ${file!.name}`);

                        addFile(file);
                    }
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...e.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
            });
        }

        setDropzoneActive(false);
        console.log('DROPY');
    };

    function onUploadFile(data: FormData) {
        if (openedFolder) {
            fetcher
                .uploadFiles(data, openedFolder?.id)
                .then(({ folders, currentFolder, files }) => {
                    dispatch(setMyFiles(files));
                    dispatch(setMyFolders(folders));
                    dispatch(setMyOpenedFolder(currentFolder));
                });
        }
    }


    const uploadFileInBox = (e: React.MouseEvent<HTMLElement>) => {
        const data = new FormData();

        for (const file of filesLoaded) {
            data.append('files', file, file.name);
        }

        onUploadFile(data);
    };


    const onAddFileManually = () => {
        for (const file of filesInput.current!.files!) {
            addFile(file);
        }
    };

    return (
        <>
            <div
                className={[
                    'dropzone',
                    dropzoneActive ? 'dropzone__dragover' : undefined,
                ]
                    .join(' ')
                    .trim()}
                id="dropzone"
                onClick={() => {
                    filesInput.current?.click();
                }}
                ref={dropzoneRef}
                onDrop={onDrop}
                onDragOver={(e: React.DragEvent<HTMLElement>) => { }}
            >
                {filesLoaded.map((f, index) => {
                    return (
                        <div className="dropzone_item" key={index}>
                            {f.name}
                        </div>
                    );
                })}
            </div>
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
            <Button
                variant="contained"
                color="secondary"
                endIcon={<UploadIcon />}
                onClick={uploadFileInBox}
            >
                Upload
            </Button>
        </>
    );
};