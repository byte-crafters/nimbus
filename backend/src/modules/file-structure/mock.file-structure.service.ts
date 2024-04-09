// import { Injectable } from '@nestjs/common';
// import { PrismaClient as MongoClient, Prisma } from '@prsm/generated/prisma-mongo-client-js';
// import { DbFileRecordDoesNotExist } from '../errors/db/DbFileRecordDoesNotExistError';
// import { NoFolderWithThisIdError } from '../errors/logic/NoFolderWithThisIdError';
// import { MongoConnection } from './mongo-connection';
// import { IFileStructureRepository } from './file-structure.service';

// export type CreateUserRootFolderStructure = {
//     parentId: string;
//     name: string;
//     id: string;
// };
// export type TFolder = {
//     id: string;
//     name: string;
//     parentId: string;
//     owner: string;
//     path: string[];
// };

// export type TFile = {
//     id: string;
//     extension: string;
//     folderId: string;
//     name: string;
//     owner: string;
// };

// @Injectable()
// export class FileStructureRepository implements IFileStructureRepository {
//     private connection: MongoClient

//     constructor() {
//         this.connection = new MongoConnection().Connection
//     }

//     async getFolderPath(folderId: string): Promise<{ name: string, id: string; }[]> {

//     }

//     async getChildrenFilesOf(folderId: string) {

//     }

//     createFile(name: string, extension: string, folderId: string, userId: string): Promise<TFile> {

//     }

//     getFileById(fileId: string): Promise<TFile> {

//     }

//     removeFile(fileId: string): Promise<Pick<TFile, 'folderId' | 'id'>> {

//     }

//     // getFolderIdPath(folderId: string): string {

//     // }

//     /** TODO Need to disallow some username symbols. */
//     /** TODO Remake tests to pass userId */
//     async createUserRootFolder(userId: string): Promise<CreateUserRootFolderStructure> {

//     }

//     getUserRootFolder(userId: string): Promise<TFolder> {

//     }

//     getChildrenFoldersOf(folderId: string) {

//     }

//     async getFolderById(folderId: string): Promise<TFolder | null> {

//     }

//     async renameFolder(newFolderName: string, folderId: string) {

//     }

//     async changeFolderRemovedState(folderId: string, removedState: boolean) {

//     }

//     async deleteFolder(folderId: string) {

//     }

//     async createUserFolder(userId: string, folderName: string, parentFolderId: string) {

//     }
// }
