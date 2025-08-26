const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const tourRoute = require('./routes/tourRoutes');
const userRoute = require('./routes/userRoutes');
const reviewRoute = require('./routes/reviewRoutes');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const viewRouter = require('./routes/viewRoutes');

const app = express();
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com'], // Stripe uses iframes
      connectSrc: ["'self'", 'ws://localhost:*', 'https://api.stripe.com'], // allow websocket and Stripe API calls
    },
  })
);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
console.log(process.env.NODE_ENV);

// 1)Global MIDDLEWARE.....
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); //
// app.use(express.static(`${__dirname}/public`));
// Set Security Http Headers
// app.use(helmet()); // Already using specific helmet middleware above
//Development logging

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//Limit REQ from the same API
const limit = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  // messege: 'Too many req from this Ip,Please Try again in an hour',
});
app.use('/api', limit);
//Body Parser , Reading Data From body into req.body
app.use(express.json({ limit: '10kb' })); // middleware
//Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());
//Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//serving ststic files
// app.get('/', (req, res) => {
//   res.status(200).render('base');
// });

// creating our own middleware
app.use((req, res, next) => {
  console.log('Hello From the middleware 👋👋👋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  next();
});
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'hello from the server side', app: 'Natours' });
// });
// // post
// app.post('/', (req, res) => {
//   res.send('you can post to this endpoint');
// });

// app.get('/api/v1/tours', getAllTours);
// specific get request (req.params)
// app.get('/api/v1/tours/:id', getTour);
// post req
// app.post('/api/v1/tours', createTour);
// Patch req
// app.patch('/api/v1/tours/:id', updateTour);/\
// delete
// app.delete('/api/v1/tours/:id', deleteTour);

//better way of routing
// 3) ROUTES
app.use('/', viewRouter);
app.use('/tours', tourRoute);
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/review', reviewRoute);

// 4) Routes Handler(error)
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can not find ${req.originalUrl}`,
  // });
  // const err = new Error(`Can not jjshhioiow find ${req.originalUrl}`);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new appError(`Can not jjshhioiow find ${req.originalUrl}`, 404));
});

// 5) GLOBAL ERROR HANDLER
app.use(globalErrorHandler);
module.exports = app;
