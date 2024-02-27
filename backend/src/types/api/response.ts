import { ApiProperty } from "@nestjs/swagger";

/** 
 * TODO: returned types should not be shared with something else!!!
 */

/**
 * TODO: Share this type
 */
export class TFolder {
    @ApiProperty()
    parentId: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    id: string;
    @ApiProperty()
    owner: string;
};

export class CreateFolderResult {
    @ApiProperty({ description: 'Parent folder of newly created folder.', })
    parentFolder: TFolder;
    @ApiProperty({ isArray: true, type: TFolder })
    folders: TFolder[];
}




export type GetFolderChildren = {
    parentFolderId: string;
};

