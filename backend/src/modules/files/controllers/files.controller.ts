import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    Param,
    Post,
    Req,
    Res,
    StreamableFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFolderDTO, DeleteFolderParamsDTO, RenameFolderDTO, TApiFileId, TApiFolderId } from '@src/types/api/request';
import { CreateFolderResult, GetFolderResult200Decl } from '@src/types/api/response';
import { NoFolderWithThisIdError } from '../../errors/logic/NoFolderWithThisIdError';
import { DataRepository } from '../../file-structure/data.repository';
import { IFileSystemService } from '../../file-system/file-system.service';
import { IUserService } from '../../user/services/users.service';
import { FileService } from '../services/file.service';
import { IDataRepository, TFolder, TFolderRepository } from '../../file-structure/file-structure.type';
import { AccessService } from '../services/access.service';
import { Response } from 'express';

// export class TFol
export class TUploadFileDTO {
    folderId: TApiFolderId;
}

@Controller({
    version: '1',
    path: 'files',
})
export class FilesController {
    constructor(
        @Inject(Symbol.for('IFileStructureRepository')) private fileStructureRepository: IDataRepository,
        @Inject(FileService) private fileService: FileService,
        @Inject(Symbol.for('IUserService')) private usersService: IUserService,

    ) { }

    @ApiResponse({ status: 200, type: CreateFolderResult })
    @ApiOperation({
        summary: 'Create new folder.',
        description: 'Creates new folder in specified directory.',
    })
    @ApiTags('files')
    @Post('folder')
    async createFolder(@Body() createFolderDTO: CreateFolderDTO, @Req() request: any) {
        const { folderName, parentFolderId } = createFolderDTO;
        const userId = request.user.sub;

        const createdFolder = await this.fileStructureRepository.createFolder(userId, folderName, parentFolderId);

        const children = await this.fileStructureRepository.getChildrenFolders(createdFolder.parentFolderId);
        const parentFolder = await this.fileStructureRepository.getFolderById(parentFolderId);

        return {
            parentFolder,
            folders: children,
        };
    }

    @ApiTags('files')
    @Post('folder/rename/:folderId')
    async renameFolder(
        @Body() renameFolderDTO: RenameFolderDTO,
        @Req() request: any,
        @Param('folderId') folderId: TApiFolderId,
    ) {
        const { newFolderName } = renameFolderDTO;
        const userId = request.user.sub;

        const renamedFolder = await this.fileStructureRepository.renameFolder(newFolderName, folderId);

        return {
            folder: renamedFolder,
        };
    }



    @ApiResponse({
        status: 200,
        type: GetFolderResult200Decl,
        description: 'Get user folder.',
    })
    @ApiOperation({
        summary: 'Get folder by id.',
        description: 'Returns folder info by specified id.',
    })
    @ApiTags('files')
    @Get('folder/:id')
    async getFolderChildren(@Req() request: any, @Param('id') parentFolderId: TApiFolderId) {
        try {
            // const parentFolderId = parentFolderId;
            const userId = request.user.sub;

            const user = await this.usersService.getUserProfile(userId);

            /** Now we find children nodes */

            const f = await this.fileStructureRepository.getClosestSharedFolder(parentFolderId, userId);
            const folder = await this.fileStructureRepository.getFolderById(parentFolderId);

            if (f === null && folder.owner.id !== userId) {
                /** No parent folder that user has access to at least view this folder content */
                // return {};
                throw new Error('Not found folder or you have no access to it.');
            } else {
                // const access = f.folderAccess[0];
                // console.log(access);

                const children = await this.fileStructureRepository.getChildrenFolders(parentFolderId);
                const folderFiles = await this.fileStructureRepository.getChildrenFiles(parentFolderId);
                // const parentFolder = await this.fileStructureRepository.getFolderById(parentFolderId);
                const namesPath = await this.fileStructureRepository.getFolderPath(parentFolderId);

                /** When using `Promise.all` we  */
                const result = await Promise.all([
                    this.fileStructureRepository.getChildrenFolders(parentFolderId),
                    this.fileStructureRepository.getChildrenFiles(parentFolderId),
                    this.fileStructureRepository.getFolderById(parentFolderId),
                    this.fileStructureRepository.getFolderPath(parentFolderId),
                ]);

                const rootUserFolder = await this.fileStructureRepository.getUserRootFolder(userId);

                namesPath.unshift({
                    id: rootUserFolder.id,
                    name: rootUserFolder.name,
                });
                /**
                 * Get names paths in usual names
                 */

                return {
                    parentFolder: folder,
                    folders: children,
                    files: folderFiles,
                    currentPath: namesPath,
                    folderAccess: {
                        downloadZip: true,
                        downloadNestedFiles: false,
                        editFolderInfo: false,
                        editNestedFiles: true,
                        removeFolder: false,
                        removeNestedFiles: false,
                        moveFolder: true,
                        moveNestedFiles: true
                    }
                };
            }


        } catch (e: unknown) {
            if (e instanceof NoFolderWithThisIdError) {
                throw new BadRequestException(e.message);
            }
            if (e instanceof Error) {
                if (e.message === 'Not found folder or you have no access to it.') {
                    throw new BadRequestException(e.message);
                }
            }

            throw new InternalServerErrorException('Nimbus server error.');
        }
    }

    @ApiOperation({
        summary: 'Get user root folder content.',
        description: 'Return content of user root directory.',
    })
    @ApiTags('files')
    @Get('user/folder/root')
    async getUserRootFolder(@Req() request: any) {
        const userId = request.user.sub;

        const rootFolder = await this.fileStructureRepository.getUserRootFolder(userId);
        /** Now we find children nodes */
        const children = await this.fileStructureRepository.getChildrenFolders(rootFolder.id);
        return {
            parentFolder: rootFolder,
            folders: children,
        };
    }










    @ApiOperation({
        summary: 'Get folder info by id.',
        description: 'Return full folder info.',
    })
    @ApiTags('files')
    @Get('folder/info/:folderId')
    async getFolderInfo(@Req() request: any, @Param('fileId') fileId: TApiFileId): Promise<any> {
        const userId = request.user.sub;
        const fileInfo = await this.fileService.getFolderInfoById(fileId);
        return fileInfo;
    }

    @ApiOperation({
        summary: 'Get file info by id.',
        description: 'Return full file info.',
    })
    @ApiTags('files')
    @Get('file/info/:fileId')
    async getFileInfo(@Req() request: any, @Param('fileId') fileId: TApiFileId): Promise<any> {
        const userId = request.user.sub;
        const fileInfo = await this.fileService.getFileInfoById(fileId);
        return fileInfo;
    }

    @Get('info/:fileId')
    async _getFileInfo(@Req() request: any, @Param('fileId') fileId: TApiFileId): Promise<any> {
        throw new InternalServerErrorException('This api moved to /files/folder/remove/:folderId.');
    }

    @ApiOperation({
        summary: 'Get user storage info.',
        description: 'Get user storage files info in terms of used extensions and sizes.',
    })
    @ApiTags('files')
    @Get('storage')
    async getStorageInfo(@Req() request: any): Promise<any> {
        const userId = request.user.sub;
        const fileInfo = await this.fileService.getStorageInfo(userId);
        return fileInfo;
    }
}

export type TShareDTO = {
    access: {
        type: 'file' | 'folder';
        value: {
            view: boolean;
            edit: boolean;
        };
        userId: string;
        id: string;
    }[];
};