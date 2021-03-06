import { NotFound,Forbidden } from 'lin-mizar';
import { ArticleModel } from '../model/article';
import { CategoryModel } from '../model/category'
import { Op } from 'sequelize'

class Article {
  // 查看文章列表
  static async getArticleList(page = 1, size = 5,q) {
    const res = await ArticleModel.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${q}%`
        }
      },
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      limit: Number(size),//长度
      offset: (Number(page) - 1) * Number(size),//当前列表开始值
      include: [{ // include关键字表示关联查询
        model: CategoryModel,
        attributes: [['category_name', 'name']],
      }],
      raw: true // 这个属性表示开启原生查询，原生查询支持的功能更多，自定义更强
    });
    return res;
  }
  // 新增文章
  static async createArticle(v) {
    const article = await ArticleModel.findOne({
      where: {
        title: v.title
      }
    });
    if (article) {
      throw new Forbidden({
        code: 10240
      });
    }
    await ArticleModel.create(v);
  }

  // 修改文章
  static async editArticle(id, v) {
    const article = await ArticleModel.findByPk(id);
    if (!article) {
      throw new NotFound();
    }

    return await article.update({ ...v });
  }
  // 删除文章
  static async deleteArticle(id) {
    return ArticleModel.destroy({
      where: { id }
    });
  }
  // 关键词查找
  // static async getArticleByKeyword (q) {
  //   const article = await ArticleModel.findOne({
  //     where: {
  //       title: {
  //         [Op.like]: `%${q}%`
  //       }
  //     }
  //   });
  //   return article;
  // }
};

export { Article as ArticleDao };