import { Inject, Injectable } from '@nestjs/common';
import * as fsSync from 'node:fs';
import { ReadStream, createReadStream } from 'node:fs';
import * as fsAsync from 'node:fs/promises';
import path from 'node:path';
import util from 'node:util';
import { IConfigService } from '../config/dev.config.service';
import { CannotCreateUserRootFolderError } from '../errors/logic/CannotCreateRootFolder';

export interface IFileSystemService {
    createNestedFolder(parentFolders: string[]): void;
    getFileStream(filePath: string): ReadStream;
    createRootFolder(): Promise<void>;
    createUserRootFolder(userId: string): Promise<void>;
    getUserRootFolderPathStringSync(username: string): string;
    writeFile(fileBuffer: Buffer, filePath: string): Promise<void>
}

/**
 * Create files and folders on the server. This service knows NOTHING about users and virtual file structure.
 */
@Injectable()
export class FileSystemService implements IFileSystemService {
    constructor(
        @Inject(Symbol.for('IConfigService')) private configService: IConfigService
    ) { }

    getFileStream(filePath: string) {
        return createReadStream(filePath);
    }

    async writeFile(fileBuffer: Buffer, filePath: string): Promise<void> {
        return fsAsync
            .writeFile(filePath, fileBuffer)
            .then(() => {
                console.log('Buffer has been written to file successfully');
            })
            .catch((err) => {
                console.error(err);
            });
    }

    async removeFolder(folderPath: string) {
        try {
            return fsSync.rmSync(folderPath);
        } catch (e: unknown) {
            console.log(e);
            throw e;
        }
    }

    removeFile(filePath: string) {
        return fsAsync
            .unlink(filePath)
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
    async createNestedFolder(parentFolders: string[]): Promise<Boolean> {
        try {
            await fsAsync.mkdir(path.join(this.configService.getStoragePath(), ...parentFolders));
        } catch (e: any) {
            if (e.code === 'EEXIST') {
                return true;
            }

            throw e;
        }
    }

    async createRootFolder(): Promise<void> {
        try {
            return await fsAsync.mkdir(this.configService.getStoragePath());
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

    async createUserRootFolderByPath(path: string) {
        try {
            await fsAsync.mkdir(path);
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

    async checkIfRootFolderExists() {
        return fsAsync
            .access(this.configService.getStoragePath())
            .then(() => true)
            .catch(() => false);
    }

    /** Just generates string value WITHOUT creating folders. */
    getUserRootFolderPathStringSync(username: string): string {
        return path.join(this.configService.getStoragePath(), username);
    }

    /** TODO Need to disallow some username symbols. */
    async createUserRootFolder(userId: string): Promise<void> {
        try {
            const rootFolderExists = await this.checkIfRootFolderExists();

            if (!rootFolderExists) await this.createRootFolder();

            const path = this.getUserRootFolderPathStringSync(userId);
            await this.createUserRootFolderByPath(path);
        } catch (e: unknown) {
            // if (e instanceof CannotCreateUserRootFolderError) {
            //     throw e
            // }

            throw e;
        }
    }
}
