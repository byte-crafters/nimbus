'use client';
import { TFile, TFolder, fetcher } from '@/libs/request';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { PathContext, ProfileContext } from '../../layout-page';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

export type TFoldersList = TFolder[];

export default function FilesContainer() {
    const { openedFolder, setOpenedFolder } = useContext(PathContext);
    const { loggedUser } = useContext(ProfileContext);
    const [showFoldersList, setShowFolders] = useState<TFoldersList>([]);
    const [files, setFiles] = useState<TFile[]>([]);

    const router = useRouter();

    const filesInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        /**
         * TODO: move this logic in template or layout
         */
        if (loggedUser === null) {
            router.push('/login');
        } else {
            if (openedFolder) {
                const folderId = openedFolder.id;
                fetcher.getChildren(folderId).then(({ folders, files }) => {
                    setShowFolders(folders);
                    setFiles(files);
                });
            }
        }
    }, [loggedUser]);

    useEffect(() => {
        if (openedFolder === null) {
            fetcher
                .getUserRootFolder()
                .then(({ folders }) => setShowFolders(folders));
        } else {
            const folderId = openedFolder.id;
            fetcher
                .getChildren(folderId)
                .then(({ folders }) => setShowFolders(folders));
        }
    }, []);

    return (
        <>
            <h1>Trash files</h1>
            <h2>Current user: `{loggedUser}`</h2>
            <h2>Current path: `{openedFolder?.id}`</h2>
            <br />

            <button
                onClick={() => {
                    if (openedFolder) {
                        const folderId = openedFolder.parentId;
                        fetcher
                            .getChildren(folderId)
                            .then(({ folders, parentFolder, files }) => {
                                setShowFolders(folders);
                                setOpenedFolder?.(parentFolder);
                                setFiles(files);
                            });
                    }
                }}
            >
                Get on upper level
            </button>

            <button
                onClick={() => {
                    const folderName = prompt('Folder name:');

                    if (folderName !== null) {
                        const parentFolderId = openedFolder!.id;

                        fetcher
                            .postCreateFolder(folderName, parentFolderId)
                            .then(({ folders }) => {
                                setShowFolders(folders);
                            });
                    }
                }}
            >
                Create folder
            </button>

            <input
                ref={filesInput}
                type="file"
                name="files"
                multiple
                onClick={() => {}}
            ></input>
            <button
                onClick={() => {
                    const data = new FormData();

                    for (const file of filesInput.current!.files!) {
                        data.append('files', file, file.name);
                    }

                    if (openedFolder) {
                        fetcher
                            .uploadFiles(data, openedFolder?.id)
                            .then(({ folders, currentFolder, files }) => {
                                setFiles(files);
                                setShowFolders(folders);
                                setOpenedFolder?.(currentFolder);
                            });
                    }
                }}
            >
                Save
            </button>

            <h6>folders:</h6>
            <ul>
                {showFoldersList.map((folder: TFolder) => {
                    return (
                        <li
                            onClick={() => {
                                fetcher
                                    .getChildren(folder.id)
                                    .then(({ folders, files }) => {
                                        setShowFolders(folders);
                                        setOpenedFolder?.(folder);
                                        setFiles(files);
                                    });
                            }}
                            id={`folder-item-${folder.id}`}
                            key={folder.id}
                        >
                            {/* <div>asd</div> */}
                            <div>
                                <button
                                    onClick={() => {
                                        const newName = prompt(
                                            'Enter new folder name:'
                                        );
                                        if (
                                            newName !== null &&
                                            newName.trim() !== ''
                                        ) {
                                            fetcher
                                                .renameFolder(
                                                    folder.id,
                                                    newName
                                                )
                                                .then(({ folder }) => {
                                                    console.log('RENAMED');
                                                    console.log(folder);
                                                });
                                        }
                                    }}
                                >
                                    rename
                                </button>
                                <button
                                    onClick={() => {
                                        const yes = prompt(
                                            'You want to remove this file first in TRASH BIN?:'
                                        );

                                        if (yes === 'yes') {
                                            fetcher
                                                .deleteFolder(folder.id, true)
                                                .then(({ folder }) => {
                                                    console.log('RENAMED');
                                                    console.log(folder);
                                                });
                                        } else {
                                            fetcher
                                                .deleteFolder(folder.id, false)
                                                .then(({ folder }) => {
                                                    console.log('RENAMED');
                                                    console.log(folder);
                                                });
                                        }

                                        // if (newName !== null && newName.trim() !== '') {
                                        //     fetcher
                                        //         .renameFolder(folder.id, newName)
                                        //         .then(
                                        //             ({ folder }) => {
                                        //                 console.log('RENAMED');
                                        //                 console.log(folder);
                                        //             }
                                        //         );
                                        // }
                                    }}
                                >
                                    delete
                                </button>
                                ./{folder.name} - {folder.id}
                            </div>
                        </li>
                    );
                })}
            </ul>

            <h6>files:</h6>
            <ul>
                {files.map((file: TFile) => {
                    return (
                        <li id={`file-item-${file.id}`} key={file.id}>
                            <button
                                onClick={() => {
                                    fetcher
                                        .removeFile(file.id)
                                        .then(
                                            ({
                                                folders,
                                                files,
                                                currentFolder,
                                            }) => {
                                                setShowFolders(folders);
                                                setOpenedFolder?.(
                                                    currentFolder
                                                );
                                                setFiles(files);
                                            }
                                        );
                                }}
                            >
                                delete
                            </button>
                            <button
                                onClick={() => {
                                    Promise.all([
                                        fetcher.downloadFile(file.id),
                                        fetcher.getFileInfo(file.id),
                                    ]).then(([blob, fileInfo]) => {
                                        console.log(blob, fileInfo);
                                        if (blob != null) {
                                            var url =
                                                window.URL.createObjectURL(
                                                    blob
                                                );
                                            var a = document.createElement('a');
                                            a.href = url;
                                            a.download =
                                                'temp+' + fileInfo.name;
                                            document.body.appendChild(a);
                                            a.click();
                                            a.remove();
                                        }
                                    });
                                }}
                            >
                                download
                            </button>
                            {file.name}
                        </li>
                    );
                })}
            </ul>

            <Link href={'/login'}>Login</Link>
            <br />
            <Link href={'/register'}>Register</Link>
            <br />
        </>
    );
}
