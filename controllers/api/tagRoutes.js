const router = require('express').Router();
const { Tag } = require('../../models');
const withAuth = require("../../utils/auth.js");

router.get("/", async (req, res) => {
    try {
      tagData = await Tag.findAll();
  
      res.json(tagData);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;