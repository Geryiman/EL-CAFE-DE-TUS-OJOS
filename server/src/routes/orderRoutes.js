const router = require('express').Router();
const { createOrder, listOrders, updateOrderStatus, getOrder } = require('../controllers/orderController');
const { requireAdmin } = require('../middlewares/authMiddleware');

router.post('/', createOrder);
router.get('/', requireAdmin, listOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', requireAdmin, updateOrderStatus);

module.exports = router;
