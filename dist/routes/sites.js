"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validateToken_1 = __importDefault(require("../helpers/auth/validateToken"));
const sites_controller_1 = require("../controllers/sites.controller");
const router = express_1.default.Router();
router.get("/page=:page&category=:category", sites_controller_1.getSites);
router.post("/", validateToken_1.default, sites_controller_1.uploadSite);
exports.default = router;
