const { Router } = require('express');
const authController = require('../controllers/authController');
const bodyParser = require('body-parser');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/', authController.login_get);
router.post('/', authController.login_post);

module.exports = router;