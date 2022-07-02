const axios = require("axios");
const { Temperament } = require("../db");
const { Router } = require("express");
const router = Router();
const { API_KEY } = process.env;
require("dotenv").config();

router.get("/initialTemperaments", (req, res, next) => {
  try {
    axios
      .get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
      .then((response) => {
        let dogsApi = response.data;
        let temperaments = [];
        for (let i = 0; i < dogsApi.length; i++) {
          if (typeof dogsApi[i].temperament === "string") {
            temperaments.push(dogsApi[i].temperament.split(", "));
          }
        }
        let noDuplicates = [...new Set(temperaments.flat())];
        let sortedTemperaments = noDuplicates.sort();
        let objectArray = [];
        for (let j = 0; j < sortedTemperaments.length; j++) {
          objectArray.push({ name: sortedTemperaments[j] });
        }
        res.json(objectArray);
      });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  let temperaments = await Temperament.findAll();
  res.send(temperaments);
});

router.post("/initialTemperaments", (req, res, next) => {
  try {
    axios
      .get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
      .then((response) => {
        let dogsApi = response.data;
        let temperaments = [];
        for (let i = 0; i < dogsApi.length; i++) {
          if (typeof dogsApi[i].temperament === "string") {
            temperaments.push(dogsApi[i].temperament.split(", "));
          }
        }
        let noDuplicates = [...new Set(temperaments.flat())];
        let sortedTemperaments = noDuplicates.sort();
        let objectArray = [];
        for (let j = 0; j < sortedTemperaments.length; j++) {
          objectArray.push({ name: sortedTemperaments[j] });
        }
        Temperament.bulkCreate(objectArray).then(() =>
          res.send("Temperaments added successfully to the DB!")
        );
      });
  } catch (error) {
    next(error);
  }
});

router.post("/", (req, res, next) => {
  res.send("soy post / temperament");
});

router.put("/", (req, res, next) => {
  res.send("soy put / temperament");
});

router.delete("/", (req, res, next) => {
  res.send("soy delete / temperament");
});

module.exports = router;
