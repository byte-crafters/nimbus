import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { FILES } from './constants';

export interface FileSystemService {

}

@Injectable()
export class FileSystemService implements FileSystemService {
    constructor() { }

    createRootFolder() {
        return fs.mkdir(FILES.FILES_PATH);
    }

    checkIfRootFolderExists() {
        return fs.access(FILES.FILES_PATH);
    }

    /** Just generates string value WITHOUT creating folders. */
    getUserRootFolderPathString(username: string) {
        return `${FILES.FILES_PATH}/${username}`;
    }

    /** TODO Need to disallow some username symbols. */
    createUserRootFolder(username: string) {
        return this.checkIfRootFolderExists()
            .then(() => {
                fs.mkdir(this.getUserRootFolderPathString(username));;
            });
    }
}
