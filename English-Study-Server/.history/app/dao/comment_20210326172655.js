import { NotFound,Forbidden } from 'lin-mizar';
import { CommentModel } from '../model/comment';
import { Op } from 'sequelize'

class Comment {

  // 通过id查评论
  static async getCommentById(id){
    const res = await CommentModel.findAll({
      where:{
        comment_id:id
      },
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      include: [{
        model: ArticleModel,
      }],
    });
    if(!res){
      throw new Forbidden({
        code: 10258
      });
    }
    return res
  }

  // 查看评论列表
  static async getCommentList(page = 1, size = 5,q) {
    if(q){
      var whereObj = {
        title: {
          [Op.like]: `%${q}%`
        }
      };
    }
    const res = await CommentModel.findAndCountAll({
      where: whereObj,
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      limit: Number(size),//长度
      offset: (Number(page) - 1) * Number(size),//当前列表开始值
      include: [{ // include关键字表示关联查询
        model: ArticleModel,
        // attributes: [['category_name', 'name']],
      }],
      // raw: true // 这个属性表示开启原生查询，原生查询支持的功能更多，自定义更强
    });
    return res;
  }
  // 新增评论
  static async createComment(v) {
    return await CommentModel.create(v);
  }

  // 修改评论
  static async editComment(id, v) {
    const comment = await CommentModel.findByPk(id);
    if (!comment) {
      throw new NotFound();
    }

    return await comment.update({ ...v });
  }
  // 删除评论
  static async deleteComment(id) {
    return CommentModel.destroy({
      where: { id }
    });
  }

};

export { Comment as CommentDao };