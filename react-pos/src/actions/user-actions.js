import axios from "axios";
import { URL } from "../resources/variables";

export const UPDATE_USER = "users:updateUser";
export const AUTHENTICATE_USER = "users:authenticateUser";
export const LOGOUT_USER = "users:logoutUser";

export function updateUser(newUser) {
  return {
    type: UPDATE_USER,
    payload: {
      user: newUser
    }
  };
}

export function authenticateUser() {
  return {
    type: AUTHENTICATE_USER,
    payload: {  
      authenticate: true
    }
  };
}

export function logoutUser() {
  return {
    type: LOGOUT_USER,
    payload: {
      username:"",
      authenticate: false
    }
  };
}
export function resetStore() {
  return {
    type: 'USER_LOGOUT'
  };
}

export function authenticateUserPOST(username, password) {
  return dispatch => {
    const payload = {
      username: username,
      password: password
    };

    const authenticateURL = URL + "users/authenticate";
    axios(authenticateURL, {
      method: "post",
      data: payload,
      withCredentials: true
    })
      .then(res => {
        if (res.status === 200) {
       
          dispatch(authenticateUser());
          dispatch(updateUser(res.data.username));
        } else {
          alert("username password do not match");
        }
      })
      .catch(err => {
        console.log(err);
        if (err.response) {
          if (err.response.status === 401) {
            alert("username password do not match");
          } else if (err.response.status === 400) {
            console.log("please enter necassary fields");
            alert("Please fill the necassary fields");
          }
        } else {
          alert("Make sure the server is running");
        }
      });
  };
}

export function logoutUserPOST(){
  return dispatch=>{
  const logoutURL = URL + "users/logout";
  axios(logoutURL, {
    method: "post",
    withCredentials: true
  })
    .then(res => {
      if (res.status === 200) {
        dispatch(logoutUser());
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
}
