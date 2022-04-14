const router = require('express').Router();
const { Tag } = require('../../models');
const withAuth = require("../../utils/auth.js");

router.get("/", withAuth, async (req, res) => {
    try {
      tagData = await Tag.findAll();
  
      const tags = tagData.get({plain: true});
      
      res.json(tags);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;