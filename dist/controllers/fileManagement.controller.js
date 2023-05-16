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
exports.createFolder = exports.deleteFile = exports.getFile = exports.uploadFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const responses_1 = __importDefault(require("../config/responses"));
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderName } = req.body;
    const directory = path_1.default.resolve(__dirname, "..", "files");
    console.log(directory);
    if (!fs_1.default.existsSync(directory)) {
        fs_1.default.mkdirSync(directory);
    }
    const newFolderPath = path_1.default.resolve(__dirname, "..", `files/${folderName}`);
    if (!fs_1.default.existsSync(newFolderPath)) {
        fs_1.default.mkdirSync(newFolderPath);
        res
            .status(200)
            .json({ message: `Folder '${folderName}' created successfully.` });
    }
    else {
        res.status(400).json({ message: `Folder '${folderName}' already exists.` });
    }
});
exports.createFolder = createFolder;
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req.files;
    const { folderName } = req.params;
    const filepath = path_1.default.resolve(__dirname, "..", `files/${folderName}`, file.name);
    file.mv(filepath, (err) => {
        if (err) {
            res
                .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
                .send(responses_1.default.INTERNAL_SERVER_ERROR);
        }
        res.status(responses_1.default.CREATED.status).send(responses_1.default.CREATED);
    });
});
exports.uploadFiles = uploadFiles;
const getFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { folderName, fileName, fileExtension } = req.params;
    const options = {
        root: `http://localhost:8000/api/files/${folderName}`,
    };
    res.sendFile(`${fileName}.${fileExtension}`, options, (err) => {
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
                .send(responses_1.default.INTERNAL_SERVER_ERROR);
        }
        else {
            res.status(responses_1.default.CREATED.status).send(responses_1.default.CREATED);
        }
    });
});
exports.deleteFile = deleteFile;
