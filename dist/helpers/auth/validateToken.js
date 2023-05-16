"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responses_1 = __importDefault(require("../../config/responses"));
const index_1 = __importDefault(require("../../config/index"));
const validateToken = (req, res, next) => {
    try {
        const token = req.header("auth-token");
        if (!token)
            return res
                .status(responses_1.default.UNAUTHORIZED.status)
                .json(responses_1.default.UNAUTHORIZED);
        jsonwebtoken_1.default.verify(token, index_1.default.SECRET_TOKEN || "token");
        next();
    }
    catch (e) {
        res.status(responses_1.default.UNAUTHORIZED.status).send(responses_1.default.UNAUTHORIZED);
    }
};
exports.default = validateToken;
