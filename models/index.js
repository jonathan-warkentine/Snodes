// import models
const User = require("./User");
const Codesnip = require("./Codesnip");
const Favorite = require("./Favorite");
const Tag = require("./Tag");
const Codesniptag = require("./Codesniptag");

Codesnip.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Codesnip, {
  foreignKey: 'user_id',
  onDelete: "SET NULL",
});

// CONSIDER if current Fails

// User.belongsToMany(Codesnip, {
//   through: Favorite,
// });

// Codesnip.belongsToMany(User, {
//   through: Favorite,
// });

Favorite.hasMany(User, {
  foreignKey: 'user_id',
  onDelete: "SET NULL",
});

User.belongsTo(Favorite, {
  foreignKey: 'user_id',
})

Favorite.hasMany(Codesnip, {
  foreignKey: 'codesnip_id',
  onDelete: "SET NULL",
});

Codesnip.belongsTo(Favorite, {
  foreignKey: 'codesnip_id',
});

Tag.belongsToMany(Codesnip, {
  through: Codesniptag,
});

Codesnip.belongsToMany(Tag, {
  through: Codesniptag,
});

module.exports = {
  User,
  Codesnip,
  Favorite,
  Tag,
  Codesniptag
};
