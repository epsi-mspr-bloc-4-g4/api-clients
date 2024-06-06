// Jest configuration file
module.exports = {
    preset: 'ts-jest',
    transform: {},
    testEnvironment: 'node',
    setupFilesAfterEnv: ['@babel/register'],
};