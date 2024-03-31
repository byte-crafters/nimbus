import { Inject, Injectable } from '@nestjs/common';
import path from 'node:path';
import { FileStructureService } from '../file-structure/file-structure.service';
import { FileSystemService } from '../file-system/file-system.service';
import { FILES } from './constants';

export interface IFileService {

}

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
}
