const mysql = require("mysql");
// const Sequelize = require("sequelize");
const { Sequelize, DataTypes } = require("sequelize");
const toursData = require("./../dev-data/data/my-sql-data.json");
// const sequelize = new Sequelize("sqlite::memory:");
// const connection = require("./../server");
const connection = mysql.createConnection({
  host: "202251014amit.mysql.database.azure.com",
  user: "Amit_202251014",
  password: "202251014@Anubhav",
  database: "natours",
});
const sequelize = new Sequelize(
  "natours",
  "Amit_202251014",
  "202251014@Anubhav",
  {
    host: "202251014amit.mysql.database.azure.com",
    dialect: "mysql",
    logging: false,
  }
);
connection.connect((err) => {
  if (err) {
    console.error("error connecting to mysql" + err);
    return;
  }
  console.log("connection successful");
});

// const tourSchema = `

// CREATE TABLE  tour(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     duration INT NOT NULL,
//     maxGroupSize INT NOT NULL,
//     difficulty ENUM('easy', 'medium', 'difficult') NOT NULL,
//     ratingsAverage DECIMAL(3,1) NOT NULL,
//     ratingsQuantity INT NOT NULL,
//     price DECIMAL(8,2) NOT NULL,
//     summary TEXT NOT NULL,
//     description TEXT NOT NULL,
//     imageCover VARCHAR(255) NOT NULL,
//     images JSON NOT NULL,
//     startDates JSON NOT NULL
// );
// `;
// connection.query("select * from tour", function (err, result, fields) {
//   if (err) throw err;
//   console.log(result);
// });

const Tour = sequelize.define("Tour", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  slug: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    isIn: {
      args: [["easy", "difficult", "medium"]],
      msg: "difficulty must be easy,medium and difficult",
    },
  },
  difficulty: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    //validator
    isInt: {
      msg: "Must be an integer number of pennies",
    },
  },
  priceDiscount: {
    type: DataTypes.FLOAT,
    // custom validator
    check(value) {
      if (value > price) {
        throw new Error("priceDiscount must be less than price ");
      }
    },
  },
  maxGroupSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageCover: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  images: {
    type: DataTypes.STRING,
  },
  ratingAverage: {
    type: DataTypes.FLOAT,
    defaultValue: 4.5,
  },
  ratingQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  startDates: {
    type: DataTypes.DATE,
  },
});
// (async () => {
//   try {
//     await sequelize.drop();
//     console.log("All tables dropped!");
//   } catch (error) {
//     console.error("Error creating Tours table:", error);
//   }
// })();
// Sync the Tour model with the database
// (async () => {
//   try {
//     await sequelize.sync({ force: true }); // This will drop the existing table and create a new one
//     console.log("Tours table created successfully.");
//   } catch (error) {
//     console.error("Error creating Tours table:", error);
//   }
// })();

// // // Insert data into Tour model
// (async () => {
//   await sequelize.sync(); // Ensure the table exists
//   for (const tourData of toursData) {
//     try {
//       await Tour.create(tourData);
//       console.log(`Tour "${tourData.name}" created successfully.`);
//     } catch (error) {
//       console.error(`Error creating tour "${tourData.name}":`, error);
//     }
//   }
// })();
//HOOKS
// Define hooks for the Tour model
Tour.addHook("beforeCreate", (tour, options) => {
  console.log("Before creating tour:", tour.name);
});

Tour.addHook("beforeUpdate", (tour, options) => {
  console.log("Before updating tour:", tour.name);
});

Tour.addHook("beforeDestroy", (tour, options) => {
  console.log("Before deleting tour:", tour.name);
});

module.exports = Tour;
