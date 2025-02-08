const { uploadImage } = require("../../helpers/cloudinary");
const Product = require("../../models/ProductSchema");

// Upload Image
const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await uploadImage(url);
    res.json({ success: true, result, msg: "Image uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Some error occured" });
  }
};

module.exports = { handleImageUpload };

// 2. Add new Product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;

    const product = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    });
    await product.save();
    console.log(product);
    res.status(201).json({
      success: true,
      data: product,
      msg: "Product added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Some error occured" });
  }
};

// 3. Fetch all products
const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res
      .status(200)
      .json({ success: true, data: products, msg: "Products fetched" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Some error occured" });
  }
};

// 4. Edit products
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    product.image = image || product.image;
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.totalStock = totalStock || product.totalStock;

    await product.save();

    res
      .status(200)
      .json({ success: true, data: product, msg: "Product updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Some error occured" });
  }
};

// 5. Delete products
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, data: product, msg: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Some error occured" });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchProducts,
  editProduct,
  deleteProduct,
};
