const { Product, Category } = require("../models");
class ProductController {
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
}
module.exports = ProductController;
