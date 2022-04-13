const router = require('express').Router();
const { Codesnip, Codesniptag, Tag } = require('../../models');
const {Op} = require("sequelize");

// create new Codesnip
router.post("/", async (req, res) => {
    /* req.body should look like this...
      {
        description: "string",
        content: "Longer text",
        tags: "array html css"              
      }
    */

      const newCodesnip = await Codesnip.create({
        ...req.body,
        user_id: 2,
        favorited: 0,
        date: new Date(),
      })
      const newSnodeId = newCodesnip.dataValues.id;
    //   .then((codesnip) => {
    //   console.log(codesnip.dataValues);
        // if there's codesnip tags, we need to create pairings to bulk create in the Codesniptag model
        if (req.body.tags.length) {
          const tagsArr = req.body.tags.split(" ");
          const tagsArrObj = tagsArr.reduce(function (acc, tagName) {
            return [...acc, {tag_name: tagName}];
          }, []);
        
          const prevUsedTags = await Tag.findAll({
            where: {
              [Op.or]: tagsArrObj,
            },
          });

          prevUsedTagsPlain = prevUsedTags.map((tag) => tag.get({plain: true}));

          for (let i=0; i < tagsArr.length; i++) {
              for (let j=0; j < prevUsedTagsPlain.length; j++) {
                console.log(prevUsedTagsPlain[j].tag_name.toLowerCase())
                console.log(tagsArr[i].toLowerCase());
                  if (tagsArr[i].toLowerCase() === prevUsedTagsPlain[j].tag_name.toLowerCase()) {
                      const newCodesnipTag = await Codesniptag.create({
                         codesnip_id: newSnodeId,
                         tag_id: prevUsedTagsPlain[j].id
                      });
                      console.log(newCodesnipTag);
                      tagsArr.splice(i, 1);
                      console.log(tagsArr);
                  }
              }
          }
          const newTagsArrObj = tagsArr.reduce(function (acc, tagName) {
            return [...acc, {tag_name: tagName}];
          }, []);



          const newTags = await Tag.bulkCreate(
            newTagsArrObj
          )
          console.log(newTags);
        
          const newCodesnipTagsArrObj = newTags.reduce(function (acc, tag) {
            return [...acc, {tag_id: tag.dataValues.id, codesnip_id: newSnodeId}];
          }, []);
 
          const newCodesniptags = await Codesniptag.bulkCreate(
            newCodesnipTagsArrObj
          )
          console.log(newCodesniptags);

        }
        // if no codesnip tags, just respond
        res.status(200).json(newCodesnip);
    // })
  });

module.exports = router;