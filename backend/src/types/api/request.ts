import { ApiProperty } from '@nestjs/swagger';

export class SignInDTO {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

export type TApiFolderId = string
export type TApiFileId = string

/** TODO Share somehow types between fe and be */
export class CreateFolderDTO {
    @ApiProperty()
    folderName: string;

    @ApiProperty()
    parentFolderId: TApiFolderId;
}

export class RenameFolderDTO {
    @ApiProperty()
    newFolderName: string;
}

export class DeleteFolderParamsDTO {
    @ApiProperty()
    softDelete: boolean;
}

export class RegisterDTO {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;
}
