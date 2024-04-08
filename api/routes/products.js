const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    // Generate a unique identifier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Get the file extension
    const fileExt = file.originalname.split('.').pop();
    // Construct the new filename
    const filename = uniqueSuffix + '.' + fileExt;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require("../models/product");

router.get("/", ProductsController.products_get_all);

router.post("/", checkAuth, upload.single('productImage'), ProductsController.products_create_products);

router.get("/:productId",ProductsController.products_get_spec);

router.patch("/:productId", checkAuth, );

router.delete("/:productId", checkAuth, ProductsController.products_delete_products);

module.exports = router;