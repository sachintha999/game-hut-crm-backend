const express = require('express');
const { createAdmin } = require('../controllers/userController');

const router = express.Router();

// POST /api/users  -> create an admin user
router.post('/', createAdmin);

module.exports = router;

