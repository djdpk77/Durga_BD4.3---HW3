const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

app.use(cors());
app.use(express.json());

//app.use(express.static('static'));

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Function to fetch products by a specific category from the database
async function fetchProductsByCategory(category) {
  let query = 'SELECT * FROM products WHERE category = ?';
  let response = await db.all(query, [category]);

  return { products: response };
}

//Endpoint 1: Fetch All Products by category
app.get('/products/category/:category', async (req, res) => {
  let category = req.params.category;

  try {
    const results = await fetchProductsByCategory(category);

    if (results.products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found for category : ' + category });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch products by a specific brand from the database
async function fetchProductsByBrand(brand) {
  let query = 'SELECT * FROM products WHERE brand = ?';
  let response = await db.all(query, [brand]);

  return { products: response };
}

//Endpoint 2: Fetch Products by Brands
app.get('/products/brand/:brand', async (req, res) => {
  let brand = req.params.brand;

  try {
    const results = await fetchProductsByBrand(brand);

    if (results.products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found for brand : ' + brand });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch products more than equal to the rating
async function fetchProductsByRating(rating) {
  let query = 'SELECT * FROM products WHERE rating >= ?';
  let response = await db.all(query, [rating]);

  return { products: response };
}

//Endpoint 3: Fetch Products by Rating
app.get('/products/rating/:rating', async (req, res) => {
  let rating = parseFloat(req.params.rating);

  try {
    const results = await fetchProductsByRating(rating);

    if (results.products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found for rating : ' + rating });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function to fetch all the products having stock having less than stock from the database
async function fetchProductsByStocks(stock) {
  let query = 'SELECT * FROM products WHERE stock <= ?';
  let response = await db.all(query, [stock]);

  return { products: response };
}

//Endpoint 4 : Fetch products by stock Count
app.get('/products/stocks/:stock', async (req, res) => {
  let stock = parseInt(req.params.stock);

  try {
    const results = await fetchProductsByStocks(stock);

    if (results.products.length === 0) {
      return res
        .status(404)
        .json({ message: 'No products found for stock count : ' + stock });
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
