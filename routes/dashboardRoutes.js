const { Router } = require('express');
const dashboardController = require('../controllers/dashboardController');
const bodyParser = require('body-parser');

const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/dashboard', requireAuth, dashboardController.dashboard_get);
router.post('/dashboard', requireAuth, dashboardController.dashboard_post);
router.get('/taskManager', requireAuth, dashboardController.taskManager_get);
router.get('/courses', requireAuth, dashboardController.courses_get);
router.post('/courses', requireAuth, dashboardController.courses_post);
router.get('/addCourse', requireAuth, dashboardController.addCourse_get);
router.post('/addCourse', requireAuth, dashboardController.addCourse_post);
router.get('/profile', requireAuth, dashboardController.profile_get);
router.post('/profile', requireAuth, dashboardController.profile_post);

module.exports = router;