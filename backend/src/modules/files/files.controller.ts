import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    Param,
    Post,
    Req,
    StreamableFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFolderDTO, DeleteFolderParamsDTO, RenameFolderDTO } from '@src/types/api/request';
import { CreateFolderResult, GetFolderResult200Decl } from '@src/types/api/response';
import { NoFolderWithThisIdError } from '../errors/logic/NoFolderWithThisIdError';
import { FileStructureRepository, IFileStructureRepository, TFolder } from '../file-structure/file-structure.service';
import { IFileSystemService } from '../file-system/file-system.service';
import { IUserService } from '../user/services/users.service';
import { FileService } from './file.service';

// export class TFol
export class TUploadFileDTO {
    folderId: string;
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
    ) {}

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

        const children = await this.fileStructureRepository.getChildrenFolders(createdFolder.parentId);
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
        @Param('folderId') folderId: string,
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
        @Param('folderId') folderId: string,
    ): Promise<{ folder: TFolder; softDelete: boolean }> {
        const { softDelete } = deleteFolderDTO;
        const userId = request.user.sub;

        let deletedFolder: TFolder;
        if (!softDelete) {
            /** We should delete all nested subfolders */
            deletedFolder = await this.fileStructureRepository.deleteFolder(folderId);
            const deletedFolderFS = await this.fileSystem.removeFolder(folderId);
        } else {
            /** We should change this flag for all files in nodes subtree */
            deletedFolder = await this.fileStructureRepository.changeFolderRemovedState(folderId, true);
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
    async getFolderChildren(@Req() request: any, @Param('id') id: string) {
        try {
            const parentFolderId = id;
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

        files.forEach((file) => {
            const { buffer, originalname, mimetype, size } = file;
            this.fileService.saveFileToFolder(
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
    async removeFile(@Req() request: any, @Param('fileId') fileId: string) {
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
    async getFile(@Req() request: any, @Param('fileId') fileId: string): Promise<any> {
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
    async getFileInfo(@Req() request: any, @Param('fileId') fileId: string): Promise<any> {
        const userId = request.user.sub;
        const fileInfo = await this.fileService.getFileInfoById(fileId, userId);
        return fileInfo;
    }
}
