"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
};
exports.generatePassword = generatePassword;
