const { Router } = require('express');
const crudController = require('../controllers/crudController');
const bodyParser = require('body-parser');

const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/create', requireAuth, crudController.create_get);
router.post('/create', requireAuth, crudController.create_post);
router.get('/read', requireAuth, crudController.read_get);
router.get('/update', requireAuth, crudController.update_get);
router.post('/update', requireAuth, crudController.update_post);
router.post('/updatea', requireAuth, crudController.updatea_post);
router.get('/delete', requireAuth, crudController.delete_get);
router.post('/delete', requireAuth, crudController.delete_post);

module.exports = router;