import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function SellerPrivateRoute() {
    const { sellerInfo } = useSelector((state) => state.sellerAuth);



    return sellerInfo ? <Outlet /> : <Navigate to='/seller/signin' replace />;
}

export default SellerPrivateRoute