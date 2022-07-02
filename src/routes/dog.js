const { Router } = require("express");
const { Dog, Temperament } = require("../db");
const router = Router();
const axios = require("axios");
const { Op } = require("sequelize");
const { API_KEY } = process.env;
require("dotenv").config();

router.get("/", (req, res, next) => {
  const { name } = req.query;
  let promiseDogsApi;
  let promiseDogsDB;
  try {
    if (!name) {
      promiseDogsApi = axios.get(
        `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`
      );
      promiseDogsDB = Dog.findAll({ include: Temperament });
    } else {
      promiseDogsApi = axios.get(
        `https://api.thedogapi.com/v1/breeds/search?q=${name}`
      );
      promiseDogsDB = Dog.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
        include: Temperament,
      });
    }
    Promise.all([promiseDogsApi, promiseDogsDB]).then((response) => {
      const [dogsApi, dogsDB] = response;
      let filteredDogsApi = dogsApi.data.map((dog) => {
        return {
          id: dog.id,
          name: dog.name,
          bred_for: dog.bred_for,
          breed_group: dog.breed_group,
          height: dog.height.metric,
          // min_height: parseInt(dog.height.metric.split(" - ", 2)[0]),
          // max_height: parseInt(dog.height.metric.split(" - ", 2)[1]),
          image_alt: dog.reference_image_id,
          image: dog.image,
          life_span: dog.life_span,
          origin: dog.origin,
          temperament: dog.temperament,
          weight: dog.weight.metric,
          min_weight: parseInt(dog.weight.metric.split(" - ", 2)[0]),
          max_weight: parseInt(dog.weight.metric.split(" - ", 2)[1]),
        };
      });
      let allDogs = [...dogsDB, ...filteredDogsApi];
      res.send(allDogs);
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  try {
    if (id.length !== 36) {
      axios
        .get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
        .then((response) => {
          let dogsApi = response.data;
          let dog = dogsApi.find((dog) => dog.id == id);
          if (!dog) {
            return res.send({ id: "ID not found!" });
          } else {
            let filteredDogApi = {
              id: dog.id,
              name: dog.name,
              bred_for: dog.bred_for,
              breed_group: dog.breed_group,
              height: dog.height.metric,
              // min_height: parseInt(dog.height.metric.split(" - ", 2)[0]),
              // max_height: parseInt(dog.height.metric.split(" - ", 2)[1]),
              image_alt: dog.reference_image_id,
              image: dog.image.url,
              life_span: dog.life_span,
              origin: dog.origin,
              temperament: dog.temperament,
              weight: dog.weight.metric,
              min_weight: parseInt(dog.weight.metric.split(" - ", 2)[0]),
              max_weight: parseInt(dog.weight.metric.split(" - ", 2)[1]),
            };

            res.send(filteredDogApi);
          }
        });
    } else {
      Dog.findByPk(id, { include: Temperament }).then((response) =>
        response !== null
          ? res.send(response)
          : res.send({ id: "ID not found!" })
      );
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const {
    name,
    min_height,
    max_height,
    min_weight,
    max_weight,
    life_span,
    image,
    idArray,
  } = req.body;
  try {
    let newDogId;
    await Dog.create({
      name,
      min_height: parseInt(min_height),
      max_height: parseInt(max_height),
      min_weight: parseInt(min_weight),
      max_weight: parseInt(max_weight),
      life_span: parseInt(life_span) || null,
      image,
    }).then((result) => {
      newDogId = result.dataValues.id;
    });
    let newDog = await Dog.findByPk(newDogId);
    if (idArray) {
      await newDog.addTemperament(idArray);
    }
    res.send({ msg: "New dog created!" });
  } catch (error) {
    next(error);
  }
});

router.put("/", (req, res, next) => {
  res.send("soy put / dog");
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const dog = await Dog.findByPk(id);
    if (dog === null) {
      res.send({ msg: "ID not found!" });
    } else {
      await Dog.destroy({
        where: {
          id: id,
        },
      });
      res.send({ msg: "Dog deleted successfully!" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
