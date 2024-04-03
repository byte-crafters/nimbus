import { ApiProperty } from '@nestjs/swagger';

export class SignInDTO {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

/** TODO Share somehow types between fe and be */
export class CreateFolderDTO {
    @ApiProperty()
    folderName: string;

    @ApiProperty()
    parentFolderId: string;
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
}
