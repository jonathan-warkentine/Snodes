const sequelize = require("../config/connection");
const {User, Tag, Codesnip, Favorite, Codesniptag} = require("../models");

const userData = require("./userData.json");
const codesnipData = require("./codesnipData.json");
const tagData = require("./tagData.json");
const favoriteData = require("./favoriteData.json");
const codesniptagData = require("./codesniptagData.json");

const seedDatabase = async () => {
  await sequelize.sync({force: true});

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const codesnips = await Codesnip.bulkCreate(codesnipData, {
    individualHooks: true,
    returning: true,
  });

  const tags = await Tag.bulkCreate(tagData, {
    individualHooks: true,
    returning: true,
  });

  const favorites = await Favorite.bulkCreate(favoriteData, {
    individualHooks: true,
    returning: true,
  });

  const codesniptags = await Codesniptag.bulkCreate(codesniptagData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
