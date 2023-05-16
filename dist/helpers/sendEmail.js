"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("../config/index"));
const handlebarOptions = {
    viewEngine: {
        partialsDir: path_1.default.resolve(__dirname, "../..", "emails"),
        defaultLayout: false,
    },
    viewPath: path_1.default.resolve(__dirname, "../..", "emails"),
};
const transportInfo = {
    host: index_1.default.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: index_1.default.EMAIL,
        pass: index_1.default.MAIL_PASS,
    },
};
const sendEmail = (to, subject, template, context, res) => {
    const transporter = nodemailer_1.default.createTransport(transportInfo);
    transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
    const mailOptions = {
        from: '"Serra Arquitectos" <info@vonceescalada.com>',
        to,
        subject,
        template,
        context,
    };
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            return res.status(500).json({
                message: "Internal server error",
                status: 500,
                error,
            });
        }
        return res.status(201).json({
            message: "Email sent successfully",
            status: 201,
        });
    });
};
exports.default = sendEmail;
