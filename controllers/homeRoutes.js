const router = require("express").Router();
const {User, Codesnip, Tag, Codesniptag} = require("../models");
const withAuth = require("../utils/auth");
const {Op} = require("sequelize");

// If logged in, displays the recent snodes on homepage, if not logged in, displays top snodes
router.get("/", async (req, res) => {
  try {
    let snodes;
    let user;
    if (req.session.logged_in) {
      recentSnodeData = await Codesnip.findAll({
        order: [["date", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
          {
            model: Tag,
          },
        ],
        limit: 10,
      });
      userData = await User.findByPk(req.session.user_id);

      user = userData.get({plain: true});

      snodes = recentSnodeData.map((snode) => snode.get({plain: true}));
    } else {
      snodeData = await Codesnip.findAll({
        order: [["favorited", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
          {
            model: Tag,
          },
        ],
        limit: 10,
      });
      snodes = snodeData.map((snode) => snode.get({plain: true}));
    }
    console.log(snodes);
    console.log(user);
    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(snodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/snode/:snodeid", async (req, res) => {
  try {
    let snodes = await Codesnip.findByPk(req.params.snodeid, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Tag,
        },
      ],
    });
    snodes = [snodes.get({plain: true})];

    const userData = await User.findByPk(req.session.user_id);
    const user = userData.get({plain: true});

    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Return the top Snodes sorted with most favorited on top
router.get("/topsnodes", withAuth, async (req, res) => {
  try {
    snodeData = await Codesnip.findAll({
      order: [["favorited", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Tag,
        },
      ],
      limit: 10,
    });

    snodes = snodeData.map((snode) => snode.get({plain: true}));

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(snodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Return the most recently posted Snodes
router.get("/recents", withAuth, async (req, res) => {
  try {
    snodeData = await Codesnip.findAll({
      order: [["date", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["name"],
        },
        {
          model: Tag,
        },
      ],
      limit: 10,
    });
    snodes = snodeData.map((snode) => snode.get({plain: true}));

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(snodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Return the most commonly used tags
router.get("/tags", withAuth, async (req, res) => {
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

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    // Pass serialized data and session flag into template
    res.render("categories", {
      tags,
      user,
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
        {
          model: Tag,
        },
      ],
    });

    const snodes = favSnodeData.map((snode) => snode.get({plain: true}));

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    // // Pass serialized data and session flag into template
    res.render("homepage", {
      snodes,
      user,
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
      include: [
        {
          model: User,
        },
        {
          model: Tag,
        },
      ],
    });

    const snodes = personalSnodeData.map((snode) =>
      snode.get({plain: true})
    );

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    profileUserData = await User.findByPk(req.params.id);

    const profileUser = profileUserData.get({plain: true});
    console.log(snodes)
    // // Pass serialized data and session flag into template
    res.render("profile", {
      snodes,
      user,
      profileUser,
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
    let snodes = [];
    allData = await User.findAll({
      where: {
        id: req.params.id,
      },
    });

    const allData2 = allData.map((user) => user.get({plain: true}));
    
if (allData2[0].favorites == null) {
  console.log(snodes)
  userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    profileUserData = await User.findByPk(req.params.id);

    const profileUser = profileUserData.get({plain: true});
  res.render("profile", {
    snodes,
    user,
    profileUser,
    user_id: req.session.user_id,
    logged_in: req.session.logged_in,
  });
} else {
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
        {
          model: Tag,
        },
      ],
    });

    snodes = favSnodeData.map((snode) => snode.get({plain: true}));

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    profileUserData = await User.findByPk(req.params.id);

    const profileUser = profileUserData.get({plain: true});
    console.log(snodes)
    // // Pass serialized data and session flag into template
    res.render("profile", {
      snodes,
      user,
      profileUser,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });
  }
    // res.json(favSnodes);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Sends user to the page to draft up a new snode
router.get("/draftsnode", withAuth, async (req, res) => {
  try {
    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});
    
    res.render("snodeditor", {
      layout: "draftsnode",
      user,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });
    // res.json(blogpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search", withAuth, async (req, res) => {
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
            {
              model: Tag,
            },
          ],
        },
      ],
    });

    const tagResults = tagData.map((snode) => snode.get({plain: true}));
    const snodes = tagResults.map((tag) => tag.codesnips).flat();

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    // // Pass serialized data and session flag into template
    res.render("search", {
      snodes,
      user,
      user_id: req.session.user_id,
      logged_in: req.session.logged_in,
    });

    // res.json(codesnips);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search/advanced", withAuth, async (req, res) => {
  try {
    console.log(req.query.q);
    const searchArr = req.query.q.split(" ");

    const searchArrObj = searchArr.reduce(function (acc, tag) {
      return [...acc, {tag_name: tag}];
    }, []);

    console.log(searchArrObj);

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
            {
              model: Tag,
            },
          ],
        },
      ],
    });

    const tagResults = tagData.map((snode) => snode.get({plain: true}));
    const bigSnodeData = tagResults.map((tag) => tag.codesnips).flat();
console.log(bigSnodeData);
   let snodes = [];

    for (let i = 0; i < bigSnodeData.length; i++) {
      let z = 0;
      console.log('i = ' + i);
      for (let k = 0; k < bigSnodeData[i].tags.length; k++) {
        
          for (let j = 0; j < searchArr.length; j++) {
            console.log(bigSnodeData[i].tags[k].tag_name)
             if (bigSnodeData[i].tags[k].tag_name.toLowerCase() == searchArr[j].toLowerCase()) {
               z++;
               console.log('z = ' + z)
             }
             if (z == searchArr.length) {
                snodes.push(bigSnodeData[i]);
             }
         }
      }
    }

    //remove duplicates by looking for repeated snode.id's
    snodes = snodes.filter((snode, index) => snodes.map(snode => snode.id).indexOf(snode.id)==index);

    userData = await User.findByPk(req.session.user_id);

    const user = userData.get({plain: true});

    // // Pass serialized data and session flag into template
    res.render("search", {
      snodes,
      user,
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