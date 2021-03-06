// Creating our Image model
module.exports = function(sequelize, DataTypes) {
  var Image = sequelize.define("Image", {
    thumb: {
      type: DataTypes.STRING
    },
    publicUrl: {
      type: DataTypes.STRING(1234),
      allowNull: false,
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

// switched to frebase just to handle more efficiently 
// \\  console.log(signedUrls[0])
// db.Image.create({
//     publicUrl: signedUrls[0],                
//     UserId: 26