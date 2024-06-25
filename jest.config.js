// Jest configuration file
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['@babel/register'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    transformIgnorePatterns: [
        '/node_modules/',
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    reporters: [
        'default',
        ['jest-sonar-reporter', {
            outputDirectory: 'coverage',
            outputName: 'sonar-report.xml',
        }],
    ],
};
