const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "dog",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^[a-z ]+$/i,
        },
      },
      min_height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_height: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isGreaterThanOrEqualToMinHeight(value) {
            if (parseInt(value) < parseInt(this.min_height)) {
              throw new Error(
                "Max_height should be greater than or equal to min_height."
              );
            }
          },
        },
      },
      height: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.min_height} - ${this.max_height}`;
        },
      },
      min_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isGreaterThanOrEqualToMinWeight(value) {
            if (parseInt(value) < parseInt(this.min_weight)) {
              throw new Error(
                "Max_weight should be greater than or equal to min_weight."
              );
            }
          },
        },
      },
      weight: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.min_weight} - ${this.max_weight}`;
        },
      },
      life_span: {
        type: DataTypes.INTEGER,
        get() {
          const rawValue = this.getDataValue("life_span");
          return rawValue ? `${rawValue} years` : null;
        },
      },
      image: {
        type: DataTypes.STRING,
        defaultValue:
          "https://www.sunrisemovement.org/es/wp-content/plugins/ninja-forms/assets/img/no-image-available-icon-6.jpg",
      },
      temperament: {
        type: DataTypes.VIRTUAL,
        get() {
          let temperamentsArray = [];
          const rawValue = this.temperaments;
          if (rawValue) {
            for (let i = 0; i < rawValue.length; i++) {
              temperamentsArray.push(rawValue[i].name);
            }
            return `${temperamentsArray.join(", ")}`;
          }
          return null;
        },
      },
    },
    { timestamps: false }
  );
};
