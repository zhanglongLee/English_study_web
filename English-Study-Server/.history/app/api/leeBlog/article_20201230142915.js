import { LinRouter } from 'lin-mizar';
import {CreateOrUpdateArticleValidator} from '../../validator/article';

const articleApi = new LinRouter({
  prefix: "/leeBlog/article",
  module: '文章'
});

articleApi.post("/", async ctx => {
  // 1、校验参数
  const v = await new CreateOrUpdateArticleValidator().validate(ctx);
  return ctx.json(v.get('body'));
  // 2、处理业务逻辑
  // 3、插入数据库
  // 4、提示插入成功
  
});


export {articleApi};
 