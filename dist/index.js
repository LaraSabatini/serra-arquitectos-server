"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./config/index"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const fileManagement_1 = __importDefault(require("./routes/fileManagement"));
const sites_1 = __importDefault(require("./routes/sites"));
const app = (0, express_1.default)();
// settings
const port = 8000;
// middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://serra-arquitectos-qa.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Auth-Token"],
    exposedHeaders: ["Content-Type", "Auth-Token"],
}));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.static("files"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// routes
app.use("/api/auth", auth_1.default);
app.use("/api/files", fileManagement_1.default);
app.use("/api/sites", sites_1.default);
app.get("/api", (_req, res) => {
    res.json({ message: "OK" });
});
app.listen(port, () => {
    console.log(`listening on port ${index_1.default.PORT}`);
});
