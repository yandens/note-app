import { Router } from 'hyper-express';

import { JWT_ACCESS_EXPIRATION } from '$libs/config';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  RegisterRequestSchema,
  UpdatePasswordRequestSchema,
  UpdateUserRequestSchema,
  UserSchema,
} from '$libs/db/schemas';
import { ResponseSchema } from '$libs/db/schemas/common';
import ApiError from '$libs/error';
import { validate } from '$libs/hash';
import { sign } from '$libs/jwt';
import { route } from '$routes/router';
import {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserPassword,
} from '$services/user';

const router = new Router();

route(
  router,
  'post',
  '/register',
  {
    summary: 'Register User',
  },
  {
    body: RegisterRequestSchema,
    response: ResponseSchema(UserSchema.omit({ password: true })),
  },
  async (req, res) => {
    const { email, password, confirmPassword } = req.data;

    const exist = await getUserByEmail(email);
    if (exist) throw new ApiError(404, 'email_already_exist');

    if (password !== confirmPassword)
      throw new ApiError(404, 'password_mismatch');

    const result = await createUser(req.data);
    if (!result) throw new ApiError(500, 'error_create_user');

    return res.json({ message: 'success', data: result });
  },
);

route(
  router,
  'post',
  '/login',
  {
    summary: 'Login User',
  },
  {
    body: LoginRequestSchema,
    response: ResponseSchema(LoginResponseSchema),
  },
  async (req, res) => {
    const { email, password } = req.data;

    const user = await getUserByEmail(email);
    if (!user) throw new ApiError(401, 'wrong_email_or_password');

    const valid = await validate(user.password, password);
    if (!valid) throw new ApiError(401, 'wrong_email_or_password');

    const token = await sign(
      { userId: user._id.toString() },
      { expiresIn: `${Number(JWT_ACCESS_EXPIRATION)}H` },
    );

    return res.json({ message: 'success', data: { user, token } });
  },
);

route(
  router,
  'get',
  '/me',
  {
    summary: 'Get Current User',
  },
  {
    response: ResponseSchema(UserSchema.omit({ password: true })),
    permission: true,
  },
  async (req, res) => {
    const user = await getUserById(req.user.id);
    if (!user) throw new ApiError(401, 'unauthorized');

    return res.json({ message: 'success', data: user });
  },
);

route(
  router,
  'patch',
  '/me',
  {
    summary: 'Update Current User',
  },
  {
    body: UpdateUserRequestSchema,
    response: ResponseSchema(UserSchema.omit({ password: true })),
    permission: true,
  },
  async (req, res) => {
    const user = await getUserById(req.user.id);
    if (!user) throw new ApiError(401, 'unauthorized');

    const result = await updateUser(req.user, req.data);
    if (!result) throw new ApiError(500, 'update_user_error');

    return res.json({ message: 'success', data: result });
  },
);

route(
  router,
  'patch',
  '/change-password',
  {
    summary: 'Change Current User Password',
  },
  {
    body: UpdatePasswordRequestSchema,
    response: ResponseSchema(UserSchema.omit({ password: true })),
    permission: true,
  },
  async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.data;

    const user = await getUserById(req.user.id);
    if (!user) throw new ApiError(401, 'unauthorized');

    const valid = await validate(user.password, oldPassword);
    if (!valid) throw new ApiError(401, 'password_mismatch');

    if (newPassword !== confirmPassword)
      throw new ApiError(401, 'password_mismatch');

    const result = await updateUserPassword(req.user, req.data);
    if (!result) throw new ApiError(500, 'update_user_password_error');

    return res.json({ message: 'success', data: result });
  },
);

export default router;
