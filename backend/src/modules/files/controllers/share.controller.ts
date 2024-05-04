import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Req, Res } from "@nestjs/common";
import { Response } from 'express';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TApiFileId, TApiFolderId } from "@src/types/api/request";
import { AccessService } from "../services/access.service";
import { FileService } from "../services/file.service";

@Controller({
    version: '1',
    path: 'files',
})
export class ShareController {
    constructor(
        @Inject(FileService) private fileService: FileService,
        @Inject(AccessService) private accessService: AccessService,
    ) { }

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