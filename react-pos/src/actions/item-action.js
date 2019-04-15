import axios from "axios";
import { URL } from "../resources/variables";
export const UPDATE_ITEMS = "items:updateItems";
export const UPDATE_ORDER_ITEMS = "items:updateOrderItems";
export const UPDATE_ORDER_PRICE = "items:updateOrderPrice";
export const DELETE_ORDER_ITEMS = "items:deleteOrderItems";
export const UPDATE_ORDER_ITEM_QTY = "items:updateOrderItemQty";
export const DELETE_ORDER_ITEM = "items:deleteOrderItem";
export const ADD_ORDER_ITEM = "items:addOrderItem";
export const ADD_ALL_ITEM = "items:addAllItem";
export const DELETE_ALL_ITEM = "items:deleteAllItem";
export const DELETE_ALL_ITEMS = "items:deleteAllItems";


export function updateItems(newItems) {
  return {
    type: UPDATE_ITEMS,
    payload: {
      items: newItems
    }
  };
}

export function updateOrderItems(newItems) {
  return {
    type: UPDATE_ORDER_ITEMS,
    payload: {
      items: newItems
    }
  };
}

export function updateOrderPrice() {
  return {
    type: UPDATE_ORDER_PRICE
  };
}

export function deleteOrderItem(newItem) {
  return {
    type: DELETE_ORDER_ITEM,
    payload: {
      item: newItem
    }
  };
}
export function deleteOrderItems() {
  return {
    type: DELETE_ORDER_ITEMS,
    payload: {
      items: [],
      price: 0
    }
  };
}

export function updateOrderItemQty(itemID, orderamount, qtyonstock) {
  return {
    type: UPDATE_ORDER_ITEM_QTY,
    payload: {
      itemID: itemID,
      orderamount: orderamount,
      qtyonstock: qtyonstock
    }
  };
}

export function addOrderItem(newItem) {
  return {
    type: ADD_ORDER_ITEM,
    payload: {
      item: newItem
    }
  };
}
export function addAllItem(newItem) {
  return {
    type: ADD_ALL_ITEM,
    payload: {
      item: newItem
    }
  };
}
export function deleteAllItem(itemID) {
  return {
    type: DELETE_ALL_ITEM,
    payload: {
      itemID: itemID
    }
  };
}

export function deleteAllItems() {
  return {
    type: DELETE_ALL_ITEMS,
    payload: {
     items:[]
    }
  };
}

export function getAllItems(items) {
  return dispatch => {
    axios
      .get(URL + "items/getallitems", { withCredentials: true })
      .then(res => {
        let allItemsNew = [];

        //find which items are already in order

        res.data.map(item => {
          let added = false;
          items.map(addedItem => {
            if (item._id === addedItem.item._id) {
              added = true;
            }
            return addedItem;
          });

          allItemsNew.push({ item: item, added: added });
          return item;
        });

        if (res.status === 200) {
          dispatch(updateItems(allItemsNew));
        } else {
          console.log("Items not found");
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            alert("Session has timed out, please login again ");
            this.props.history.push("/login");
          }
        }
        console.log(err);
      });
  };
}

export function getOrderItems(orderId) {
  const url = URL + "orders/getorder/" + orderId;
  return dispatch => {
    axios
      .get(url, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
          dispatch(updateOrderItems(res.data.items));
          dispatch(updateOrderPrice());
          dispatch(getAllItems(res.data.items));
        } else {
          console.log("Items not found");
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            alert("Session has timed out, please login again ");
            this.props.history.push("/login");
          }
        }
        console.log(err);
      });
  };
}

export function deleteOrderItemPUT(orderId, itemId) {
  return dispatch => {
    const deleteUrl = URL + "orders/removeorderitems/" + orderId + "/" + itemId;
    axios(deleteUrl, {
      method: "put",
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(deleteOrderItem(res.data));

          dispatch(addAllItem(res.data));
          dispatch(updateOrderPrice());
        }
      })
      .catch(err => {
        if (err.status === 401) {
          alert("Session has timedout please login again ");
          this.props.history.push("/login");
        }
        console.log(err);
      });
  };
}

export function addOrderItemPUT(orderId, itemId) {
  return dispatch => {
    const url = URL + "orders/addorderitems/" + orderId + "/" + itemId;

    axios(url, {
      method: "put",
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(updateOrderItems(res.data.items));
          dispatch(deleteAllItem(itemId));
        }
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 401) {
            alert("Session has timedout please login again ");
            this.props.history.push("/login");
          }
        }
        console.log(err);
      });
  };
}

export function updateOrderItemQtyPUT(num, orderId, itemId) {
  return dispatch => {
    const updateurl = URL + "orders/updateorderitems/" + orderId + "/" + itemId;

    axios(updateurl, {
      method: "put",
      withCredentials: true,
      data: { value: num }
    })
      .then(res => {
        if (res.status === 200) {
          dispatch(
            updateOrderItemQty(
              itemId,
              res.data.orderamount,
              res.data.qtyonstock
            )
          );
          dispatch(updateOrderPrice());
        }
      })
      .catch(err => {
        console.log(err);
        if (err.status === 401) {
          alert("Session has timedout please login again ");
          this.props.history.push("/login");
        }
        if (err.response.status === 400) {
          alert("Please enter a correct order amount");
        }
      });
  };
}
