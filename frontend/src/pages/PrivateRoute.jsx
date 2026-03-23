import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const PrivateRoute = () => {

    const { userInfo } = useSelector((state) => state.userAuth);



    return userInfo ? <Outlet /> : <Navigate to='/signin' replace />;
};

export default PrivateRoute;