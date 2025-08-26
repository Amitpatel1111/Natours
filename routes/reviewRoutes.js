const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');
const routes = express.Router({ mergeParams: true });
routes.use(authController.protect);
routes
  .route('/')
  .get(reviewController.getAllReview)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReviews
  );

routes
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );
module.exports = routes;
