import { LinRouter, ParametersException } from 'lin-mizar';

import { loginRequired } from '../../middleware/jwt';
import { LocalUploader } from '../../extension/file/local-uploader';

const file = new LinRouter({
  prefix: '/cms/file'
});

file.linPost('upload', '/', loginRequired, async ctx => {
  ctx.json({a:"你好"})
  // const files = await ctx.multipart();
  // console.log(ctx)
  // if (files.length < 1) {
  //   throw new ParametersException({ code: 10033 });
  // }
  // const uploader = new LocalUploader('app/assets');
  // const arr = await uploader.upload(files);
  // ctx.json(arr);

});

export { file };
