"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const category = new Schema({
    title: {
        type: String,
        unique: [true, 'category title must be unique'],
        required: [true, 'Missing category title'],
        minLength: [3, 'category title must be between 3 and 40 characters'],
        maxLength: [40, 'category title must be between 3 and 40 characters'],
    },
    description: {
        type: String,
        required: [true, 'Missing category description'],
        minLength: [10, 'category description must be between 10 and 510 characters'],
        maxLength: [510, 'category description must be between 10 and 510 characters'],
    },
    pictureUri: {
        type: String,
        unique: [true, 'category pictureUri must be unique'],
        required: [true, 'Missing category picture'],
        maxLength: [255, 'category title must be lower than 255 characters'],
    },
    created_at: { type: Date, default: Date.now },
});
exports.Category = mongoose_1.default.model('Category', category);
