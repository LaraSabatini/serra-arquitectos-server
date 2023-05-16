"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./config/index"));
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
// settings
const port = 8000;
// middlewares
app.use(express_1.default.json());
// routes
app.use("/api/auth", auth_1.default);
app.get("/api", (_req, res) => {
    res.json({ message: "OK" });
});
app.listen(port, () => {
    console.log(`listening on port ${index_1.default.PORT}`);
});
