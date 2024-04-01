import { ApiProperty } from '@nestjs/swagger';

/**
 * TODO: returned types should not be shared with something else!!!
 */

/**
 * TODO: Share this type
 */
export class TFolderDecl {
    @ApiProperty()
    parentId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    id: string;

    @ApiProperty()
    owner: string;
}

export class CreateFolderResult {
    @ApiProperty({ description: 'Parent folder of newly created folder.' })
    parentFolder: TFolderDecl;

    @ApiProperty({ isArray: true, type: TFolderDecl })
    folders: TFolderDecl[];
}

export type GetFolderChildren = {
    parentFolderId: string;
};

export class TFileDecl {
    @ApiProperty({ description: 'File id.' })
    id: string;
    @ApiProperty({ description: 'File extension.' })
    extension: string;
    @ApiProperty({ description: 'Parent folder id.' })
    folderId: string;
    @ApiProperty({ description: 'File original name.' })
    name: string;
    @ApiProperty({ description: 'File owner (creator) id.' })
    owner: string;
}

export class GetRootFolderResult200Decl {
    @ApiProperty({
        description: 'Parent folder id. If folder is root, then `parentId` is empty string.',
        example: {
            parentId: '660afd2a64ddf2178fbfa811',
            name: 'Work',
            id: '660afd2a64ddf2178fbfa807',
            owner: '22e12328-4948-4d25-a7fb-b391053d5113',
        },
    })
    parentFolder: TFolderDecl;

    @ApiProperty({
        description: 'All inner folders.',
        isArray: true,
        type: TFolderDecl,
        example: [
            {
                parentId: '660afd2a64ddf2178fbfa807',
                name: 'Reports for 2022',
                id: '660afd8664ddf2178fbfa81e',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
            {
                parentId: '660afd2a64ddf2178fbfa807',
                name: 'Reports for 2023',
                id: '660afd8664ddf2178fbfa81d',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
        ],
    })
    folders: TFolderDecl[];

    @ApiProperty({
        description: 'All inner files.',
        isArray: true,
        type: TFileDecl,
        example: [
            {
                extension: 'image/png',
                folderId: '660afd8664ddf2178fbfa81e',
                id: '660b10c49796c2689d93fd0c',
                name: 'Screenshot from 2024-03-31 22-34-07.png',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
            {
                extension: 'application/x-archive',
                folderId: '660afd8664ddf2178fbfa81e',
                id: '660b10c99796c2689d93fd11',
                name: '22.a',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
        ],
    })
    files: TFileDecl[];

    @ApiProperty({
        description: "Array of ancestor folder names. Always starts with the file owner's username.",
        example: ['elonmuskwastaken', 'Work'],
    })
    currentPath: string[];
}

export class GetFolderResult200Decl {
    @ApiProperty({
        description: 'Parent folder id. If folder is root, then `parentId` is empty string.',
        example: {
            parentId: '660afd2a64ddf2178fbfa811',
            name: 'Work',
            id: '660afd2a64ddf2178fbfa807',
            owner: '22e12328-4948-4d25-a7fb-b391053d5113',
        },
    })
    parentFolder: TFolderDecl;

    @ApiProperty({
        description: 'All inner folders.',
        isArray: true,
        type: TFolderDecl,
        example: [
            {
                parentId: '660afd2a64ddf2178fbfa807',
                name: 'Reports for 2022',
                id: '660afd8664ddf2178fbfa81e',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
            {
                parentId: '660afd2a64ddf2178fbfa807',
                name: 'Reports for 2023',
                id: '660afd8664ddf2178fbfa81d',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
        ],
    })
    folders: TFolderDecl[];

    @ApiProperty({
        description: 'All inner files.',
        isArray: true,
        type: TFileDecl,
        example: [
            {
                extension: 'image/png',
                folderId: '660afd8664ddf2178fbfa81e',
                id: '660b10c49796c2689d93fd0c',
                name: 'Screenshot from 2024-03-31 22-34-07.png',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
            {
                extension: 'application/x-archive',
                folderId: '660afd8664ddf2178fbfa81e',
                id: '660b10c99796c2689d93fd11',
                name: '22.a',
                owner: '22e12328-4948-4d25-a7fb-b391053d5113',
            },
        ],
    })
    files: TFileDecl[];

    @ApiProperty({
        description: "Array of ancestor folder names. Always starts with the file owner's username.",
        example: ['elonmuskwastaken', 'Work'],
    })
    currentPath: string[];
}
