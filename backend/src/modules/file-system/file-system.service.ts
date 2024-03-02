import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { FILES } from '../files/constants';

export interface IFileSystemService {
    createNestedFolder(parentFolders: string[]): void;
}

/**
 * Create files and folders on the server. This service knows NOTHING about users and virtual file structure.
 */
@Injectable()
export class FileSystemService implements IFileSystemService {
    constructor() { }

    writeFile(fileBuffer: Buffer, filePath: string) {
        return fs.writeFile(filePath, fileBuffer)
            .then(() => {
                console.log('Buffer has been written to file successfully');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * TODO: remove - we dont need to create this folder in file system
     */
    createNestedFolder(parentFolders: string[]): void {
        fs.mkdir(path.join(FILES.FILES_PATH, ...parentFolders))
            .catch((e: any) => {
                if (e.code === 'EEXIST') {
                    return true;
                }

                throw e;
            });
    }

    createRootFolder() {
        // if (!fsSync.existsSync(FILES.FILES_PATH))
        return fs.mkdir(FILES.FILES_PATH)
            .catch((e: any) => {
                if (e.code === 'EEXIST') {
                    return true;
                }

                throw e;
            });
    }

    checkIfRootFolderExists() {
        return fs.access(FILES.FILES_PATH)
            .then(() => true)
            .catch(() => false);
    }

    /** Just generates string value WITHOUT creating folders. */
    getUserRootFolderPathString(username: string) {
        // return `${FILES.FILES_PATH}/${username}`;
        return path.join(FILES.FILES_PATH, username);
    }

    /** TODO Need to disallow some username symbols. */
    async createUserRootFolder(userId: string) {
        return this.checkIfRootFolderExists()
            .then((rootFolderExists) => {
                if (!rootFolderExists)
                    this.createRootFolder();

                const path = this.getUserRootFolderPathString(userId);

                return fs.mkdir(path)
                    .catch((e: any) => {
                        if (e.code === 'EEXIST') {
                            return true;
                        }

                        throw e;
                    });
            });
    }
}
