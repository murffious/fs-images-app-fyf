// Creating our Image model
module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define("Image", {
    thumb: {
      type: DataTypes.STRING
    },
    publicUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  Image.associate = function(models) {
    Image.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        foreignKey: "userId"
      }
    });
  };

  return Image;
};
