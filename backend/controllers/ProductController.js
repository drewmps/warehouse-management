const multer = require("multer");

const { Product, Category } = require("../models");
const cloudinary = require("../helpers/cloudinaryHelper");
class ProductController {
  static async createProduct(req, res, next) {
    try {
      const { name, price, categoryId } = req.body;
      if (!categoryId) {
        throw { name: "BadRequest", message: "category is required" };
      }

      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw { name: "NotFound", message: "category not found" };
      }

      if (!req.file) {
        throw {
          name: "BadRequest",
          message: "please select an image",
        };
      }

      const mimeType = req.file.mimetype;
      const base64Image = req.file.buffer.toString("base64");
      const result = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64Image}`,
        {
          folder: "warehouse",
          public_id: req.file.originalname,
        }
      );

      await Product.create({
        name,
        price,
        imgUrl: result.secure_url,
        categoryId,
      });
      res.status(201).json({ message: "product has been added" });
    } catch (err) {
      console.log("🚀 ~ ProductController ~ createProduct ~ error:", err);
      next(err);
    }
  }

  static async getProducts(req, res, next) {
    try {
      const { filterCategory, q, page, sort } = req.query;
      const paramQuerySQL = {
        include: {
          model: Category,
        },
        limit: 10,
        offset: 0,
        where: {},
      };

      if (q) {
        paramQuerySQL.where.name = {
          [Op.iLike]: `%${q}%`,
        };
      }

      if (filterCategory) {
        paramQuerySQL.where.categoryId = filterCategory.split(",");
      }

      if (page) {
        paramQuerySQL.offset = page * paramQuerySQL.limit - paramQuerySQL.limit;
      }

      if (sort) {
        paramQuerySQL.order = [["createdAt", sort]];
      }

      const { count, rows } = await Product.findAndCountAll(paramQuerySQL);

      res.status(200).json({
        page: +page || 1,
        data: rows,
        totalData: count,
        totalPage: Math.ceil(count / paramQuerySQL.limit),
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      let { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound", message: "product not found" };
      }

      res.status(200).json(product);
    } catch (error) {
      console.log("🚀 ~ ProductController ~ getProductById ~ error:", error);
      next(error);
    }
  }

  static async deleteProductById(req, res, next) {
    try {
      let { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound", message: "product not found" };
      }

      await product.destroy();
      res
        .status(200)
        .json({ message: "product has been successfully deleted" });
    } catch (error) {
      console.log("🚀 ~ ProductController ~ getProductById ~ error:", error);
      next(error);
    }
  }

  static async editProductById(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, categoryId } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound", message: "product not found" };
      }

      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw { name: "NotFound", message: "category not found" };
      }

      if (!req.file) {
        throw {
          name: "BadRequest",
          message: "please select an image",
        };
      }

      const mimeType = req.file.mimetype;
      const base64Image = req.file.buffer.toString("base64");
      const result = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64Image}`,
        {
          folder: "warehouse",
          public_id: req.file.originalname,
        }
      );

      await product.update({
        name,
        price,
        imgUrl: result.secure_url,
        categoryId,
      });

      res.status(200).json({ message: "product has been updated" });
    } catch (err) {
      console.log("🚀 ~ ProductController ~ createProduct ~ error:", err);
      next(err);
    }
  }
}
module.exports = ProductController;
