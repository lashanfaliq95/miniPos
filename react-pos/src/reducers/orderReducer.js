import { UPDATE_ORDERS, UPDATE_ORDER } from "../actions/order-actions";

export default function orderReducer(state = [], { type, payload }) {
  switch (type) {
    case UPDATE_ORDERS:
      return payload.orders;
    case UPDATE_ORDER:
      const updatedOrders = state.map(order => {
        if (order._id === payload.order._id) {
          order = payload.order;
        }
        return order;
      });
      return updatedOrders;

    default:
      return state;
  }
}
