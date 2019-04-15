var express = require('express');
var router = express.Router();
const items=require('../controllers/items.controllers');
const requireLogin=require('../controllers/require_login');


/* Add item */
router.post('/createitem',items.createItem);

/* Remove item */
router.delete('/removeitem/:id',items.removeItem);

/* Get item */
router.get('/getitem/:id',requireLogin,items.getItem);

/* Get all items */
router.get('/getallitems',requireLogin,items.getAllItems);

/* Update item */
router.put('/updateitem/:id',requireLogin,items.updateItemQty);

module.exports = router;
