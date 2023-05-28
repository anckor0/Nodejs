const express = require('express');
const adminController = require('../controllers/admin');
const isauth = require('../auth/isauth');
const router = express.Router();
const { check, body } = require('express-validator')

// /admin/add-product => GET
router.get('/add-product', isauth, adminController.addProductGet);

// // /admin/add-product => POST
router.post('/add-product',
    [
        body('title').isLength({ max: 12 }).withMessage('Title should be under 12 characters'),
        body('price').isFloat({ min: 0}).withMessage('Price must be greater than 0'),
        body('desc').isLength({ min: 10, max: 64 }).withMessage('Title should be under 64 characters'),
    ],
isauth, adminController.addProductPost);

// // /admin/admin-dash => GET
router.get('/admin-dash', isauth, adminController.dashGet);

// // // /admin/admin-dash => POST
router.post('/' + 'edit-product' + '/' + ':prodId',
    [
        body('title').isLength({ max: 12 }).withMessage('Title should be under 12 characters'),
        body('price').isFloat({ min: 0}).withMessage('Price must be greater than 0'),
        body('desc').isLength({ min: 10, max: 64 }).withMessage('Title should be under 64 characters'),
    ],
isauth, adminController.editPost);

// // // /admin/edit-product => POST
router.post('/edit-product', isauth, adminController.editProductPost);

router.post('/' + 'delete', isauth, adminController.deletePost);

module.exports = router;

