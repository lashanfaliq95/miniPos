import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';

axios.interceptors.response.use(response=>{
   
    return response;
}, error=>{
    if(error.status=== 401 && error.body.data.redirect)
    {        
        console.log('redirect')     
        return <Redirect to='/somewhere'/>;
    }
   
        
    }
   
);