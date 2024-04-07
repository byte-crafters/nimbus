import { Injectable } from '@nestjs/common';
import path from 'node:path';

export interface IConfigService {
    getStoragePath(): string;
}

@Injectable()
export class DevConfigService implements IConfigService {
    constructor() { }

    getStoragePath(): string {
        return path.join(path.resolve(process.cwd()), "_files");
    }
}
