import { LinRouter, getTokens } from 'lin-mizar';
import {
  RegisterValidator,
  LoginValidator,
  GetInfoValidator,
  UpdateInfoValidator

} from '../../validator/web-user';
import {
  web_loginRequired,
  web_refreshTokenRequiredWithUnifyException,
} from '../../middleware/web_jwt';
import { UserIdentityModel } from '../../model/web-user';
import { UserDao } from '../../dao/web-user';

const user = new LinRouter({
  prefix: '/web/user',
  module: '用户',
  // 用户权限暂不支持分配，开启分配后也无实际作用
  mountPermission: false
});

const userDao = new UserDao();

// 注册接口
user.post('/register', async ctx => {
  const v = await new RegisterValidator().validate(ctx);
  await userDao.createUser(v);
  // 注册成功
  ctx.success({
    code: 11
  });
});

// 登录接口
user.post('/login', async ctx => {
  const v = await new LoginValidator().validate(ctx);
  console.log(v);
  const user = await UserIdentityModel.verify(
    v.get('body.username'),
    v.get('body.password')
  );
  const { accessToken, refreshToken } = getTokens({
    id: user.user_id
  });
  ctx.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    id: user.user_id
  });
});

// 获取用户信息
user.post('/getInfo',web_loginRequired, async ctx => {
  const v = await new GetInfoValidator().validate(ctx);
  const userInfo = await userDao.getInformation(v)
  ctx.json(userInfo);
})

// 修改用户信息
user.post('/updateInfo',web_loginRequired, async ctx => {
  const v = await new UpdateInfoValidator().validate(ctx);
  await userDao.updateInformation(v)
  // 更新用户信息成功
  ctx.success({
    code:10252
  })
})

// 刷新令牌
user.get('/refresh',web_refreshTokenRequiredWithUnifyException, async ctx => {
  const user = ctx.currentUser;
  const { accessToken, refreshToken } = getTokens(user);
  ctx.json({
    access_token: accessToken,
    refresh_token: refreshToken
  });
})

export { user };
