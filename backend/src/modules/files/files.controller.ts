import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Req,
    StreamableFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateFolderDTO } from '@src/types/api/request';
import { CreateFolderResult } from '@src/types/api/response';
import { FileStructureService } from '../file-structure/file-structure.service';
import { FileSystemService } from '../file-system/file-system.service';
import { IUserService } from '../user/services/users.service';
import { FileService } from './file.service';

export class TUploadFileDTO {
    folderId: string;
}

@Controller({
    version: '1',
    path: 'files',
})
export class FilesController {
    constructor(
        @Inject(FileStructureService)
        private fileStructureService: FileStructureService,
        @Inject(FileSystemService) private fileSystem: FileSystemService,
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
    async createFolder(
        @Body() createFolderDTO: CreateFolderDTO,
        @Req() request: any,
    ) {
        const { folderName, parentFolderId } = createFolderDTO;
        const userId = request.user.sub;

        const createdFolder = await this.fileStructureService.createUserFolder(
            userId,
            folderName,
            parentFolderId,
        );

        // this.fileSystem.createNestedFolder([...createdFolder.path, createdFolder.id]);

        const children = await this.fileStructureService.getChildrenFoldersOf(
            createdFolder.parentId,
        );
        const parentFolder =
            await this.fileStructureService.getFolderById(parentFolderId);

        return {
            parentFolder,
            folders: children,
        };
    }

    @ApiTags('files')
    @Get('folder/:id')
    async getFolderChildren(@Req() request: any, @Param('id') id: string) {
        const parentFolderId = id;
        const userId = request.user.sub;

        const user = await this.usersService.getUserProfile(userId);

        /** Now we find children nodes */
        const children =
            await this.fileStructureService.getChildrenFoldersOf(
                parentFolderId,
            );
        const parentFolder =
            await this.fileStructureService.getFolderById(parentFolderId);
        const folderFiles =
            await this.fileStructureService.getChildrenFilesOf(parentFolderId);

        const namesPath =
            await this.fileStructureService.getFolderPath(parentFolderId);
        
        namesPath.unshift(user.username);

        console.log(namesPath)
        /**
         * Get names paths in usual names
         */

        return {
            parentFolder,
            folders: children,
            files: folderFiles,
            currentPath: namesPath,
        };
    }

    @ApiTags('files')
    @Get('user/folder/root')
    async getUserRootFolder(
        @Req() request: any
    ) {
        const userId = request.user.sub;

        const rootFolder =
            await this.fileStructureService.getUserRootFolder(userId);
        /** Now we find children nodes */
        const children = await this.fileStructureService.getChildrenFoldersOf(
            rootFolder.id,
        );
        return {
            parentFolder: rootFolder,
            folders: children,
        };
    }

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

        const currentFolder =
            await this.fileStructureService.getFolderById(folderId);
        const children =
            await this.fileStructureService.getChildrenFoldersOf(folderId);
        const folderFiles =
            await this.fileStructureService.getChildrenFilesOf(folderId);

        return {
            currentFolder,
            folders: children,
            files: folderFiles,
        };
    }

    @Post('remove/:fileId')
    async removeFile(@Req() request: any, @Param('fileId') fileId: string) {
        const userId = request.user.sub;

        const { fileId: removedFileId, folderId } =
            await this.fileService.removeFile(fileId, userId);
        const currentFolder =
            await this.fileStructureService.getFolderById(folderId);
        const children =
            await this.fileStructureService.getChildrenFoldersOf(folderId);
        const folderFiles =
            await this.fileStructureService.getChildrenFilesOf(folderId);

        return {
            currentFolder,
            folders: children,
            files: folderFiles,
        };
    }

    @Get('download/:fileId')
    async getFile(
        @Req() request: any,
        @Param('fileId') fileId: string,
    ): Promise<any> {
        const userId = request.user.sub;

        const fileStream = await this.fileService.getFileStreamById(
            fileId,
            userId,
        );

        // console.log(process.cwd());
        // const fileStream = createReadStream(join(process.cwd(), 'package.json'));
        return new StreamableFile(fileStream);
    }

    @Get('info/:fileId')
    async getFileInfo(
        @Req() request: any,
        @Param('fileId') fileId: string,
    ): Promise<any> {
        const userId = request.user.sub;
        const fileInfo = await this.fileService.getFileInfoById(fileId, userId);
        return fileInfo;
    }
}
