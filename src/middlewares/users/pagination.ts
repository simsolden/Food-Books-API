import { Recipe } from '../../models/recipe';

export const pagination = async (req: any, res: any, next: any) => {
  const LIMIT = 8;
  const page = +req.query.page;
  res.pagination = {};

  delete req.query.page;

  const startIndex = (page - 1) * LIMIT;
  const endIndex = page * LIMIT;

  let resultsCount = 0;

  if (req.query.title) {
    const search = req.query.title;
    const regex = new RegExp(`.*${search}.*`, 'i');
    //To be able to use the rest of the query as a document countDocumentser, remove title
    delete req.query.title;

    if (req.query.categories) {
      const categories = req.query.categories;
      delete req.query.categories;

      resultsCount = await Recipe.countDocuments(req.query)
        .where('owner')
        .equals(req.user._id)
        .where('title')
        .regex(regex)
        .where('categories')
        .in(categories)
        .sort('-_id');

      req.query.categories = categories;
    } else {
      resultsCount = await Recipe.countDocuments(req.query)
        .where('owner')
        .equals(req.user._id)
        .where('title')
        .regex(regex)
        .sort('-_id');

      req.query.title = search;
    }
  } else {
    if (req.query.categories) {
      const categories = req.query.categories;
      delete req.query.categories;

      resultsCount = await Recipe.countDocuments(req.query)
        .where('owner')
        .equals(req.user._id)
        .where('categories')
        .in(categories)
        .sort('-_id');

      req.query.categories = categories;
    } else {
      resultsCount = await Recipe.countDocuments(req.query).where('owner').equals(req.user._id).sort('-_id');
    }
  }

  if (endIndex < resultsCount) {
    res.pagination.next = {
      page: page + 1,
      lastPage: Math.ceil(resultsCount / LIMIT),
    };
  }

  if (startIndex > 0) {
    res.pagination.previous = {
      page: page - 1,
      lastPage: Math.ceil(resultsCount / LIMIT),
    };
  }

  req.limit = LIMIT;
  req.startIndex = startIndex;
  next();
};
