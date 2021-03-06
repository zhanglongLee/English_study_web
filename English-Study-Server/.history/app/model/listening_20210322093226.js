import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/db';
import { CategoryModel } from './category';

class Listening extends Model {
  
}

Listening.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '听力练习标题'
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: '听力练习封面'
    },
    is_published: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '是否发布'
    },
    categoryId: {
      type: DataTypes.BIGINT(20),
      allowNull: false,
      comment: '听力分类'
    },
    questions_analysis: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      comment: '听力练习答案解析'
    },
    /**
     * 数据格式例如：
     * [
     *    {title:"question 1",options1:"answer1",options2:"answer2",options3:"answer3",options4:"answer4",answer:"A"},
     *    {title:"question 1",options1:"answer1",options2:"answer2",options3:"answer3",options4:"answer4",answer:"A"},
     * ] 
     */
    questions: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      comment: '听力练习问题，及对应答案'
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '听力mp3的url'
    },

  },
  {
    // 定义表名
    tableName: "listening",
    // 定义模型名称
    modelName: "listening",
    // 启用软删除
    paranoid: true,
    // 自动写入时间
    timestamps: true,
    // 重名名时间字段
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    sequelize
  }
);

// 定义外键

Listening.belongsTo(CategoryModel, {
  foreignKey: 'categoryId',
  targetKey: 'id',
});

export { Listening as ListeningModel };
