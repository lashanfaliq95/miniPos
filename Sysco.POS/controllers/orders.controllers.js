const order = require("../models/orders");
const mongoose = require("mongoose");
const Item = require("./items.controllers");
const itemModel = require("../models/items");

// Create an order
exports.createOrder = (req, res, next) => {
  if (req.body.items && req.body.createdby) {
    const newOrder = new order(req.body);
    newOrder
      .save()
      .then(order => {
        return res.status(200).send(order);
      })
      .catch(err => {
        return next(err);
      });
  } else {
    return res.status(400).send({
      message: "cannot create order,please insert the required fields"
    });
  }
};

// Remove an order
exports.removeOrder = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    order
      .findOneAndDelete({ _id: req.params._id })
      .then(order => {
        if (!order) {
          return res.status(404).send({
            message: "order not found with id  " + req.params._id
          });
        }
        return res.send(order);
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  } else {
    return res.status(400).send({
      message: "insert a correct order _id"
    });
  }
};

// Get an order
exports.getOrder = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    order
      .findOne({ _id: req.params._id })
      .populate("items.item")
      .populate("createdby")
      .then(order => {
        if (!order) {
          return res.status(404).send({
            message: "order not found with id " + req.params._id
          });
        }
        console.log(order);
        return res.status(200).send(order);
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  } else {
    return res.status(400).send({
      message: "please enter a correct order ID"
    });
  }
};

// Update an order
exports.updateOrder = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    order
      .findOneAndUpdate(
        { _id: req.params._id },
        { $set: { status: req.body.status } }
      )
      .then(order => {
        if (!order) {
          return res.status(404).send({
            message: "order not found with id " + req.params._id
          });
        }
        order.status = req.body.status;
        order.save();
        return res.send(order);
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  } else {
    return res.status(400).send({
      message: "insert a correct order ID"
    });
  }
};

exports.getAllOrders = (req, res, next) => {
  order
    .find()
    .then(order => {
      return res.status(200).send(order);
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

// Update an order
exports.updateItemsOnOrder = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    order
      .findOne({ _id: req.params._id })
      .populate("items.item")
      .populate("createdby")
      .then(order => {
        if (!order) {
          return res.status(404).send({
            message: "order not found with id  " + req.params._id
          });
        }

        if (mongoose.Types.ObjectId.isValid(req.params.item_id)) {
          const items = order.items;
          const value = parseInt(req.body.value);

          //find the index of the item we need to change
          index = items.findIndex(x => x.item._id == req.params.item_id);

          let orderamount = items[index].orderamount;
          let newqty;

          //if the request value is positive increase the item count
          if (value >= 0) {
            //if there are not enough items available on stock
            if (items[index].item.qtyonstock < value) {
              return res.status(400).send({
                message: "no items on stock"
              });
            }

            newqty = items[index].item.qtyonstock - value;
            Item.setItemQtyThroughOrder(items[index].item._id, newqty);
            orderamount += value;
          } else {
            if (items[index].orderamount < Math.abs(value)) {
              return res.status(400).send({
                message: "no items on order"
              });
            }
            newqty = items[index].item.qtyonstock + Math.abs(value);
            item.setItemQtyThroughOrder(items[index].item._id, newqty);
            orderamount -= Math.abs(value);
          }
          order.items[index].item.qtyonstock = newqty;
          order.items[index].orderamount = orderamount;
          order.save();

          return res.status(200).send({
            orderamount: parseInt(orderamount),
            qtyonstock: parseInt(newqty)
          });
        } else {
          return res.status(400).send({
            message: "insert a correct item _id"
          });
        }
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  } else {
    return res.status(400).send({
      message: "insert a correct order _id"
    });
  }
};

// Update an order
exports.removeItemsOnOrder = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    order
      .findOne({ _id: req.params._id })
      .populate("items.item")
      .populate("createdby")
      .then(order => {
        if (!order) {
          return res.status(404).send({
            message: "order not found with id  " + req.params._id
          });
        }
        if (mongoose.Types.ObjectId.isValid(req.params.item_id)) {
          const items = order.items;

          //find the index of the item we need to change
          index = items.findIndex(x => x.item._id == req.params.item_id);
          const orderamount = items[index].orderamount;

          //remove all items from order
          const newqty = items[index].item.qtyonstock + orderamount;
          Item.setItemQtyThroughOrder(items[index].item._id, newqty);

          //remove item from array
          let removeditem = items[index].item;
          removeditem.qtyonstock = newqty;
          order.items.splice(index, 1);
          order.save();

          return res.status(200).send(removeditem);
        } else {
          return res.status(400).send({
            message: "insert a correct item _id"
          });
        }
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  } else {
    return res.status(400).send({
      message: "insert a correct order _id"
    });
  }
};

// add an item to an order
exports.addItemToAnOrder = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params._id)) {
    order
      .findOne({ _id: req.params._id })
      .populate("items.item")
      .populate("createdby")
      .then(async order => {
        console.log("test");
        if (!order) {
          return res.status(404).send({
            message: "order not found with id  " + req.params._id
          });
        }
        if (mongoose.Types.ObjectId.isValid(req.params.item_id)) {
          itemModel
            .findOne({ _id: req.params.item_id })
            .then(item => {
              const newItem = { item: item, orderamount: 1 };
              Item.AddItemToOrder(req.params.item_id);
              order.items.push(newItem);
              order.save();
              return res.status(200).send(order);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          return res.status(400).send({
            message: "insert a correct item _id"
          });
        }
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  } else {
    return res.status(400).send({
      message: "insert a correct order _id"
    });
  }
};
