import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import csvParser from "csv-parser";
import fs from "fs";
import { Readable } from "stream";

// Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    await Product.create({ ...productData, image: imagesUrl });

    res.json({
      success: true,
      message: "Product Added",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Product : /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find();
    return res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Single Product : /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Change Product inStock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Bulk Add Products : /api/product/bulk-add
export const bulkAddProducts = async (req, res) => {
  try {
    const results = [];
    const csvFile = req.files.csv[0];
    const imageFiles = req.files.images || [];

    // Parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFile.path)
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", resolve)
        .on("error", reject);
    });

    if (results.length === 0) {
      return res.json({ success: false, message: "CSV file is empty" });
    }

    // Upload images to Cloudinary & map by filename
    const imageMap = {};
    for (const image of imageFiles) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      imageMap[image.originalname] = result.secure_url;
    }

    // Build products array from CSV rows
    const products = results.map((row) => {
      // images column: "img1.jpg,img2.jpg"
      const imageNames = row.images
        ? row.images.split("|").map((s) => s.trim())
        : [];
      const imageUrls = imageNames
        .map((name) => imageMap[name])
        .filter(Boolean);

      return {
        name: row.name,
        description: row.description
          ? row.description.split("|").map((d) => d.trim())
          : [],
        category: row.category,
        price: Number(row.price),
        offerPrice: Number(row.offerPrice),
        inStock: row.inStock === "true" || row.inStock === "TRUE",
        image: imageUrls,
      };
    });

    // Validate products
    const invalid = products.filter(
      (p) =>
        !p.name ||
        !p.category ||
        !p.price ||
        !p.offerPrice ||
        p.image.length === 0,
    );

    if (invalid.length > 0) {
      return res.json({
        success: false,
        message: `${invalid.length} product(s) have missing fields or unmatched images.`,
        invalid: invalid.map((p) => p.name || "Unnamed"),
      });
    }

    await Product.insertMany(products);

    // Cleanup temp files
    fs.unlinkSync(csvFile.path);
    imageFiles.forEach((f) => fs.unlinkSync(f.path));

    res.json({
      success: true,
      message: `${products.length} products added successfully!`,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
