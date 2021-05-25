import { Category } from '../models/category';

export const createCategory = async (req: any, res: any, next: any) => {
  const category = new Category({
    title: req.body.title,
    description: req.body.description,
    pictureUri: req.body.pictureUri,
  });

  req.body.descriptionSource && category.set('descriptionSource', req.body.descriptionSource);

  try {
    await Category.create(category);

    res.status(200).json({ category });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findCategories = async (req: any, res: any, next: any) => {
  try {
    let result;
    if (req.query) {
      result = await Category.find(req.query).sort('title');
    } else {
      result = await Category.find().sort('title');
    }
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};

export const findOneCategory = async (req: any, res: any, next: any) => {
  try {
    const categoryId = req.params.categoryId;
    const result = await Category.findOne({ _id: categoryId });
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
};
