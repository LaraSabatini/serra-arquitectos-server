"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.createFolder = exports.deleteFile = exports.getFile = exports.uploadFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const responses_1 = __importDefault(require("../config/responses"));
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderName } = req.body;
    const directory = path_1.default.resolve(__dirname, "..", "files");
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory);
    }
    const newFolderPath = path_1.default.resolve(__dirname, "..", `files/${folderName}`);
    if (!fs_1.default.existsSync(newFolderPath)) {
        fs_1.default.mkdirSync(newFolderPath);
        res.status(responses_1.default.CREATED.status).json(responses_1.default.CREATED);
    }
    else {
        res.status(responses_1.default.CONFLICT.status).json(responses_1.default.CONFLICT);
    }
});
exports.createFolder = createFolder;
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderName } = req.params;
    const folderPath = path_1.default.join(__dirname, "..", "files", folderName);
    if (fs_1.default.existsSync(folderPath)) {
        fs_1.default.rmdir(folderPath, { recursive: true }, err => {
            if (err) {
                res
                    .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
                    .json(responses_1.default.INTERNAL_SERVER_ERROR);
            }
            else {
                res.status(responses_1.default.OK.status).json(responses_1.default.OK);
            }
        });
    }
    else {
        res.status(responses_1.default.NOT_FOUND.status).json(responses_1.default.NOT_FOUND);
    }
});
exports.deleteFolder = deleteFolder;
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files.files.length === undefined ? [req.files.files] : req.files.files;
        const { folderName } = req.params;
        let success = true;
        for (const file of files) {
            const filepath = path_1.default.resolve(__dirname, "..", `files/${folderName}`, file.name);
            file.mv(filepath, (err) => {
                if (err) {
                    success = false;
                }
                success = true;
            });
        }
        if (!success)
            return res
                .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
                .json(responses_1.default.INTERNAL_SERVER_ERROR);
        return res.status(responses_1.default.CREATED.status).json(responses_1.default.CREATED);
    }
    catch (error) {
        return res
            .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
            .json(responses_1.default.INTERNAL_SERVER_ERROR);
    }
});
exports.uploadFiles = uploadFiles;
const getFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderName, fileName, fileExtension } = req.params;
    const options = {
        root: `https://bardoweb.es/api/files/${folderName}`,
    };
    res.jsonFile(`${fileName}.${fileExtension}`, options, (err) => {
        if (err) {
            next(err);
        }
    });
});
exports.getFile = getFile;
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.unlink(req.params.route, error => {
        if (error) {
            res
                .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
                .json(responses_1.default.INTERNAL_SERVER_ERROR);
        }
        else {
            res.status(responses_1.default.CREATED.status).json(responses_1.default.CREATED);
        }
    });
});
exports.deleteFile = deleteFile;
