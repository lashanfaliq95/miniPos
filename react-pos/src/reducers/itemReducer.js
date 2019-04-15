import {
  UPDATE_ITEMS,
  UPDATE_ORDER_ITEMS,
  DELETE_ORDER_ITEMS,
  DELETE_ORDER_ITEM,
  DELETE_ALL_ITEM,
  ADD_ALL_ITEM,
  DELETE_ALL_ITEMS,
  UPDATE_ORDER_ITEM_QTY,
  UPDATE_ORDER_PRICE
} from "../actions/item-action";

export default function itemReducer(
  state = { allItems: [], orderItems: [], orderPrice: 0 },
  { type, payload }
) {
  let updatedItems;

  switch (type) {
    case UPDATE_ITEMS:
      return { ...state, allItems: payload.items };
    case UPDATE_ORDER_ITEMS:
      return { ...state, orderItems: payload.items };
    case UPDATE_ORDER_PRICE:
      let totalPrice = 0;
      updatedItems = state.orderItems.map(item => {
        totalPrice += item.item.price * item.orderamount;
        return item;
      });

      return { ...state, orderPrice: totalPrice };
    case DELETE_ORDER_ITEMS:
      return {
        ...state,
        orderItems: payload.items,
        orderPrice: payload.orderPrice
      };
    case DELETE_ORDER_ITEM:
      updatedItems = state.orderItems.filter(
        item => payload.item._id !== item.item._id
      );
      return { ...state, orderItems: updatedItems };
    case ADD_ALL_ITEM:
      updatedItems = state.allItems.map(item => {
        if (item.item._id === payload.item._id) {
          item.added = false;
        }
        return item;
      });
      return { ...state, allItems: updatedItems };
    case DELETE_ALL_ITEM:
      updatedItems = state.allItems.map(item => {
        if (item.item._id === payload.itemID) {
          item.added = true;
        }
        return item;
      });
      return { ...state, allItems: updatedItems };
      case DELETE_ALL_ITEMS:
      return {
        ...state,
        allItems: payload.items,
        
      };
    case UPDATE_ORDER_ITEM_QTY:
      updatedItems = state.orderItems.map(item => {
        if (item.item._id === payload.itemID) {
          item.orderamount = payload.orderamount;
          item.item.qtyonstock = payload.qtyonstock;
        }
        return item;
      });
      return { ...state, orderItems: updatedItems };
    default:
      return state;
  }
}
