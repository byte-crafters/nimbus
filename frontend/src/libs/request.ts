import { TFoldersList } from "@/app/files/page";

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
    currentPath: string[];
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

export type TFile = {
    extension: string;
    folderId: string;
    id: string;
    name: string;
    owner: string;
};

export type TUploadFilesResult = {
    files: TFile[],
    folders: TFoldersList,
    currentFolder: TFolder;
};

export class Requester {
    private host: string = process.env.NEXT_PUBLIC_NIMBUS_API_HOST ?? '';

    register(login: string, password: string) {
        return fetch(`${this.host}/api/v1/auth/register`, {
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
    }

    getUserProfile(): Promise<TGetUserProfile> {
        return fetch(`${this.host}/api/v1/auth/profile`, {
            method: METHODS.GET,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            },
        }).then(this.handleResponse);
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
            }
        })
            .then(this.handleResponse);
    }

    private handleResponse = (response: Response) => {
        if (response.ok) {
            return response.json();
        } else {
            if (response.status === 502) {
                console.error(502, response.statusText);
            }
            throw new Error(response.statusText);
        }
    };
}

export const fetcher = new Requester();
