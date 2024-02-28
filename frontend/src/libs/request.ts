export const METHODS = {
    GET: 'GET',
    POST: 'POST'
};

export const HEADER = {
    Accept: 'Accept',
    ContentType: 'Content-Type'
};

export const HEADERS_VALUE = {
    JSON: 'application/json'
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
export type TGetChildrenFolders = {
    parentFolder: TFolder;
    folders: TFolder[];
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
    rootFolder: TFolder,
    id: string;
};

export class Requester {
    private host: string = process.env.NEXT_PUBLIC_NIMBUS_API_HOST ?? '';

    register(login: string, password: string) {
        return fetch(`${this.host}/api/v1/auth/register`, {
            body: JSON.stringify({
                username: login,
                password: password
            }),
            method: METHODS.POST,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            }
        })
            .then(this.handleResponse);
    }

    getUserProfile(): Promise<TGetUserProfile> {
        return fetch(`${this.host}/api/v1/auth/profile`, {
            method: METHODS.GET,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            }
        })
            .then(this.handleResponse);
    }

    getUserRootFolder(): Promise<TGetUserRootFolderChildren> {
        return fetch(`${this.host}/api/v1/files/user/folder/root`, {
            method: METHODS.GET,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            },
        })
            .then(this.handleResponse);
    }

    getChildrenFolders(folderId: string): Promise<TGetChildrenFolders> {
        return fetch(`${this.host}/api/v1/files/folder/${folderId}`, {
            method: METHODS.GET,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            },
        })
            .then(this.handleResponse);
    }

    postCreateFolder(folderName: string, parentFolderId: string): Promise<TPostCreateFolder> {
        return fetch(`${this.host}/api/v1/files/folder`, {
            body: JSON.stringify({
                folderName,
                parentFolderId
            }),
            method: METHODS.POST,
            credentials: 'include',
            headers: {
                [HEADER.Accept]: HEADERS_VALUE.JSON,
                [HEADER.ContentType]: HEADERS_VALUE.JSON,
            },
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
            throw new Error();
        }
    };
}

export const fetcher = new Requester();