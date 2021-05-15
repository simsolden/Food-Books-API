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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const category_1 = require("./models/category");
const categories_1 = __importDefault(require("./routes/categories"));
const recipes_1 = __importDefault(require("./routes/recipes"));
const upload = multer_1.default({ dest: __dirname + '/public/images', limits: { fileSize: 3000000 } });
mongoose_1.default.set('useNewUrlParser', true);
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.set('useCreateIndex', true);
const app = express_1.default();
app.use(express_1.default.json());
app.use('/images', express_1.default.static(__dirname + '/public/images'));
app.use(categories_1.default);
app.use(recipes_1.default);
const MONGODB_URL = process.env.DB_URL;
mongoose_1.default.connect(MONGODB_URL || 'mongodb://localhost/food-books', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const recipe = new category_1.Category({
            title: 'Cuisine italienne',
            description: 'La cuisine italienne est depuis longtemps réputée comme une des meilleurs du monde. Avec ces parfums de méditérannée, elle vous emmène dans de délicieuses saveurs avec les produits de son terroir. un délice',
            pictureUri: 'petittest.jpg',
        });
        try {
            const delet = yield category_1.Category.deleteMany();
            console.log(delet);
        }
        catch (err) {
            console.error(err);
        }
    });
});
app.listen(3030);
app.post('/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        const extension = req.file.originalname.split('.')[1];
        const newFileName = `${req.file.destination}/${req.file.filename}.${extension}`;
        fs_1.default.rename(req.file.path, newFileName, (err) => {
            if (err)
                console.error(err);
        });
        res.json(`http://localhost:3030/images/${req.file.filename}.${extension}`);
    }
});
