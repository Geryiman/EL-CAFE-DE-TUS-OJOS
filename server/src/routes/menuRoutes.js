const router = require('express').Router();
const { getMenu, updateMenuItem } = require('../controllers/menuController');
const { requireAdmin } = require('../middlewares/authMiddleware');

router.get('/', getMenu);
router.put('/:id', requireAdmin, updateMenuItem);

module.exports = router;
