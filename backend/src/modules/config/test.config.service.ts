import { Injectable } from '@nestjs/common';
import path from 'node:path';
import { IConfigService } from './dev.config.service';

@Injectable()
export class TestConfigService implements IConfigService {
    constructor() {}

    getStoragePath(): string {
        return path.join(path.resolve(process.cwd()), '_test_storage');
    }
}
