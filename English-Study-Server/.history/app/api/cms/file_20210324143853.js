import { LinRouter, ParametersException } from 'lin-mizar';

import { loginRequired } from '../../middleware/jwt';
import { LocalUploader } from '../../extension/file/local-uploader';
import fs from 'fs';
import path from 'path';

const file = new LinRouter({
  prefix: '/cms/file'
});

file.linPost('upload', '/', loginRequired, async ctx => {
  const file = ctx.request.files.file;
  const date = new Date().getTime()
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = path.join(__dirname, '../../assets/upload/')`${date+file.name}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  console.log(reader)
  ctx.success({
    message:'上传成功'
  });
  // const files = await ctx.multipart();
  // if (files.length < 1) {
  //   throw new ParametersException({ code: 10033 });
  // }
  // const uploader = new LocalUploader('app/assets');
  // const arr = await uploader.upload(files);
  

});

export { file };
