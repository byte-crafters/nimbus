import { Body, Controller, Get, Inject, Param, Post, Req, StreamableFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IDataRepository } from "@src/modules/file-structure/file-structure.type";
import { TApiFileId } from "@src/types/api/request";
import { FileService } from "../services/file.service";
import { TUploadFileDTO } from "./files.controller";

@Controller({
    version: '1',
    path: 'files',
})
export class LoadController {
    constructor(
        @Inject(Symbol.for('IFileStructureRepository')) private fileStructureRepository: IDataRepository,
        @Inject(FileService) private fileService: FileService,
    ) { }

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
}