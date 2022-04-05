const router = require("express").Router();
const {User} = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {

    // Pass serialized data and session flag into template
    res.render("homepage", {
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
