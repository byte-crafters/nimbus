import { Body, Controller, Get, Inject, InternalServerErrorException, Param, Post, Req, StreamableFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IDataRepository, TFolder } from "@src/modules/file-structure/file-structure.type";
import { DeleteFolderParamsDTO, TApiFileId, TApiFolderId } from "@src/types/api/request";
import { FileService } from "../services/file.service";
import { TUploadFileDTO } from "./files.controller";
import { IFileSystemService } from "@src/modules/file-system/file-system.service";
import { Request } from 'express';

@Controller({
    version: '1',
    path: 'files',
})
export class RemoveController {
    constructor(
        @Inject(Symbol.for('IFileStructureRepository')) private fileStructureRepository: IDataRepository,
        @Inject(FileService) private fileService: FileService,
        @Inject(Symbol.for('IFileSystemService')) private fileSystem: IFileSystemService,
    ) { }

    @Post('remove/:fileId')
    async removeFileOld() {
        throw new InternalServerErrorException('This api moved to /files/file/remove/:fileId.');
    }

    @ApiOperation({
        summary: 'Remove file.',
        description: 'Remove file with specified parameters.',
    })
    @ApiTags('files')
    @Get('file/removed')
    async getRemovedFiles(
        @Req() request: any,
    ) {
        try {
            const requesterId = request.user.sub;

            const result = await this.fileService.getRemovedFiles(requesterId);

            return result;
        } catch (e) {
            throw new InternalServerErrorException('Nimbus server error.');
        }
    }

    @ApiOperation({
        summary: 'Remove file.',
        description: 'Remove file with specified parameters.',
    })
    @ApiTags('files')
    @Post('file/remove/:fileId')
    async removeFile(
        @Req() request: any,
        @Body() body: { softDelete: boolean; },
        @Param('fileId') fileId: TApiFileId
    ) {
        try {
            const requesterId = request.user.sub;
            const { softDelete } = body;

            if (typeof softDelete !== 'boolean') {
                throw new Error('Invalid paremeters. Check API description.');
            }

            const result = await this.fileService.removeFile(fileId, requesterId, softDelete);

            return {
                fileId: result.fileId,
                folderId: result.folderId
            };
        } catch (e) {
            if (e instanceof Error) {
                throw new InternalServerErrorException('Nimbus server error. ' + e.message);
            }
            throw new InternalServerErrorException('Nimbus server error.');
        }
    }


    @ApiOperation({
        summary: 'Remove file.',
        description: 'Remove file with specified parameters.',
    })
    @ApiTags('files')
    @Post('file/recover/:fileId')
    async recoverFile(
        @Req() request: any,
        @Param('fileId') fileId: TApiFileId
    ) {
        try {
            const requesterId = request.user.sub;


            const result = await this.fileService.recoverFile(fileId, requesterId);

            return {
                fileId: result.fileId,
                folderId: result.folderId
            };
        } catch (e) {
            if (e instanceof Error) {
                throw new InternalServerErrorException('Nimbus server error. ' + e.message);
            }
            throw new InternalServerErrorException('Nimbus server error.');
        }
    }


    @Post('folder/delete/:folderId')
    async deleteFolderOld(): Promise<{ folder: TFolder; softDelete: boolean; }> {
        throw new InternalServerErrorException('This api moved to /files/folder/remove/:folderId.');
    }

    @ApiTags('files')
    @Post('folder/remove/:folderId')
    async deleteFolder(
        @Body() body: DeleteFolderParamsDTO,
        @Req() request: any,
        @Param('folderId') folderId: TApiFolderId,
    ): Promise<any> {
        try {
            const { softDelete } = body;
            const requesterId = request.user.sub;

            if (typeof softDelete !== 'boolean') {
                throw new Error('Invalid paremeters. Check API description.');
            }

            const result = await this.fileService.removeFolder(folderId, requesterId, softDelete);
            return result;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new InternalServerErrorException('Nimbus server error. ' + e.message);
            }
            throw new InternalServerErrorException('Nimbus server error.');
        }
    }

    @ApiTags('files')
    @Post('folder/recover/:folderId')
    async recoverFolder(
        @Req() request: any,
        @Param('folderId') folderId: TApiFolderId,
    ): Promise<any> {
        try {
            const requesterId = request.user.sub;

            const result = await this.fileService.recoverFolder(folderId, requesterId);
            return result;
        } catch (e: unknown) {
            if (e instanceof Error) {
                throw new InternalServerErrorException('Nimbus server error. ' + e.message);
            }
            throw new InternalServerErrorException('Nimbus server error.');
        }
    }

    @ApiOperation({
        summary: 'Remove file.',
        description: 'Remove file with specified parameters.',
    })
    @ApiTags('files')
    @Get('folders/removed')
    async getRemovedFolders(
        @Req() request: any,
    ) {
        try {
            const requesterId = request.user.sub;

            const result = await this.fileService.getRemovedFolders(requesterId);

            return result;
        } catch (e) {
            throw new InternalServerErrorException('Nimbus server error.');
        }
    }
}