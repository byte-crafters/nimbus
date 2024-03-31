import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { FILES } from '../files/constants';
import util from "node:util"
import { CannotCreateUserRootFolderError } from '../errors/logic/CannotCreateRootFolder';
import { CannotFullfillRequestError } from '../errors/logic/CannotFullfillRequest';
// import * as sd from ''

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

    removeFile(filePath: string) {
        return fs.unlink(filePath)
            .then(() => {
                console.log('File was removed successfully');
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

    async createRootFolder() {
        try {
            return await fs.mkdir(FILES.FILES_PATH);
        } catch (e: any) {
            if (e.errno !== undefined) {
                const systemErrorName = util.getSystemErrorName(e.errno);

                if (systemErrorName === 'ENOENT') {
                    throw new CannotCreateUserRootFolderError()
                }
            } 

            throw e;
        }
    }

    async createUserRootFolderByPath(path: string) {
        try {
            await fs.mkdir(path)
        } catch (e: any) {
            if (e.errno !== undefined) {
                const systemErrorName = util.getSystemErrorName(e.errno);

                if (systemErrorName === 'ENOENT') {
                    throw new CannotCreateUserRootFolderError();
                }
            }

            throw e;
        }
    }

    checkIfRootFolderExists() {
        return fs.access(FILES.FILES_PATH)
            .then(() => true)
            .catch(() => false);
    }

    /** Just generates string value WITHOUT creating folders. */
    getUserRootFolderPathStringSync(username: string) {
        // return `${FILES.FILES_PATH}/${username}`;
        return path.join(FILES.FILES_PATH, username);
    }

    /** TODO Need to disallow some username symbols. */
    async createUserRootFolder(userId: string) {
        try {
            const rootFolderExists = await this.checkIfRootFolderExists();

            if (!rootFolderExists)
                await this.createRootFolder();

            
            const path = this.getUserRootFolderPathStringSync(userId);
            await this.createUserRootFolderByPath(path)
        } catch (e: unknown) {
            // if (e instanceof CannotCreateUserRootFolderError) {
            //     throw e
            // }

            throw e
        }
    }
}
