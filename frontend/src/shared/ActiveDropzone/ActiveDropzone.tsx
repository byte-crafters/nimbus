'use client';
import { Dispatch, SetStateAction, forwardRef, useContext, useEffect, useRef } from 'react';
import { UploadedFilesContext } from '../UploadFilesProvider/UploadFilesProvider';
import style from './ActiveDropzone.module.scss';

export type TDropzoneProps = {
    active: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
};

export const ActiveDropzone = forwardRef(function ActiveDropzone(
    { active: dropzoneActive, setActive: setDropzoneActive }: TDropzoneProps,
    fileAreaRef: any
) {
    const dropzoneRef = useRef<HTMLDivElement>(null);

    const [, setFilesLoaded] = useContext(UploadedFilesContext);

    function addFile(file: File) {
        setFilesLoaded((prev) => {
            const newState = [...prev, file];
            console.log(newState);
            return newState;
        });
    }

    const onDropHandler = (e: any) => {
        e.preventDefault();

        if (e.dataTransfer.items) {
            [...e.dataTransfer.items].forEach((item, i) => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file !== null) {
                        addFile(file);
                    }
                }
            });
        } else {
            [...e.dataTransfer.files].forEach((file, i) => {
                addFile(file);
            });
        }

        setDropzoneActive(false);
    };

    useEffect(() => {
        if (fileAreaRef !== null && fileAreaRef.current !== null) {
            fileAreaRef.current.addEventListener('dragenter', (e: any) => {
                e.preventDefault();
                setDropzoneActive(true);
            });

            fileAreaRef.current.addEventListener('dragleave', (e: any) => {
                e.preventDefault();
                setDropzoneActive(false);
            });

            fileAreaRef.current.addEventListener('dragover', (e: any) => {
                /** NOTE: need to preventDefault to let `drop` event fire */
                e.preventDefault();
                console.log('over!');
            });

            fileAreaRef.current.addEventListener('drop', onDropHandler);
        }

        /** TODO: clear other handlers */
        return () => {
            fileAreaRef.current.removeEventListener('drop', onDropHandler)
        }
    }, []);

    const component = <>
        <div
            className={`${style.activeDropzone} ${dropzoneActive ? 'dropzone__dragover' : undefined}`}
            ref={dropzoneRef}>
        </div>
    </>;

    return <>
        {dropzoneActive ? component : null}
    </>;
});
