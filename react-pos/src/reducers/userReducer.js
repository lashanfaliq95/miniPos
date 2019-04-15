import { UPDATE_USER, AUTHENTICATE_USER ,LOGOUT_USER} from "../actions/user-actions";

export function userReducer(
  state = { username: "", authenticate: false },
  { type, payload }
) {
  switch (type) {
    case UPDATE_USER:
    console.log('test')
      return {...state,username:payload.user};
    case AUTHENTICATE_USER:
      return {...state,authenticate:payload.authenticate};
     case LOGOUT_USER:
     return payload;
    default:
      return state;
  }
}


