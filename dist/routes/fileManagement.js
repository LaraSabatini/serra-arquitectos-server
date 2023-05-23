"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateToken_1 = __importDefault(require("../helpers/auth/validateToken"));
const fileManagement_controller_1 = require("../controllers/fileManagement.controller");
const router = express_1.default.Router();
router.post("/folderName=:folderName", validateToken_1.default, fileManagement_controller_1.uploadFiles);
router.post("/new-folder", validateToken_1.default, fileManagement_controller_1.createFolder);
router.get("/folderName=:folderName&file_name=:file_name&file_extension=:file_extension", validateToken_1.default, fileManagement_controller_1.getFile);
router.delete("/route=:route", validateToken_1.default, fileManagement_controller_1.deleteFile);
router.delete("/folderName=:folderName", validateToken_1.default, fileManagement_controller_1.deleteFolder);
exports.default = router;
