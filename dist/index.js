"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Routes_1 = __importDefault(require("./Route/Routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' })); // ઈમેજ માટે લિમિટ વધારી
// Prefix સેટઅપ
app.use('/api', Routes_1.default);
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Search Backend running on http://localhost:${PORT}`);
});
