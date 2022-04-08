const router = require("express").Router();
const {User, Codesnip, Favorite, Tag, Codesniptag} = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    if(req.session.logged_in) {
      const snodeData = await Favorite.findAll({
        where: {
          user_id: req.session.user_id,
        },
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
    })} else {
      // TODO: Build this to make the snodeData only the top favorited snodes
      const snodeData = await Codesnip.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
    })
    }
    const snodes = snodeData.map((snode) => snode.get({plain: true}));
    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      logged_in: req.session.logged_in 
    });
    // res.json(blogpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }

  res.render("login");
});


module.exports = router;
