"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//api.ts
const express_1 = require("express");
const submissionController_1 = require("../controllers/submissionController");
const router = (0, express_1.Router)();
router.get('/getApiKey', submissionController_1.getApiKey);
exports.default = router;
