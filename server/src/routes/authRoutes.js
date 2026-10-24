const router = require('express').Router();
const { login, demoLogin, demoStatus } = require('../controllers/authController');

router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/demo-status', demoStatus);

module.exports = router;
