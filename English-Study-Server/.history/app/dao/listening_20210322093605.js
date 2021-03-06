import { NotFound, Forbidden } from 'lin-mizar';
import { ListeningModel } from '../model/listening';
import { UserDoneListening } from '../model/user-listening';
import { CategoryModel } from '../model/category'
import { Op } from 'sequelize'

class Listening {
  static async test() {
    var a = await UserDoneListening.findAll({
      include: [
        // { // include关键字表示关联查询
        //   model: UserModel,
        //   // attributes: ['username'],
        // },
        { // include关键字表示关联查询
          model: ListeningModel,
          // attributes: ['title'],
        }
      ],
    });
    return a;
  }
  // 查看听力练习列表
  static async getListeningList(page = 1, size = 5, q) {

    if (q) {
      var whereObj = {
        title: {
          [Op.like]: `%${q}%`
        }
      };
    }
    const res = await ListeningModel.findAndCountAll({
      where: whereObj,
      attributes: {
        exclude: ['deleted_at', 'updated_at']
      },
      limit: Number(size),//长度
      offset: (Number(page) - 1) * Number(size),//当前列表开始值
      include: [
        { // include关键字表示关联查询
          model: CategoryModel,
          attributes: [['category_name', 'name']],
        }
      ],
      // raw: true // 这个属性表示开启原生查询，原生查询支持的功能更多，自定义更强
    });
    return res;
  }
  // 新增听力练习
  static async createListening(v) {
    const listening = await ListeningModel.findOne({
      where: {
        title: v.title
      }
    });
    if (listening) {
      throw new Forbidden({
        code: 10255
      });
    }
    await ListeningModel.create(v);
  }

  // 修改听力练习
  static async editListening(id, v) {
    const listening = await ListeningModel.findByPk(id);
    if (!listening) {
      throw new NotFound();
    }

    return await listening.update({ ...v });
  }
  // 删除听力练习
  static async deleteListening(id) {
    return ListeningModel.destroy({
      where: { id }
    });
  }
};

export { Listening as ListeningDao };