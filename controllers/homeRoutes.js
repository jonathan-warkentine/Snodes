const router = require("express").Router();
const {User, Codesnip, Favorite, Tag, Codesniptag} = require("../models");
const withAuth = require("../utils/auth");

// If logged in, displays the user's favorites on homepage, if not logged in, displays top snodes
router.get("/", async (req, res) => {
  try {
    let snodeData;
    if (req.session.logged_in) {
      snodeData = await Favorite.findAll({
        where: {
          user_id: req.session.user_id,
        },
        include: [
          {
            model: User,
            attributes: ["name"],
          },
          {
            model: Codesnip,
          },
        ],
      });
    } else {
      // TODO: Build this to make the snodeData only the top favorited snodes
      snodeData = await Codesnip.findAll({
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });
    }
    const snodes = snodeData.map((snode) => snode.get({plain: true}));
    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      logged_in: req.session.logged_in,
    });
    // res.json(blogpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets the current user's favorited snodes and pushes them to favsnodes.handlebars
router.get("/favsnodes", withAuth, async (req, res) => {
  try {
    snodeData = await Favorite.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Codesnip,
        },
      ],
    });

    const snodes = snodeData.map((snode) => snode.get({plain: true}));

    // Pass serialized data and session flag into template
    res.render("favsnodes", {
      snodes,
      logged_in: req.session.logged_in,
    });
    // res.json(blogpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets the requested user's favorite snodes and personal snodes and sends them to the profile.handlebars
router.get("/profile/:id", withAuth, async (req, res) => {
  try {
    favSnodeData = await Favorite.findAll({
      where: {
        user_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Codesnip,
        },
      ],
    });

      personalSnodeData = await Codesnip.findAll({
        where: {
          user_id: req.params.id,
        },
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      });

    const favSnodes = favSnodeData.map((snode) => snode.get({plain: true}));
    const personalSnodes = personalSnodeData.map((snode) => snode.get({plain: true}));

    // Pass serialized data and session flag into template
    res.render("profile", {
      personalSnodes,
      favSnodes,
      logged_in: req.session.logged_in,
    });
    // res.json(blogpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Sends user to the page to draft up a new snode
router.get("/draftsnode", withAuth, async (req, res) => {
  try {
    res.render("draftsnode", {
      logged_in: req.session.logged_in,
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
