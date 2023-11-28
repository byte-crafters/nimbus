import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const jestConfig: JestConfigWithTsJest = {
    moduleFileExtensions: [
        "js",
        "json",
        "ts"
    ],
    rootDir: "./src",
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest"
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
    }
};

export default jestConfig;