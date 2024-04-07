import path from "node:path";

export const FILES = {
    FILES_PATH: path.join(path.resolve(process.cwd()), "_files"),
    TEST_FILES_PATH: path.join(path.resolve(process.cwd()), "_test_files")
};
