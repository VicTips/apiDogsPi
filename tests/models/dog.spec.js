const { Dog, conn } = require("../../src/db.js");

describe("Dog model", () => {
  beforeAll(async () => {
    await conn.sync({ force: true });
  });

  describe("Validators", () => {
    describe("Name", () => {
      it("should not create the Dog if name is null", async () => {
        try {
          await Dog.create({
            name: null,
            min_height: 20,
            max_height: 25,
            min_weight: 10,
            max_weight: 15,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it("should throw an error if name isn't valid (only letters)", async () => {
        try {
          await Dog.create({
            name: "pug1",
            min_height: 20,
            max_height: 25,
            min_weight: 10,
            max_weight: 15,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it("should not create two Dogs with the same name", async () => {
        expect.assertions(2);
        try {
          const dogOne = await Dog.create({
            name: "Lola",
            min_height: 20,
            max_height: 25,
            min_weight: 10,
            max_weight: 15,
          });
          expect(dogOne.toJSON().name).toEqual("Lola");
          await Dog.create({
            name: "Lola",
            min_height: 22,
            max_height: 27,
            min_weight: 12,
            max_weight: 17,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });
    });

    describe("Height", () => {
      it("should not create the Dog if min_height is null", async () => {
        try {
          await Dog.create({
            name: "Firulais",
            min_height: null,
            max_height: 25,
            min_weight: 10,
            max_weight: 15,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it("should not create the Dog if max_height is null", async () => {
        try {
          await Dog.create({
            name: "Firulais",
            min_height: 20,
            max_height: null,
            min_weight: 10,
            max_weight: 15,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it("should not create the Dog if max_height is less than min_height", async () => {
        try {
          await Dog.create({
            name: "Richie",
            min_height: 20,
            max_height: 18,
            min_weight: 10,
            max_weight: 15,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });
    });

    describe("Weight", () => {
      it("should not create the Dog if min_weight is null", async () => {
        try {
          await Dog.create({
            name: "Firulais",
            min_height: 20,
            max_height: 25,
            min_weight: null,
            max_weight: 15,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it("should not create the Dog if max_weight is null", async () => {
        try {
          await Dog.create({
            name: "Firulais",
            min_height: 20,
            max_height: 25,
            min_weight: 10,
            max_weight: null,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });

      it("should not create the Dog if max_weight is less than min_weight", async () => {
        try {
          await Dog.create({
            name: "Pepe",
            min_height: 20,
            max_height: 22,
            min_weight: 10,
            max_weight: 8,
          });
        } catch (error) {
          expect(error.message).toBeDefined();
        }
      });
    });

    it("should create the Dog if all required properties are ok", async () => {
      const newDog = await Dog.create({
        name: "Firulais",
        min_height: 20,
        max_height: 25,
        min_weight: 10,
        max_weight: 15,
      });
      expect(newDog.toJSON().name).toEqual("Firulais");
    });
  });
});
