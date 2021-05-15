import { Router } from 'express';
import { Category } from '../models/category';

const categoriesRouter = Router();

categoriesRouter.post('/categories', async function (req, res) {
  const category = new Category({
    title: req.body.title,
    description: req.body.description,
    pictureUri: req.body.pictureUri,
  });

  try {
    const result = await Category.create(category);
    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
    console.error(err);
  }
});

export default categoriesRouter;
