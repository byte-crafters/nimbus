import { Body, Controller, Get, Inject, Param, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileStructureService } from '../file-structure/file-structure.service';
import { FileSystemService } from '../file-system/file-system.service';
import { IUserService } from '../user/services/users.service';
import { FileService } from './file.service';


/** TODO Share somehow types between fe and be */
export type CreateFolderDTO = {
    folderName: string;
    parentFolderId: string;
};

export type GetFolderChildren = {
    parentFolderId: string;
};

export class TUploadFileDTO {
    folderId: string;
}

@Controller({
    version: '1',
    path: 'files',
})
export class FilesController {
    constructor(
        @Inject(FileStructureService) private fileStructureService: FileStructureService,
        @Inject(FileSystemService) private fileSystem: FileSystemService,
        @Inject(FileService) private fileService: FileService,
        @Inject(Symbol.for('IUserService')) private usersService: IUserService,
    ) { }

    @Post('folder')
    async createFolder(
        @Body() createFolderDTO: CreateFolderDTO,
        @Req() request: any
    ) {
        const { folderName, parentFolderId } = createFolderDTO;
        const userId = request.user.sub;

        const createdFolder = await this.fileStructureService.createUserFolder(userId, folderName, parentFolderId);

        // this.fileSystem.createNestedFolder([...createdFolder.path, createdFolder.id]);

        const children = await this.fileStructureService.getChildrenFoldersOf(createdFolder.parentId);
        const parentFolder = await this.fileStructureService.getFolderById(parentFolderId);


        return {
            parentFolder,
            folders: children
        };
    }

    @Get('folder/:id')
    async getFolderChildren(
        @Req() request: any,
        @Param('id') id: string
    ) {
        const parentFolderId = id;
        const userId = request.user.sub;

        const user = await this.usersService.getUserProfile(userId);

        /** Now we find children nodes */
        const children = await this.fileStructureService.getChildrenFoldersOf(parentFolderId);
        const parentFolder = await this.fileStructureService.getFolderById(parentFolderId);
        const folderFiles = await this.fileStructureService.getChildrenFilesOf(parentFolderId);

        const namesPath = await this.fileStructureService.getFolderPath(parentFolderId);
        namesPath.unshift(user.username);

        return {
            parentFolder,
            folders: children,
            files: folderFiles,
            currentPath: namesPath
        };
    }

    @Get('user/folder/root')
    async getUserRootFolder(@Req() request: any) {
        const userId = request.user.sub;

        const rootFolder = await this.fileStructureService.getUserRootFolder(userId);
        /** Now we find children nodes */
        const children = await this.fileStructureService.getChildrenFoldersOf(rootFolder.id);
        return {
            parentFolder: rootFolder,
            folders: children
        };
    }

    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadFile(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() uploadFileDTO: TUploadFileDTO,
        @Req() request: any
    ) {
        const userId = request.user.sub;
        const { folderId } = uploadFileDTO;

        files.forEach((file) => {
            const { buffer, originalname, mimetype, size } = file;
            this.fileService.saveFileToFolder(
                userId,
                file.buffer,
                uploadFileDTO.folderId,
                file.originalname,
                file.mimetype
            );
        });

        const currentFolder = await this.fileStructureService.getFolderById(folderId);
        const children = await this.fileStructureService.getChildrenFoldersOf(folderId);
        const folderFiles = await this.fileStructureService.getChildrenFilesOf(folderId);

        return {
            currentFolder,
            folders: children,
            files: folderFiles
        };
    }
}
