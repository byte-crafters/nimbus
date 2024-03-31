import { Inject, Injectable } from '@nestjs/common';
import path from 'node:path';
import { FileStructureService, TFile } from '../file-structure/file-structure.service';
import { FileSystemService } from '../file-system/file-system.service';
import { FILES } from './constants';
import { createReadStream } from 'node:fs';

export interface IFileService {

}

export type TRemoveFileResult = {
    folderId: string;
    fileId: string;
};

export type TGetFileResult = {
    // folderId: string;
    // fileId: string;
};

@Injectable()
export class FileService implements IFileService {
    constructor(
        @Inject(FileStructureService) private fileStructureService: FileStructureService,
        @Inject(FileSystemService) private fileSystem: FileSystemService,
    ) { }

    private getRealPath(userFolder: string) {
        return path.join(FILES.FILES_PATH, userFolder);
    }

    async saveFileToFolder(
        userId: string,
        fileBuffer: Buffer,
        folderId: string,
        fileName: string,
        fileExtension: string
    ): Promise<any> {
        const createdFile = await this.fileStructureService.createFile(fileName, fileExtension, folderId, userId);
        const realFolderPath = this.getRealPath(userId);
        const realFilePath = path.join(realFolderPath, createdFile.id);
        this.fileSystem.writeFile(fileBuffer, realFilePath);
    }

    async getFileStreamById(
        fileId: string,
        userId: string
    ): Promise<any> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const file = await this.fileStructureService.getFileById(fileId);
            const realFolderPath = this.getRealPath(userId);
            const realFilePath = path.join(realFolderPath, file.id);

            return createReadStream(realFilePath)
            // return {
            //     folderId,
            //     fileId: id
            // };
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async getFileInfoById(
        fileId: string,
        userId: string
    ): Promise<TFile> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const file = await this.fileStructureService.getFileById(fileId);
            return file
        } catch (e: unknown) {
            console.log(e);
        }
    }

    async removeFile(
        fileId: string,
        userId: string
    ): Promise<TRemoveFileResult> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const { folderId, id } = await this.fileStructureService.removeFile(fileId);
            const realFolderPath = this.getRealPath(userId);
            const realFilePath = path.join(realFolderPath, id);
            await this.fileSystem.removeFile(realFilePath);

            return {
                folderId,
                fileId: id
            };
        } catch (e: unknown) {
            console.log(e);
        }
    }
}
