if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const history = require('connect-history-api-fallback')
const app = express();
const port = process.env.PORT || 3000;

const  SYS_DOC = process.env.SYS_DOC;
const     USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASS;
const       DB = process.env.DB_NAME;
const URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.rbvn6.mongodb.net/${DB}?retryWrites=true&w=majority`;

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

mongoose.connect(URI, mongooseOptions)
  .then(() => console.log('db connection'))
  .catch(err => console.log('db connection error:', err));


const Category = require('./models/category');
const Product = require('./models/product');
const Comment = require('./models/comment');
const System = require('./models/system');
const Cart = require('./models/cart');
const Home = require('./models/home');

const staticMiddleware = express.static(__dirname + "/dist");
app.use(staticMiddleware); //-> unredirected requests
app.use(history());
app.use(staticMiddleware); //-> redirected requests
app.use(express.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// general
app.get('/api/home', getHome);
app.get('/api/categories', getCategories);
app.get('/api/products', getProducts);
app.get('/api/comments/:productId', getProductComments);
app.get('/api/cart', getCartData);

// single category
app.get('/api/category/:id', getCategoryInfo);

// single comment
app.post('/api/comment', publishComment);
app.delete('/api/comment', deleteComment);

// single product
app.get('/api/product/:productId', getProductInfo);
app.post('/api/product', publishProduct);
app.patch('/api/product', editProduct);
app.delete('/api/product', deleteProduct);

async function cleanTempComments() {
  try {
    const sys = await System.findById(SYS_DOC);
    const secondsPassed = (Date.now() - sys.lastClean) / 1000;
    const minutesPassed = Math.floor(secondsPassed / 60);

    if (minutesPassed >= 30) {
      const removeTemps = await Comment.deleteMany({ temp: true });
      if (!removeTemps.ok) return;
      await System.findByIdAndUpdate(SYS_DOC, {
        lastClean: Date.now(),
        deletedComments: sys.deletedComments + removeTemps.deletedCount,
      })
    }
  } catch (error) {
    console.log(error);
  }
}

async function getRelatedProducts({ category, _id }) {
  // console.log(category.id, _id);
  try {
    const products = await Product.find({ category: { id: category.id } });
    products.sort((a, b) => a.cost - b.cost);
    const thisIndex = products.findIndex(product => String(product._id) == _id);
    const lastIndex = products.length - 1;
    // console.log('index:', thisIndex);

    let related = null;
    switch(thisIndex) {
      case 0:
        related = [1, 2];
        break;
      case lastIndex:
        related = [lastIndex - 1, lastIndex - 2];
        break;
      default:
      related = [thisIndex - 1, thisIndex + 1];
    }

    return related.map(i => {
      return {
              _id: products[i]._id,
             name: products[i].name,
        briefDesc: products[i].briefDesc,
         currency: products[i].currency,
             cost: products[i].cost,
        soldCount: products[i].soldCount,
           imgSrc: products[i].images[0],
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function getHome(req, res) {
  try {
    const home = await Home.find();
    res.send({ categories: home });
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    res.sendStatus(404);
    console.log(error);
  }
}

async function getCategoryInfo(req, res) {
  try {
    const catId = req.params.id;
    const category = await Category.findById(catId);
    res.send(category);
  } catch (error) {
    res.sendStatus(404);
  }
}

async function getProducts(req, res) {
  const capitalized = name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const id = req.query.cat;
  const name = req.query.catName;

  if (!id && !name) return res.sendStatus(400);

  try {
    const category = id
      ? await Category.findById(id)
      : await Category.findOne({ name: capitalized(name) });

    const products = await Product.find({ category: { id: id || String(category._id) } });
    products.forEach(product => {
      delete product._doc.description;
      delete product._doc.category;
      delete product._doc.related;
    });

    res.send({
      category: name || category.name,
      products
    });
  } catch (error) {
    res.sendStatus(404);
    console.log(error);
  }
}

async function getProductInfo(req, res) {
  try {
    const product = await Product.findById(req.params.productId);
    const category = await Category.findById(product.category.id);
    const related = await getRelatedProducts(product);
    product.category.name = category.name;
    product.related = related;
    res.send(product);
  } catch (error) {
    res.sendStatus(404);
  }
}

async function getProductComments(req, res) {
  cleanTempComments();
  try {
    const comments = await Comment.find({ productId: req.params.productId });
    comments.forEach(comment => delete comment._doc.productId);
    res.send(comments);
  } catch (error) {
    res.sendStatus(404);
  }
}

async function publishComment(req, res) {
  try {
    req.body.temp = true;
    const comment = new Comment(req.body);
    await comment.save();
    res.send(comment.toObject()._id);
  } catch (error) {
    res.sendStatus(400);
  }
}

async function deleteComment(req, res) {
  try {
    const commentId = req.body.id;
    const productId = req.body.product;
    const storedComment = await Comment.findById(commentId);
    const isCommentOfProduct = storedComment.productId === productId;

    if (isCommentOfProduct) {
      await Comment.findByIdAndDelete(commentId);
    }

    const isCommentInDB = await Comment.findById(commentId);

    res.sendStatus(isCommentOfProduct && !isCommentInDB ? 200 : 403);
  } catch (error) {
    res.sendStatus(400);
  }
}

async function getCartData(req, res) {
  try {
    const cart = await Cart.find();
    res.send(cart);
  } catch (error) {
    res.sendStatus(404);
  }
}

async function publishProduct(req, res) {
  // TODO
}

async function editProduct(req, res) {
  // TODO
}

async function deleteProduct(req, res) {
  // TODO
}


app.listen(port, () => console.log('Listening...\nhttp://localhost:' + port));
