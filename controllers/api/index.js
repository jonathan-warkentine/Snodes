const router = require('express').Router();
const userRoutes = require('./userRoutes');
const tagRoutes = require('./tagRoutes');
const codesnipRoutes = require('./codesnipRoutes');

router.use('/users', userRoutes);
router.use('/tag', tagRoutes);
router.use('/codesnip', codesnipRoutes);


module.exports = router;
