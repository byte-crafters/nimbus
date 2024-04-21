import { Inject, Injectable } from '@nestjs/common';
import path from 'node:path';
import { IConfigService } from '../config/dev.config.service';
import {
    FileStructureRepository,
    // IFileStructureRepository,
    // TFileRepository,
} from '../file-structure/file-structure.service';
import { IFileSystemService } from '../file-system/file-system.service';
import { IFileStructureRepository, TFileId, TFileRepository, TFolderId } from '../file-structure/file-structure.type';

export interface IFileService {}

export type TRemoveFileResult = {
    folderId: TFolderId;
    fileId: TFileId;
};

export type TGetFileResult = {
    // folderId: string;
    // fileId: string;
};

@Injectable()
export class FileService implements IFileService {
    constructor(
        @Inject(Symbol.for('IFileStructureRepository')) private fileStructureService: IFileStructureRepository,
        @Inject(Symbol.for('IFileSystemService')) private fileSystem: IFileSystemService,
        @Inject(Symbol.for('IConfigService')) private config: IConfigService,
    ) {}

    /**
     * TODO: move this method to FileSystemService
     */
    private getRealPath(userFolder: string) {
        return path.join(this.config.getStoragePath(), userFolder);
    }

    async saveFileToFolder(
        userId: string,
        fileBuffer: Buffer,
        folderId: TFolderId,
        fileName: string,
        fileExtension: string,
    ): Promise<any> {
        const createdFile = await this.fileStructureService.createFile(fileName, fileExtension, folderId, userId);
        const realFolderPath = this.getRealPath(userId);
        const realFilePath = path.join(realFolderPath, createdFile.id.toString());
        this.fileSystem.writeFile(fileBuffer, realFilePath);
    }

    async getFileStreamById(fileId: TFileId, userId: string): Promise<any> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const file = await this.fileStructureService.getFileById(fileId);
            const realFolderPath = this.getRealPath(userId);
            const realFilePath = path.join(realFolderPath, file.id.toString());

            const fileStream = this.fileSystem.getFileStream(realFilePath);
            return fileStream;
        } catch (e: unknown) {}
    }

    async getFileInfoById(fileId: TFileId, userId: string): Promise<TFileRepository> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const file = await this.fileStructureService.getFileById(fileId);
            return file;
        } catch (e: unknown) {}
    }

    async removeFile(fileId: TFileId, userId: string): Promise<TRemoveFileResult> {
        try {
            /**
             * TODO
             * Run this code only as a transaction
             */
            const { folderId, id } = await this.fileStructureService.removeFile(fileId, false);
            const realFolderPath = this.getRealPath(userId);
            const realFilePath = path.join(realFolderPath, id.toString());
            await this.fileSystem.removeFile(realFilePath);

            return {
                folderId,
                fileId: id,
            };
        } catch (e: unknown) {}
    }
}
