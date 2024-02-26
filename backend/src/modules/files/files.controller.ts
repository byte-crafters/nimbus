import { Body, Controller, Get, Inject, Param, Post, Req } from '@nestjs/common';
import { FileStructureService } from './file-structure.service';


/** TODO Share somehow types between fe and be */
export type CreateFolderDTO = {
    folderName: string;
    parentFolderId: string;
};

export type GetFolderChildren = {
    parentFolderId: string;
};

@Controller({
    version: '1',
    path: 'files',
})
export class FilesController {
    constructor(
        @Inject(FileStructureService) private fileService: FileStructureService
    ) { }

    @Post('folder')
    async createFolder(@Body() createFolderDTO: CreateFolderDTO, @Req() request: any) {
        const { folderName, parentFolderId } = createFolderDTO;
        const userId = request.user.sub;

        const createdFolder = await this.fileService.createUserFolder(userId, folderName, parentFolderId);
        const children = await this.fileService.getChildrenFoldersOf(createdFolder.parentId);
        const parentFolder = await this.fileService.getFolderById(parentFolderId);


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

        /** Now we find children nodes */
        const children = await this.fileService.getChildrenFoldersOf(parentFolderId);
        const parentFolder = await this.fileService.getFolderById(parentFolderId);

        return {
            parentFolder,
            folders: children
        };
    }

    @Get('user/folder/root')
    async getUserRootFolder(@Req() request: any) {
        const userId = request.user.sub;

        const rootFolder = await this.fileService.getUserRootFolder(userId);
        /** Now we find children nodes */
        const children = await this.fileService.getChildrenFoldersOf(rootFolder.id);
        return {
            parentFolder: rootFolder,
            folders: children
        };
    }
}
