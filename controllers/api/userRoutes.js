const router = require("express").Router();
const {User, Codesnip} = require("../../models");

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/favorite/:id", async (req, res) => {
  try {
    const codesnipId = req.params.id;
    // Change back to req.session.user_id
    const userData = await User.findByPk(2);
    const user = userData.get({plain: true});
    console.log(user);

    const snodeData = await Codesnip.findByPk(codesnipId);
    const snode = snodeData.get({plain: true});
    console.log(snode);

    let favArrStrings;
    if (!user.favorites) {
      favArrStrings = [];
    } else {
      favArrStrings = user.favorites.split(",");
    }
    console.log(favArrStrings);
    console.log(favArrStrings.includes(codesnipId));

    if (favArrStrings.includes(codesnipId)) {
      console.log("hey");
      const i = favArrStrings.indexOf(codesnipId);
      console.log(i);
      favArrStrings.splice(i, 1);
      console.log(favArrStrings);
      let favStrings;
      if (!favArrStrings.length) {
        favStrings = null;
      } else {
        favStrings = favArrStrings.join(",");
      }

      console.log(favStrings);
      const newUserData = await User.update(
        {
          favorites: favStrings,
        },
        {
          where: {
            // Change back to req.session.user_id
            id: 2,
          },
        }
      );
      const newFavNum = parseInt(snode.favorited) - 1;
      console.log(newFavNum);
      const newCodesnipData = await Codesnip.update(
        {
          favorited: newFavNum,
        },
        {
          where: {
            id: codesnipId,
          },
        }
      );
    } else {
      console.log(favArrStrings);
      favArrStrings.push(codesnipId);
      const favStrings = favArrStrings.join(",");
      console.log(favStrings);
      const newUserData = await User.update(
        {
          favorites: favStrings,
        },
        {
          where: {
            // Change back to req.session.user_id
            id: 2,
          },
        }
      );
      const newFavNum = parseInt(snode.favorited) + 1;
      console.log(newFavNum);
      const newCodesnipData = await Codesnip.update(
        {
          favorited: newFavNum,
        },
        {
          where: {
            id: codesnipId,
          },
        }
      );
    }

    res.status(200).json(snodeData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({where: {email: req.body.email}});

    if (!userData) {
      res
        .status(400)
        .json({message: "Incorrect email or password, please try again"});
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({message: "Incorrect email or password, please try again"});
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({user: userData, message: "You are now logged in!"});
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
