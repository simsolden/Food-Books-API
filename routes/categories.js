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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../models/category");
const categoriesRouter = express_1.Router();
categoriesRouter.post('/categories', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const category = new category_1.Category({
            title: req.body.title,
            description: req.body.description,
            pictureUri: req.body.pictureUri,
        });
        try {
            const result = yield category_1.Category.create(category);
            res.status(200).json({ category });
        }
        catch (err) {
            res.status(500).json({ error: true, message: err.message });
            console.error(err);
        }
    });
});
exports.default = categoriesRouter;
