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
exports.uploadSite = exports.getSites = void 0;
const index_1 = __importDefault(require("../database/index"));
const index_2 = __importDefault(require("../config/index"));
const pagination_1 = require("../helpers/pagination");
const responses_1 = __importDefault(require("../config/responses"));
const getSites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, category } = req.params;
        const offset = (0, pagination_1.getOffset)(index_2.default.listPerPage, parseInt(page, 10));
        const [sites] = yield index_1.default.query(`SELECT * FROM sites WHERE type = '${category}' ORDER BY id DESC LIMIT ${offset},${index_2.default.listPerPage}`);
        const [amountOfPages] = yield index_1.default.query(`SELECT COUNT(*) FROM sites`);
        if (sites) {
            const rowData = amountOfPages;
            const meta = {
                page,
                totalPages: parseInt(Object.keys(rowData)[0], 10),
            };
            return res.status(responses_1.default.OK.status).json({
                data: sites,
                meta,
                status: responses_1.default.OK.status,
            });
        }
    }
    catch (error) {
        return res
            .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
            .json(Object.assign(Object.assign({}, responses_1.default.INTERNAL_SERVER_ERROR), { error }));
    }
});
exports.getSites = getSites;
const uploadSite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, year, principal, type, location, tasks, description, size, images, } = req.body;
        const [createSite] = yield index_1.default.query("INSERT INTO sites (code,year,principal,type,location,tasks,description,size,images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [code, year, principal, type, location, tasks, description, size, images]);
        const rowData = createSite;
        if (rowData.affectedRows === 0) {
            return res
                .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
                .json(responses_1.default.INTERNAL_SERVER_ERROR);
        }
        return res.status(responses_1.default.CREATED.status).json(responses_1.default.CREATED);
    }
    catch (error) {
        return res
            .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
            .json(Object.assign(Object.assign({}, responses_1.default.INTERNAL_SERVER_ERROR), { error }));
    }
});
exports.uploadSite = uploadSite;
