var express = require('express');
var router = express.Router();
const orders=require('../controllers/orders.controllers');
const requireLogin=require('../controllers/require_login')

/* Add order */
router.post('/createorder',orders.createOrder);

/* Remove order */
router.delete('/removeorder/:_id',requireLogin,orders.removeOrder);

/* Get order */
router.get('/getorder/:_id',requireLogin,orders.getOrder);

/* Get all orders*/
router.get('/getallorders',requireLogin,orders.getAllOrders);

/* Update order */
router.put('/updateorder/:_id',requireLogin,orders.updateOrder);

/* Update items on order*/
router.put('/updateorderitems/:_id/:item_id',requireLogin,orders.updateItemsOnOrder);

/* remove items on order*/
router.put('/removeorderitems/:_id/:item_id',requireLogin,orders.removeItemsOnOrder);

/* Update items on order*/
router.put('/addorderitems/:_id/:item_id',requireLogin,orders.addItemToAnOrder);

module.exports = router;    