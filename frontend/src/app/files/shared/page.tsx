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

export const FilesController = () => {
    const shareFileIdRef = useRef<any>();

    const shareFileUserIdRef = useRef<any>();
    return (
        <>
            <div>
                <h1>All my files</h1>
                <label htmlFor="">Get all my files</label>
                <button
                    onClick={() => {
                        fetcher
                            .getAllFiles()
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    get all my files
                </button>
            </div>
            <div>
                <h1>Get my files that i share with others</h1>
                <label htmlFor="">Get all my shared files</label>
                <button
                    onClick={() => {
                        fetcher
                            .getMySharedFiles()
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    get all my files
                </button>
            </div>
            <div>
                <h1>Get shared with me files</h1>
                <label htmlFor="">Get all files that are shared with me</label>
                <button
                    onClick={() => {
                        fetcher
                            .getSharedWithMeFiles()
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    get all my files
                </button>
            </div>
            <div>
                <h1>Share file</h1>
                <label htmlFor="">Share file id</label>
                <input placeholder='file id' type="text" name="" id="" ref={shareFileIdRef} />
                <button
                    onClick={() => {
                        fetcher
                            .shareFiles(shareFileIdRef.current.value, shareFileUserIdRef.current.value)
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    share this file with user
                </button>
                <input placeholder='user id' type="text" name="" id="" ref={shareFileUserIdRef} />
            </div>
        </>
    );
};

export const FoldersController = () => {
    const shareFolderIdRef = useRef<any>();

    const shareFolderUserIdRef = useRef<any>();
    return (
        <>
            <div>
                <h1>All my folders</h1>
                <label htmlFor="">Get all my folders</label>
                <button
                    onClick={() => {
                        fetcher
                            .getAllFolders()
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    get all my folders
                </button>
            </div>
            <div>
                <h1>Get my folders that i share with others</h1>
                <label htmlFor="">Get all my shared folders</label>
                <button
                    onClick={() => {
                        fetcher
                            .getMySharedFolders()
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    get all my folders
                </button>
            </div>
            <div>
                <h1>Get shared with me folders</h1>
                <label htmlFor="">Get all folders that are shared with me</label>
                <button
                    onClick={() => {
                        fetcher
                            .getSharedWithMeFolders()
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    get all my folders
                </button>
            </div>
            <div>
                <h1>Share folder</h1>
                <label htmlFor="">Share folder id</label>
                <input placeholder='folder id' type="text" name="" id="" ref={shareFolderIdRef} />
                <button
                    onClick={() => {
                        fetcher
                            .shareFolders(shareFolderIdRef.current.value, shareFolderUserIdRef.current.value)
                            .then(
                                (response) => {
                                    console.log(response);
                                }
                            );
                    }}
                >
                    share this folder with user
                </button>
                <input placeholder='user id' type="text" name="" id="" ref={shareFolderUserIdRef} />
            </div>
        </>
    );
};


export default function FilesContainer() {



    return (

        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                <div>
                    <FilesController />
                </div>

                <div>
                    <FoldersController />
                </div>
            </div>
        </>
    );
}
