"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submissionController_1 = require("../controllers/submissionController");
const router = (0, express_1.Router)();
router.get('/getFirebaseConfig', submissionController_1.getFirebaseConfig);
exports.default = router;
