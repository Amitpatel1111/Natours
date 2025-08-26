const dotenv = require('dotenv');

// const mysql = require("mysql");
// const tourSchema = require("./models/tourModelSql");
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
// process.on("uncaughtException", (err) => {
//   console.log("UNHANDLED EXEPTION! 💥 Shutting Down ...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });

const app = require('./app');

// connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
//   if (error) throw error;
//   console.log("The solution is: ", results[0].solution);
// });
// connection.query("select * from tour", function (err, result, fields) {
//   if (err) throw err;
//   console.log(result);
// });
// connection.query(tourSchema, (error, results, fields) => {
//   if (error) {
//     console.log(error);
//     return;
//   }
//   console.log('Schema created ');
// });

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection successful');
  });
// console.log(app.get('env'));// to know express env
// console.log(process.env);

// ...... creating a documents in tours collection  .. .. .. ..;

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
// });
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR💥💥💥💥' + err);
//   });
// app.get("/tours", tourSchema.getTours);
// module.exports = connection;
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Event Linstner to handle unhaldled rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting Down ...');
  server.close(() => {
    process.exit(1);
  });
});
// console.log(x);
