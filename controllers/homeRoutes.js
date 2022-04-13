const router = require("express").Router();
const {User, Codesnip, Tag, Codesniptag} = require("../models");
const withAuth = require("../utils/auth");
const {Op} = require("sequelize");

// If logged in, displays the recent snodes on homepage, if not logged in, displays top snodes
router.get("/", async (req, res) => {
  try {
    let snodes;
    if (req.session.logged_in) {
      recentSnodeData = await Codesnip.findAll({
        order: [["date", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
        limit: 10,
      });

      snodes = recentSnodeData.map((snode) => snode.get({plain: true}));

    } else {
      snodeData = await Codesnip.findAll({
        order: [["favorited", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
        limit: 10,
      });
      snodes = snodeData.map((snode) => snode.get({plain: true}));
     }
    console.log(snodes);
    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(snodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Return the top Snodes sorted with most favorited on top
router.get("/topsnodes", async (req, res) => {
  try {
   snodeData = await Codesnip.findAll({
      order: [["favorited", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      limit: 10,
    });
   
    snodes = snodeData.map((snode) => snode.get({plain: true}));
console.log(snodes);
    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(snodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Return the most recently posted Snodes
router.get("/recents", async (req, res) => {
  try {
    snodeData = await Codesnip.findAll({
      order: [["date", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      limit: 10,
    });
    snodes = snodeData.map((snode) => snode.get({plain: true}));

    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(snodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Return the most commonly used tags
router.get("/tags", async (req, res) => {
  try {
    tagData = await Tag.findAll({
      include: [
        {
          model: Codesnip,
        },
      ],
    });
    tags = tagData.map((tag) => tag.get({plain: true}));
    tags.forEach((tag) => {
      tag.tag_num = tag.codesnips.length;
    });

    tags.sort((a, b) => (a.tag_num > b.tag_num ? -1 : 1));
    // Pass serialized data and session flag into template
    res.render("categories", {
      tags,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets the current user's favorited snodes and pushes them to favsnodes.handlebars
router.get("/favsnodes", withAuth, async (req, res) => {
  try {
    allData = await User.findAll({
      where: {
        id: req.session.user_id,
      },
    });

    const allData2 = allData.map((user) => user.get({plain: true}));

    const favString = allData2[0].favorites;
    const favArrStrings = favString.split(",");
    const favArr = favArrStrings.map((element) => parseInt(element));

    const arrFavObj = favArr.reduce(function (acc, favId) {
      return [...acc, {id: favId}];
    }, []);

    favSnodeData = await Codesnip.findAll({
      where: {
        [Op.or]: arrFavObj,
      },
      include: [
        {
          model: User,
        },
      ],
    });

    const snodes = favSnodeData.map((snode) => snode.get({plain: true}));

    // Pass serialized data and session flag into template
    res.render("favsnodes", {
      snodes,
    user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(favSnodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile/:id", withAuth, async (req, res) => {
  try {
    personalSnodeData = await Codesnip.findAll({
      where: {
        user_id: req.params.id,
      },
    });

    const snodes = personalSnodeData.map((snode) =>
      snode.get({plain: true})
    );

    userData = await User.findByPk(req.params.id);

    const user = userData.get({plain: true});
    console.log(snodes)
    // // Pass serialized data and session flag into template
    res.render("profile", {
      snodes,
      user,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(personalSnodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Gets the requested user's favorite snodes sends them to the profile.handlebars PERSONAL
router.get("/profile/favorite/:id", withAuth, async (req, res) => {
  try {
    allData = await User.findAll({
      where: {
        id: req.params.id,
      },
    });

    const allData2 = allData.map((user) => user.get({plain: true}));

    const favString = allData2[0].favorites;
    const favArrStrings = favString.split(",");
    const favArr = favArrStrings.map((element) => parseInt(element));

    const arrFavObj = favArr.reduce(function (acc, favId) {
      return [...acc, {id: favId}];
    }, []);

    favSnodeData = await Codesnip.findAll({
      where: {
        [Op.or]: arrFavObj,
      },
      include: [
        {
          model: User,
        },
      ],
    });

    const snodes = favSnodeData.map((snode) => snode.get({plain: true}));

    // Pass serialized data and session flag into template
    res.render("profile", {
      snodes,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(favSnodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Sends user to the page to draft up a new snode
router.get("/draftsnode", async (req, res) => {
  try {
    res.render("snodeditor", {
      layout: 'draftsnode',
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });
    // res.json(blogpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search", async (req, res) => {
  try {
    console.log(req.query.q);
    const searchArr = req.query.q.split(" ");

    const searchArrObj = searchArr.reduce(function (acc, tag) {
      return [...acc, {tag_name: tag}];
    }, []);

    console.log(searchArrObj);
    // Query: Find all Tags with ALL of the search parameters. Include the codesnips associated. Include the user associated with each codesnip.
    tagData = await Tag.findAll({
      where: {
        [Op.or]: searchArrObj,
      },
      include: [
        {
          model: Codesnip,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });

    const tagResults = tagData.map((snode) => snode.get({plain: true}));
    const snodes = tagResults.map(tag => tag.codesnips).flat();


    
    // Pass serialized data and session flag into template
    res.render("search", {
      snodes,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });


    // res.json(codesnips);
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

//
// TESTING:
// Search by Tag Id
//
router.get("/testing/:search", async (req, res) => {
  try {
    const searchArr = req.params.search.split("&");

    const searchArrObj = searchArr.reduce(function (acc, favId) {
      return [...acc, {id: favId}];
    }, []);

    // Query: Find all Tags with ALL of the search parameters. Include the codesnips associated. Include the user associated with each codesnip.
    codesnipData = await Tag.findAll({
      where: {
        [Op.and]: searchArrObj,
      },
      include: [
        {
          model: Codesnip,
          include: [
            {
              model: User,
            },
          ],
        },
      ],
    });

    const searchResults = codesnipData.map((snode) => snode.get({plain: true}));

    // // Pass serialized data and session flag into template
    // res.render("searchresults", {
    //   searchResults,
    //   user_id: req.session.user_id,
    //   logged_in: req.session.logged_in,
    // });

    res.json(searchResults);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;