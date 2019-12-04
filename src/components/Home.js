import React from "react";
import { Button} from 'antd';
import {Link } from 'react-router-dom';
export default class Home extends React.Component{
    render (){
        const {role, email, address, name, getUser, logout} = this.props;
        if (localStorage.getItem("usertoken") === null) getUser();
        return (
            <div>
                <p>Name: {name}</p>
                <p>Email: {email}</p>
                <p>Role: {role}</p>
                <p>Address: {address}</p>
                
                <Button type="primary" onClick={logout}>Log out</Button>
                <Link to='../register'> <Button type="primary">registerAdmin</Button></Link>
            </div>
        )
    }
}