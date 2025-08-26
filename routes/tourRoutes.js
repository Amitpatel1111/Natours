const express = require('express');
const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewRoute = require('./reviewRoutes');
// const tourControllerSQL = require("./../controller/tourControllerSQL");
const routes = express.Router();

// routes
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReviews
//   );
routes.use('/:tourId/reviews', reviewRoute);
routes.route('/tour-stats').get(tourController.getTourStats);
routes
  .route('/month-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthPlan
  );
routes
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
routes.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

routes
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours);
routes
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
routes
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'user'),
    tourController.deleteTour
  );
//Post//tour//234fdawu27/reviews

module.exports = routes;
