import { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: "./src",
    testRegex: ".*\\.spec\\.ts$",
    // testRegex: "./src/modules/files/services/file.service.spec.ts",
    // testRegex: "./src/test/redis-client.spec.ts",

    // testMatch: [
    // //     "**/__tests__/**/*.[jt]s?(x)",
    // //     "**/?(*.)+(spec|test).[jt]s?(x)",
    //     // "**/test/**/?(*.)+(spec|test).[jt]s?(x)",
    //     "./src/test/redis-client.spec.ts"
    // //     // "**/modules/file-*/**/.*\\.spec\\.ts"
    // ],
    transform: {
        "^.+\\.(t|j)s$": [
            "ts-jest",
            {
                tsconfig: './tsconfig.test.json',
            }
        ]
    },
    collectCoverageFrom: [
        "**/*.(t|j)s"
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    preset: "ts-jest",
    moduleDirectories: ["node_modules", "<rootDir>"],
    moduleNameMapper: {
        "@modules/(.*)": "<rootDir>/modules/$1",
        "@src/(.*)": "<rootDir>/$1",
        "@prsm/(.*)": "<rootDir>/../prisma/$1",
    },
};

export default jestConfig;