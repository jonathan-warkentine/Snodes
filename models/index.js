// import models
const User = require("./User");
const Codesnip = require("./Codesnip");
const Tag = require("./Tag");
const Codesniptag = require("./Codesniptag");

Codesnip.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Codesnip, {
  foreignKey: 'user_id',
  onDelete: "SET NULL",
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
  Tag,
  Codesniptag
};
