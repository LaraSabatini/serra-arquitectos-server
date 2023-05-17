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
exports.sendRestorePasswordEmail = exports.changePassword = exports.signIn = exports.signUp = void 0;
const index_1 = __importDefault(require("../database/index"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../helpers/auth");
const sendEmail_1 = __importDefault(require("../helpers/sendEmail"));
const index_2 = __importDefault(require("../config/index"));
const responses_1 = __importDefault(require("../config/responses"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email } = req.body;
    const password = (0, auth_1.generatePassword)();
    const encryptedPassword = yield (0, auth_1.encrypt)(password);
    const newUser = { fullName, email };
    const token = jsonwebtoken_1.default.sign({ user: newUser }, index_2.default.SECRET_TOKEN || "token");
    const [user] = yield index_1.default.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    if (user.length)
        return res
            .status(responses_1.default.UNAUTHORIZED.status)
            .json(responses_1.default.UNAUTHORIZED);
    const [registerUser] = yield index_1.default.query("INSERT INTO users (fullName, email, password, token) VALUES (?, ?, ?, ?)", [fullName, email, encryptedPassword, token]);
    const rowData = registerUser;
    if (rowData.affectedRows === 0)
        return res
            .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
            .json(responses_1.default.INTERNAL_SERVER_ERROR);
    return (0, sendEmail_1.default)([newUser.email], "Bienvenido a V11", "signUp", {
        name: newUser.fullName,
        email: newUser.email,
        password: password,
        loginURL: "http://localhost:3000/login",
    }, res);
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const [user] = yield index_1.default.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    const validatePassword = user.length > 0 ? yield (0, auth_1.compare)(password, user[0].password) : false;
    if (!validatePassword)
        return res
            .status(responses_1.default.UNAUTHORIZED.status)
            .json(responses_1.default.UNAUTHORIZED);
    const token = jsonwebtoken_1.default.sign({ user: { email, password } }, index_2.default.SECRET_TOKEN || "token");
    return res
        .header("auth-token", token)
        .status(responses_1.default.OK.status)
        .json(responses_1.default.OK);
});
exports.signIn = signIn;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, newPassword } = req.body;
    const { encrypted } = req.params;
    const [user] = yield index_1.default.query("SELECT password, id FROM users WHERE email = ?", [email]);
    const validatePassword = encrypted === "false"
        ? yield (0, auth_1.compare)(password, user[0].password)
        : password === user[0].password;
    if (!validatePassword)
        return res
            .status(responses_1.default.UNAUTHORIZED.status)
            .json(responses_1.default.UNAUTHORIZED);
    const encryptedNewPassword = yield (0, auth_1.encrypt)(newPassword);
    const [updateUser] = yield index_1.default.query("UPDATE users SET password = ?  WHERE id = ?", [encryptedNewPassword, user[0].id]);
    const rowData = updateUser;
    if (rowData.affectedRows === 0)
        return res
            .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
            .json(responses_1.default.INTERNAL_SERVER_ERROR);
    return res.status(responses_1.default.CREATED.status).json(responses_1.default.CREATED);
});
exports.changePassword = changePassword;
const sendRestorePasswordEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recipients } = req.body;
        const [user] = yield index_1.default.query("SELECT password, id, fullName FROM users WHERE email = ?", [recipients[0]]);
        if (user.length > 0)
            return (0, sendEmail_1.default)(recipients, "Recuperación de contraseña", "restorePassword", {
                name: user[0].name,
                restoreURL: `http://localhost:3000/login?restore_password=true&redirected=true&pass=${user[0].password}&id=${user[0].id}&email=${recipients[0]}`,
            }, res);
        return res.status(responses_1.default.NOT_FOUND.status).json(responses_1.default.NOT_FOUND);
    }
    catch (error) {
        return res
            .status(responses_1.default.INTERNAL_SERVER_ERROR.status)
            .json(responses_1.default.INTERNAL_SERVER_ERROR);
    }
});
exports.sendRestorePasswordEmail = sendRestorePasswordEmail;
