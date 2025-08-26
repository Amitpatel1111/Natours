const { query } = require("express");
const Tour = require("./../models/tourModelSql");

exports.getALLTourSQL = async (req, res) => {
  try {
    console.log(req.query);
    const queryObj = { ...req.query };
    const extractedFields = ["page", "sort", "limit", "fields"];
    extractedFields.forEach((el) => delete queryObj[el]);

    //1B)Advanced Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/:|,/gi, function (x) {
    //   if (x === ":") return "=";
    //   else return AND;
    // });
    const query = await Tour.findAll();
    // if(req.)
    // const queryStr = queryObj
    //   .entries(obj)
    //   .map(([key, value]) => `${key}= ${value}`)
    //   .join(" AND ");

    // if (req.query) {
    //   query = `SELECT * FROM tour where ${queryStr}`;
    // }
    // console.log(query);

    // Execute the query
    // connection.query(query, (error, results, fields) => {
    //   if (error) {
    //     console.error("Error retrieving tours: ", error);
    //     res.status(500).json({ error: "Internal Server Error" });
    //     return;
    //   }

    // Send the fetched data as a response
    res.json({
      status: "okk",
      size: query.length,
      data: {
        query,
      },
    });
  } catch (err) {
    res.status(404).json({
      mess: err,
    });
  }
};

exports.createTourSQL = async (req, res) => {
  // const query = `insert into tour ${req.body}`;
  // connection.query(query, (error, results, fields) => {
  //   if (error) {
  //     console.error("Error retrieving tours: ", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //     return;
  //   }

  // Send the fetched data as a response
  // res.json(results);
  // });

  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getTourSQL = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
    } else {
      res.json(tour);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTourSQL = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
    } else {
      await tour.destroy();
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// updateTours
exports.updateToursSQL = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
    } else {
      await tour.update(req.body);
      res.json(tour);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
