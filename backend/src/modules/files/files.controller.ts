import { Public } from '@modules/auth/services/auth.decorator';
import { Body, Controller, Get, Inject, Post, Req, Res, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { FileStructureService } from './file-structure.service';


/** Share somehow types between fe and be */
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

    @Post('folder1')
    async createFolder(@Body() createFolderDTO: CreateFolderDTO, @Req() request: any) {
        const { folderName, parentFolderId } = createFolderDTO;
        const userId = request.user.sub;

        const createdFolder = await this.fileService.createUserFolder(userId, folderName, parentFolderId);
        const children = await this.fileService.getChildrenFoldersOf(createdFolder.parentId);

        return children;
    }

    @Get('folder')
    async getFolderChildren(@Body() getFolderChildren: GetFolderChildren, @Req() request: any) {
        const userId = request.user.sub;
        const { parentFolderId } = getFolderChildren;

        // const folder = await this.fileService.getUserRootFolder(userId);
        /** Now we find children nodes */
        const children = await this.fileService.getChildrenFoldersOf(parentFolderId);
        return children;
    }

    @Get('user/folder/root')
    async getUserRootFolder(@Req() request: any) {
        const userId = request.user.sub;

        const folder = await this.fileService.getUserRootFolder(userId);
        /** Now we find children nodes */
        const children = await this.fileService.getChildrenFoldersOf(folder.id);
        return children;
    }
}
