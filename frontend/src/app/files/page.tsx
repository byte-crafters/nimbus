'use client';
import { TFolder, fetcher } from '@/libs/request';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { PathContext, ProfileContext } from '../layout-page';

/**
 * If context === null - user is NOT logged in. `context` === string when user is logged in.
 */

export type TFoldersList = TFolder[];

export default function FilesContainer() {
    const { openedFolder, setOpenedFolder } = useContext(PathContext);
    const { loggedUser } = useContext(ProfileContext);
    const [showFoldersList, setShowFolders] = useState<TFoldersList>([]);

    const router = useRouter();

    useEffect(() => {
        /**
         * TODO: move this logic in template or layout
         */
        if (loggedUser === null) {
            router.push('/login');
        } else {
            if (openedFolder) {
                const folderId = openedFolder.id;
                fetcher
                    .getChildrenFolders(folderId)
                    .then(({ folders }) => setShowFolders(folders));
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
                .getChildrenFolders(folderId)
                .then(({ folders }) => setShowFolders(folders));
        }
    }, []);

    return (
        <>
            <h1>Files</h1>
            <h2>Current user: `{loggedUser}`</h2>
            <h2>Current path: `{openedFolder?.id}`</h2>
            <br />

            <button
                onClick={() => {
                    if (openedFolder) {
                        const folderId = openedFolder.parentId;
                        fetcher
                            .getChildrenFolders(folderId)
                            .then(({ folders, parentFolder }) => {
                                setShowFolders(folders);
                                setOpenedFolder?.(parentFolder);
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

            <ul>
                {showFoldersList.map((folder: TFolder) => {
                    return (
                        <li
                            onClick={() => {
                                fetcher
                                    .getChildrenFolders(folder.id)
                                    .then(({ folders }) => {
                                        setShowFolders(folders);
                                        setOpenedFolder?.(folder);
                                    });
                            }}
                            id={`folder-item-${folder.id}`}
                            key={folder.id}
                        >
                            ./{folder.name} - {folder.id}
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