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
router.get("/all", sites_controller_1.getAllSites);
router.get("/", sites_controller_1.getSitesForCarousel);
router.post("/", validateToken_1.default, sites_controller_1.uploadSite);
router.get("/id=:id", sites_controller_1.getSiteById);
router.get("/code=:code", sites_controller_1.getSiteByCode);
router.put("/", validateToken_1.default, sites_controller_1.editSite);
exports.default = router;
