import axios from "axios";
import { URL } from "../resources/variables";

export const UPDATE_ORDERS = "orders:updateOrders";
export const UPDATE_ORDER = "orders:updateOrder";

export function updateOrders(newOrders) {
  return {
    type: UPDATE_ORDERS,
    payload: {
      orders: newOrders
    }
  };
}

export function updateOrder(newOrder) {
  return {
    type: UPDATE_ORDER,
    payload: {
      order: newOrder
    }
  };
}

export function getOrders() {
  const ordersURL = URL + "orders/getallorders";
  return dispatch => {
    axios
      .get(ordersURL, { withCredentials: true })
      .then(res => {
        if (res.status === 200) {
          dispatch(updateOrders(res.data));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function updateOrderPUT(orderId, status, orders) {
  return dispatch => {
    const updateOrderURL = URL + "orders/updateorder/" + orderId;
    axios(updateOrderURL, {
      method: "put",
      withCredentials: true,
      data: { status: status }
    })
      .then(res => {
        dispatch(updateOrder(res.data));
      })
      .catch(err => {
        if (err.status === 401) {
          alert("Session has timedout please login again ");
          this.props.history.push("/login");
        }
      });
  };
}
