import Router from 'koa-router';
import User from '@controller/user';
const router = new Router();
router.prefix('/api');

// router.use(v1.routes(), v1.allowedMethods());

router.post('/login', async ctx => {
  await User.login(ctx);
});

router.post('/getUserInfo', async ctx => {
  await User.getUserInfo(ctx);
});

router.post('/updateUserInfo', async ctx => {
  await User.updateUserInfo(ctx);
});

export default router;
