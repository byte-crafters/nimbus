import { ClientRegistrationError } from '@/app/errors/ClientRegistrationError';
import { ClientUnauthorizedError } from '@/app/errors/ClientUnauthorizedError';
import { TFoldersList } from '@/app/files/my/page';

export const METHODS = {
    GET: 'GET',
    POST: 'POST',
};

export const HEADER = {
    Accept: 'Accept',
    ContentType: 'Content-Type',
};

export const HEADERS_VALUE = {
    JSON: 'application/json',
};

export type TFolder = {
    parentId: string;
    name: string;
    id: string;
    owner: string;
};

/**
 * Dont bind to method because it changes!
 */
export type TGetChildren = {
    parentFolder: TFolder;
    folders: TFolder[];
    files: TFile[];
    currentPath: TPath[];
};

export type TPath = {
    name: string;
    id: string;
};

export type TPostCreateFolder = {
    parentFolder: TFolder;
    folders: TFolder[];
};

export type TGetUserRootFolderChildren = {
    parentFolder: TFolder;
    folders: TFolder[];
};

export type TGetUserProfile = {
    rootFolder: TFolder;
    id: string;
};

export type TRenameFolder = {
    folder: TFolder;
};

export type TFile = {
    extension: string;
    folderId: string;
    id: string;
    name: string;
    owner: string;
};

export type TUploadFilesResult = {
    files: TFile[];
    folders: TFoldersList;
    currentFolder: TFolder;
};

export type TRemoveFileResult = {
    files: TFile[];
    folders: TFoldersList;
    currentFolder: TFolder;
};

export type TDownloadFile = void;

export class Requester {
    private host: string = process.env.NEXT_PUBLIC_NIMBUS_API_HOST ?? '';

    async getAllFiles() {
        try {
            return await fetch(`${this.host}/api/v1/files/get-all-files`, {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async getAllFolders() {
        try {
            return await fetch(`${this.host}/api/v1/files/get-all-folders`, {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async getMySharedFolders() {
        try {
            return await fetch(`${this.host}/api/v1/files/get-my-shared-folders`, {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async getMySharedFiles() {
        try {
            return await fetch(`${this.host}/api/v1/files/get-my-shared-files`, {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async getSharedWithMeFiles() {
        try {
            return await fetch(`${this.host}/api/v1/files/get-shared-with-me-files`, {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async getSharedWithMeFolders() {
        try {
            return await fetch(`${this.host}/api/v1/files/get-shared-with-me-folders`, {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async shareFiles(fileId: string, userId: string) {
        try {
            return await fetch(`${this.host}/api/v1/files/share/files`, {
                body: JSON.stringify({
                    access: [
                        {
                            userId,
                            fileId,
                            value: {
                                view: true
                            }
                        }
                    ]
                }),
                method: METHODS.POST,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async shareFolders(folderId: string, userId: string) {
        try {
            return await fetch(`${this.host}/api/v1/files/share/folders`, {
                body: JSON.stringify({
                    access: [
                        {
                            userId,
                            folderId,
                            value: {
                                view: true
                            }
                        }
                    ]
                }),
                method: METHODS.POST,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            console.error(e);
            throw e;
        }
    }

    async getFileShares(fileId: string) {
        const response = await fetch(
            `${this.host}/api/v1/files/share/file/${fileId}`,
            {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                }
            }
        );

        const jsonResponse = await this.handleResponse(response);
        return jsonResponse;
    }

    async register(login: string, password: string) {
        try {
            return await fetch(`${this.host}/api/v1/auth/register`, {
                body: JSON.stringify({
                    username: login,
                    password: password,
                }),
                method: METHODS.POST,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            // console.error(e);
            throw new ClientRegistrationError();
        }
    }

    getUserProfile(): Promise<TGetUserProfile> {
        try {
            return fetch(`${this.host}/api/v1/auth/profile`, {
                method: METHODS.GET,
                credentials: 'include',
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                    [HEADER.ContentType]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            // console.error(e);
            throw new ClientRegistrationError();
        }
    }

    async deleteFolder(
        folderId: string,
        softDelete: boolean
    ): Promise<TRenameFolder> {
        try {
            const response = await fetch(
                `${this.host}/api/v1/files/folder/delete/${folderId}`,
                {
                    method: METHODS.POST,
                    credentials: 'include',
                    headers: {
                        [HEADER.Accept]: HEADERS_VALUE.JSON,
                        [HEADER.ContentType]: HEADERS_VALUE.JSON,
                    },
                    body: JSON.stringify({
                        softDelete,
                    }),
                }
            );

            const jsonResponse = await this.handleResponse(response);
            return jsonResponse;
        } catch (e: unknown) {
            // console.error(e);
            throw new ClientRegistrationError();
        }
    }

    async renameFolder(
        folderId: string,
        newFolderName: string
    ): Promise<TRenameFolder> {
        try {
            const response = await fetch(
                `${this.host}/api/v1/files/folder/rename/${folderId}`,
                {
                    method: METHODS.POST,
                    credentials: 'include',
                    headers: {
                        [HEADER.Accept]: HEADERS_VALUE.JSON,
                        [HEADER.ContentType]: HEADERS_VALUE.JSON,
                    },
                    body: JSON.stringify({
                        newFolderName: newFolderName,
                    }),
                }
            );

            const jsonResponse = await this.handleResponse(response);
            return jsonResponse;
        } catch (e: unknown) {
            // console.error(e);
            throw new ClientRegistrationError();
        }
    }

    getUserRootFolder(): Promise<TGetUserRootFolderChildren> {
        return fetch(`${this.host}/api/v1/files/user/folder/root`, {
            method: METHODS.GET,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            },
        }).then(this.handleResponse);
    }

    getChildren(folderId: string): Promise<TGetChildren> {
        return fetch(`${this.host}/api/v1/files/folder/${folderId}`, {
            method: METHODS.GET,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            },
        }).then(this.handleResponse);
    }

    postCreateFolder(
        folderName: string,
        parentFolderId: string
    ): Promise<TPostCreateFolder> {
        return fetch(`${this.host}/api/v1/files/folder`, {
            body: JSON.stringify({
                folderName,
                parentFolderId,
            }),
            method: METHODS.POST,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            },
        }).then(this.handleResponse);
    }

    uploadFiles(data: FormData, folderId: string): Promise<TUploadFilesResult> {
        data.append('folderId', folderId);

        return fetch(`${this.host}/api/v1/files/upload`, {
            method: METHODS.POST,
            credentials: 'include',
            body: data,
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
            },
        }).then(this.handleResponse);
    }

    async removeFile(fileId: string): Promise<TRemoveFileResult> {
        try {
            return fetch(`${this.host}/api/v1/files/remove/${fileId}`, {
                method: METHODS.POST,
                credentials: 'include',
                // body: data,
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                },
            }).then(this.handleResponse);
        } catch (e: unknown) {
            // console.error(e);
            throw new ClientRegistrationError();
        }
    }

    async downloadFile(fileId: string): Promise<Blob> {
        try {
            return fetch(`${this.host}/api/v1/files/download/${fileId}`, {
                method: METHODS.GET,
                credentials: 'include',
                // body: data,
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                },
            }).then(async (response: Response) => {
                console.log(response);
                const res = await response.blob();
                return res;
            });
            //     .then((blob) => {
            //     console.log(blob);

            //     if (blob != null) {
            //         var url = window.URL.createObjectURL(blob);
            //         var a = document.createElement('a');
            //         a.href = url;
            //         a.download = "testyyy.txt";
            //         document.body.appendChild(a);
            //         a.click();
            //         a.remove();
            //     }
            // });
        } catch (e: unknown) {
            // console.error(e);
            throw new ClientRegistrationError();
        }
    }

    async getFileInfo(fileId: string): Promise<TFile> {
        try {
            return fetch(`${this.host}/api/v1/files/info/${fileId}`, {
                method: METHODS.GET,
                credentials: 'include',
                // body: data,
                headers: {
                    [HEADER.Accept]: HEADERS_VALUE.JSON,
                },
            }).then(async (response: Response) => {
                console.log(response);
                const res = await response.json();
                return res;
            });
        } catch (e: unknown) {
            // console.error(e);
            throw new ClientRegistrationError();
        }
    }

    private handleResponse = async (response: Response) => {
        if (response.ok) {
            return response.json();
        } else {
            const errorMessage = await response.json();
            // console.error(errorMessage);
            if (response.status === 401) {
                throw new ClientUnauthorizedError();
            } else {
                throw new Error('Cannot handle response on client.');
            }
        }
    };
}

export const fetcher = new Requester();
