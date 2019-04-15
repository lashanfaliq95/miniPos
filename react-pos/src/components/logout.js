import React from 'react';
import Axios from 'axios';
import { withRouter } from "react-router-dom";


function Logout() {
    Axios('http://localhost:3000/users/logout',{
        method: "post",
        withCredentials: true
      })
    .then(res => {
        
        if (res.status === 200) {
            this.props.history.push("/login");
        }
       
    })
    .catch(err => {
        console.log(err);
    })
}

// Wrap component using the `pure` HOC from recompose
export default withRouter(Logout);