const express = require('express');
const userController = require('./../controller/userContoller');
const authController = require('./../controller/authController');

const routes = express.Router();
//MOUNTING.......
routes.post('/signup', authController.signup);
routes.post('/login', authController.login);
routes.post('/forgotPassword', authController.forgotPassword);
routes.patch('/resetPassword/:token', authController.resetPassword);
//protect all routes after this middle-ware
routes.use(authController.protect);
routes.patch('/updatePassword', authController.updatePassword);
routes.patch('/updateMyPassword', authController.updatePassword);
routes.get(
  '/me',

  userController.getMe,
  userController.getUser
);
routes.patch('/updateMe', userController.updateMe);
routes.delete('/deleteMe', userController.deleteMe);
routes.use(authController.restrictTo('user'));
routes
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
routes
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateuser)
  .delete(userController.deleteUser);

module.exports = routes;
