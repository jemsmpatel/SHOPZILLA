import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Layout from "./components/Layout";
import SLayout from "./components/SLayout";
import ProductDetails from "./pages/ProductDetails";
import PrivateRoute from "./pages/PrivateRoute";
import Profile from "./pages/Profile";
import SellerSignin from "./seller/SellerSignin";
import SellerDashboard from "./seller/SellerDashboard";
import SellerPrivateRoute from "./pages/SellerPrivateRoute";
import Temp from "./pages/temp";
import SellerSignup from "./seller/SellerSignup";
import Products from "./seller/Products";
import SellerProfile from "./seller/SellerProfile";
import EditSellerProfile from "./seller/EditSellerProfile";
import AddProduct from "./seller/AddProduct";
import ProductsDetailsPage from "./seller/ProductsDetailsPage";
import UpdateProduct from "./seller/UpdateProduct";
import ALayout from "./components/ALayout";
import ProductsPage from "./pages/ProductsPage";
import CategoryViewAll from "./pages/CategoryViewAll";
import AdminSignin from "./admin/AdminSignin";
import AdminPrivateRoute from "./pages/AdminPrivateRoute";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProfile from "./admin/AdminProfile";
import EditAdminProfile from "./admin/EditAdminProfile";
import AdminProducts from "./admin/AdminProducts";
import AdminUpdateProduct from "./admin/AdminUpdateProduct";
import AdminProductDetailsPage from "./admin/AdminProductDetailsPage";
import AdminAddProduct from "./admin/AdminAddProduct";
import AdminCategorys from "./admin/AdminCategorys";
import AddCategory from "./admin/AddCategory";
import EditCategory from "./admin/EditCategory";
import AdminUsers from "./admin/AdminUsers";
import AdminAdmins from "./admin/AdminAdmins";
import Cart from "./pages/Cart";
import CheckOutPage from "./pages/CheckOutPage";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import SellerOrdersPage from "./seller/SellerOrdersPage";
import UserReviews from "./pages/UserReviews";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import RejectedSellerUpdate from "./seller/RejectedSellerUpdate";
import SellerForgotPassword from "./seller/SellerForgotPassword";
import SellerResetPassword from "./seller/SellerResetPassword";
import SellerChangePassword from "./seller/SellerChangePassword";
import SellerSettings from "./seller/SellerSettings";
import AdminSettings from "./admin/AdminSettings";
import AdminChangePassword from "./admin/AdminChangePassword";
import AdminForgotPassword from "./admin/AdminForgotPassword";
import AdminResetPassword from "./admin/AdminResetPassword";
import SearchPage from "./pages/SearchPage";
import AdminSellers from "./admin/AdminSellers";
import AdminSellerDetail from "./admin/AdminSellerDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Home Page */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="signin" element={<Signin />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:id" element={<CategoryViewAll />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/reviews" element={<UserReviews />} />
          </Route>
        </Route>

        <Route path="/seller/signin" element={<SellerSignin />} />
        <Route path="/seller/signup" element={<SellerSignup />} />
        <Route path="/seller/retry/:token" element={<RejectedSellerUpdate />} />
        <Route
          path="/seller/forgot-password"
          element={<SellerForgotPassword />}
        />
        <Route
          path="/seller/reset-password/:token"
          element={<AdminResetPassword />}
        />
        <Route element={<SellerPrivateRoute />}>
          <Route element={<SLayout />}>
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<Products />} />
            <Route
              path="/seller/products/:id"
              element={<ProductsDetailsPage />}
            />
            <Route path="/seller/products/add" element={<AddProduct />} />
            <Route
              path="/seller/products/edit/:id"
              element={<UpdateProduct />}
            />
            <Route path="/seller/profile" element={<SellerProfile />} />
            <Route
              path="/seller/profile/edit"
              element={<EditSellerProfile />}
            />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/settings" element={<SellerSettings />} />
            <Route
              path="/seller/change-password"
              element={<SellerChangePassword />}
            />
          </Route>
        </Route>
        <Route path="/admin/signin" element={<AdminSignin />} />
        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPassword />}
        />
        <Route
          path="/admin/reset-password/:token"
          element={<AdminResetPassword />}
        />
        <Route element={<AdminPrivateRoute />}>
          <Route element={<ALayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/profile/edit" element={<EditAdminProfile />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/products/add" element={<AdminAddProduct />} />
            <Route
              path="/admin/products/edit/:id"
              element={<AdminUpdateProduct />}
            />
            <Route
              path="/admin/products/:id"
              element={<AdminProductDetailsPage />}
            />
            <Route path="/admin/category" element={<AdminCategorys />} />
            <Route path="/admin/category/add" element={<AddCategory />} />
            <Route path="/admin/category/edit/:id" element={<EditCategory />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/sellers" element={<AdminSellers />} />
            <Route path="/admin/seller/:id" element={<AdminSellerDetail />} />
            <Route path="/admin/admins" element={<AdminAdmins />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route
              path="/admin/settings/change-password"
              element={<AdminChangePassword />}
            />
          </Route>
        </Route>
        <Route path="temp" element={<Temp />} />

        {/* Product Details (Isme Reviews auto-include ho jayenge) */}
        {/* <Route path="/product/:id" element={<AdvancedProductPage />} /> */}

        {/* Admin Dashboard */}
        {/* <Route path="/admin/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/seller/seller_dashboard" element={<SellerDashboard />} />
        <Route path="/order/profile_order" element={<ProfileOrdersPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
