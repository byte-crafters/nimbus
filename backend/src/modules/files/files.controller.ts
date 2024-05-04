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
import { NoFolderWithThisIdError } from '../errors/logic/NoFolderWithThisIdError';
import { FileStructureRepository } from '../file-structure/file-structure.service';
import { IFileSystemService } from '../file-system/file-system.service';
import { IUserService } from '../user/services/users.service';
import { FileService } from './file.service';
import { IFileStructureRepository, TFolder, TFolderRepository } from '../file-structure/file-structure.type';
import { AccessService } from './access.service';
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
        @Inject(Symbol.for('IFileStructureRepository')) private fileStructureRepository: IFileStructureRepository,
        @Inject(Symbol.for('IFileSystemService')) private fileSystem: IFileSystemService,
        @Inject(FileService) private fileService: FileService,
        @Inject(Symbol.for('IUserService')) private usersService: IUserService,
        @Inject(AccessService) private accessService: AccessService,

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

    @ApiTags('files')
    @Post('folder/delete/:folderId')
    async deleteFolder(
        @Body() deleteFolderDTO: DeleteFolderParamsDTO,
        @Req() request: any,
        @Param('folderId') folderId: TApiFolderId,
    ): Promise<{ folder: TFolder; softDelete: boolean; }> {
        const { softDelete } = deleteFolderDTO;
        const userId = request.user.sub;

        let deletedFolder: TFolder;
        if (!softDelete) {
            /** TODO fix!!! */
            /** We should delete all nested subfolders */
            deletedFolder = await this.fileSystem.removeFolder(folderId.toString()) as any;
        } else {
            /** We should change this flag for all files in nodes subtree */
            deletedFolder = await this.fileStructureRepository.changeFolderRemovedState(folderId, true) as any;
            // const deletedFolderFS = await this.fileSystem.removeFolder(folderId)
        }

        return {
            folder: deletedFolder,
            softDelete,
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
            const children = await this.fileStructureRepository.getChildrenFolders(parentFolderId);
            const folderFiles = await this.fileStructureRepository.getChildrenFiles(parentFolderId);
            const parentFolder = await this.fileStructureRepository.getFolderById(parentFolderId);
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
                parentFolder,
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
        } catch (e: unknown) {
            if (e instanceof NoFolderWithThisIdError) {
                throw new BadRequestException(e.message);
            }

            throw new InternalServerErrorException('Server error.');
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
        summary: 'Upload file.',
        description: 'Upload file to specified folder. Supports uploading up to 10 files.',
    })
    @ApiTags('files')
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 10))
    async uploadFile(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() uploadFileDTO: TUploadFileDTO,
        @Req() request: any,
    ) {
        const userId = request.user.sub;
        const { folderId } = uploadFileDTO;

        files.forEach(async (file) => {
            const { buffer, originalname, mimetype, size } = file;
            await this.fileService.saveFileToFolder(
                userId,
                file.buffer,
                uploadFileDTO.folderId,
                file.originalname,
                file.mimetype,
            );
        });

        const currentFolder = await this.fileStructureRepository.getFolderById(folderId);
        const children = await this.fileStructureRepository.getChildrenFolders(folderId);
        const folderFiles = await this.fileStructureRepository.getChildrenFiles(folderId);

        return {
            currentFolder,
            folders: children,
            files: folderFiles,
        };
    }

    @ApiOperation({
        summary: 'Remove file.',
        description: 'Remove file with specified parameters.',
    })
    @ApiTags('files')
    @Post('remove/:fileId')
    async removeFile(@Req() request: any, @Param('fileId') fileId: TApiFileId) {
        const userId = request.user.sub;

        const { fileId: removedFileId, folderId } = await this.fileService.removeFile(fileId, userId);
        const currentFolder = await this.fileStructureRepository.getFolderById(folderId);
        const children = await this.fileStructureRepository.getChildrenFolders(folderId);
        const folderFiles = await this.fileStructureRepository.getChildrenFiles(folderId);

        return {
            currentFolder,
            folders: children,
            files: folderFiles,
        };
    }

    @ApiOperation({
        summary: 'Download file.',
        description: 'Download specified file.',
    })
    @ApiTags('files')
    @Get('download/:fileId')
    async getFile(@Req() request: any, @Param('fileId') fileId: TApiFileId): Promise<any> {
        const userId = request.user.sub;

        const fileStream = await this.fileService.getFileStreamById(fileId, userId);

        // console.log(process.cwd());
        // const fileStream = createReadStream(join(process.cwd(), 'package.json'));
        return new StreamableFile(fileStream);
    }









    @ApiOperation({
        summary: 'Get file info by id.',
        description: 'Return full file info.',
    })
    @ApiTags('files')
    @Get('info/:fileId')
    async getFileInfo(@Req() request: any, @Param('fileId') fileId: TApiFileId): Promise<any> {
        const userId = request.user.sub;
        const fileInfo = await this.fileService.getFileInfoById(fileId, userId);
        return fileInfo;
    }

    @ApiOperation({
        summary: 'Share list of files with some user.',
        description: 'Full.',
    })
    @ApiTags('files')
    @Post('share/files')
    async shareFiles(
        @Req() request: any,
        @Body() shareDTO: {
            access: {
                value: {
                    view: boolean;
                    edit: boolean;
                };
                userId: string;
                fileId: string;
            }[];
        },
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const { access: accessList } = shareDTO;

        for (const access of accessList) {
            const { fileId, userId: shareUserId, value } = access;
            await this.accessService.setFileAccess(value, shareUserId, fileId, userId);

            // const { id, type, userId: shareUserId, value } = access;
            // 
            // }
        }


        // const fileInfo = await this.fileService.getFileInfoById(fileId, userId);
        // return fileInfo;
        return response.status(HttpStatus.CREATED).send(JSON.stringify({ answer: 'ok.' }));
    }

    @ApiOperation({
        summary: 'Share list of files with some user.',
        description: 'Full.',
    })
    @ApiTags('files')
    @Post('share/folders')
    async shareResource(
        @Req() request: any,
        @Body() shareDTO: {
            access: {
                value: {
                    view: boolean;
                    edit: boolean;
                };
                userId: string;
                folderId: string;
            }[];
        },
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const { access: accessList } = shareDTO;

        for (const access of accessList) {
            const { folderId, userId: shareUserId, value } = access;
            await this.accessService.setFolderAccess(value, shareUserId, folderId, userId);
        }

        // response.status(HttpStatus.CREATED).send();
        return response.status(HttpStatus.CREATED).send(JSON.stringify({ answer: 'ok.' }));
    }

    @ApiOperation({
        summary: 'Get file info by id.',
        description: 'Return full file info.',
    })
    @ApiTags('files')
    @Get('share/file/:fileId')
    async getFileSharedUsers(
        @Req() request: any,
        @Res() response: Response,
        @Param('fileId') fileId: TApiFileId
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.accessService.getFileShares(fileId);
        response.status(HttpStatus.OK).send(result);
    }

    /**
     * TODO
     * add guard (only user that owns files can request this)
     */
    @ApiOperation({
        summary: 'Get file info by id.',
        description: 'Return full file info.',
    })
    @ApiTags('files')
    @Get('share/folder/:folderId')
    async getFolderSharedUsers(
        @Req() request: any,
        @Res() response: Response,
        @Param('folderId') folderId: TApiFolderId
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.accessService.getFolderShares(folderId);
        response.status(HttpStatus.OK).send(result);
    }



    
    /** File */
    @Get('get-all-files')
    async getAllFiles(
        @Req() request: any,
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.fileService.getAllFilesOfUser(userId);
        response.status(HttpStatus.OK).send(result);
    }

    @Get('get-my-shared-files')
    async getMySharedFiles(
        @Req() request: any,
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.fileService.getMySharedFiles(userId);
        return response.status(HttpStatus.OK).send(result);
    }

    @Get('get-shared-with-me-files')
    async getSharedWithMeFiles(
        @Req() request: any,
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.fileService.getSharedWithMeFiles(userId);
        return response.status(HttpStatus.OK).send(result);
    }





    /**
     * Folders
     */
    @Get('get-all-folders')
    async getAllFolders(
        @Req() request: any,
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.fileService.getAllFoldersOfUser(userId);
        response.status(HttpStatus.OK).send(result);
    }

    @Get('get-my-shared-folders')
    async getMySharedFolders(
        @Req() request: any,
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.fileService.getMySharedFolders(userId);
        return response.status(HttpStatus.OK).send(result);
    }

    @Get('get-shared-with-me-folders')
    async getSharedWithMeFolders(
        @Req() request: any,
        @Res() response: Response
    ): Promise<any> {
        const userId = request.user.sub;

        const result = await this.fileService.getSharedWithMeFolders(userId);
        return response.status(HttpStatus.OK).send(result);
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