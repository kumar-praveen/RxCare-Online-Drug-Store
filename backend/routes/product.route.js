import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from "../controllers/product.controller.js";
import multer from "multer";
import { bulkAddProducts } from "../controllers/product.controller.js";

const productRouter = express.Router();
const bulkUpload = multer({ dest: "uploads/" });

productRouter.post("/add", upload.array(["images"]), authSeller, addProduct);
productRouter.get("/list", productList);
productRouter.post("/id", productById);
productRouter.post("/stock", authSeller, changeStock);

// Multer for bulk upload

productRouter.post(
  "/bulk-add",
  authSeller,
  bulkUpload.fields([
    { name: "csv", maxCount: 1 },
    { name: "images", maxCount: 50 },
  ]),
  bulkAddProducts,
);

export default productRouter;
