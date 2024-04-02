import React, { useEffect, useState } from "react";
import PageLayout from "../components/UI/PageLayout";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
  useLocation,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, logout } from "../store/authSlice";
import Loader from "../components/UI/Loader";
import { isTokenValid } from "../utils/authUtils";

import { useScrollToTop } from "../hooks/common/useScrollToTop";
import ProductDetails from "../pages/shoping/product/ProductDetails";
import ProductReviews from "../pages/shoping/product/ProductReviews";
import ProductsCategory from "../pages/shoping/product/ProductsCategory";
import UpdatePasswordPage from "../pages/user/UpdatePasswordPage";
import LoginPage from "../pages/user/LoginPage";
import ForgetPasswordPage from "../pages/user/ForgetPasswordPage";
import ResetPasswordPage from "../pages/user/ResetPasswordPage";
import SingupPage from "../pages/user/SingupPage";
import LandingPage from "../pages/shoping/LandingPage";
import HomePage from "../pages/dashboard/HomePage";
import Products from "../pages/dashboard/Products";
import Orders from "../pages/dashboard/Orders";
import AdminRoute from "../components/routes/AdminRoute";
import PublicRoute from "../components/routes/PublicRoute";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import NotFoundPage from "../pages/NotFoundPage";
import Layout from "../components/dashboard/Layout";
import CartPage from "../pages/shoping/cart/CartPage";
import CheckOutPage from "../pages/shoping/cart/CheckOutPage";
import OrderSuccessPage from "../pages/shoping/cart/OrderSuccessPage";
import { useOrder } from "../contexts/OrderContext";
import MyOrdersPage from "../pages/user/MyOrdersPage";
import AddressPage from "../pages/user/AddressPage";
import ProfilePage from "../pages/user/ProfilePage";
import { useGetUserData } from "../hooks/auth/useGetUserData";
import { useUserData } from "../hooks/auth/useUserData";
import { useAuth } from "../hooks/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthInterceptor } from "../hooks/auth/useAuthInterceptor";
function ScrollToTopWrapper({ children }) {
  useScrollToTop(); // Call the custom hook inside a child component of Router
  return <>{children}</>;
}
function Main() {
  const isDarkMode = useSelector((state) => state.appSettings.isDarkMode);
  const { isLoading: isUserDataLoading } = useUserData(); // Use the isLoading state from useUserData
  const queryClient = useQueryClient();
  const [initialLoading, setInitialLoading] = useState(true);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      // queryClient.setQueryData(["auth"], authData);
      queryClient.invalidateQueries(["userData"]);
    }
    setInitialLoading(false);
  }, [queryClient]);

  if (isUserDataLoading || initialLoading) {
    return <Loader />; // Ensure Loader is a component that represents a loading spinner or similar indicator
  }
  return (
    <Router>
      <ScrollToTopWrapper>
        <Routes>
          <Route element={<PageLayout />}>
            <Route index path="/" element={<LandingPage />} />

            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route
              path="/product/review/:productId"
              element={<ProductReviews />}
            />
            <Route
              path="/category/:categoryName"
              element={<ProductsCategory />}
            />
            <Route
              path="/update-password"
              sensitive={false}
              element={
                <ProtectedRoute>
                  <UpdatePasswordPage />
                </ProtectedRoute>
              }
            />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckOutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <ProtectedRoute>
                  <AddressPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgetPasswordPage />
                </PublicRoute>
              }
            />
            <Route
              path="/reset/:token"
              element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SingupPage />
                </PublicRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            <Route element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<HomePage />} />

            <Route path="/admin/products" element={<Products />} />

            <Route path="/admin/orders" element={<Orders />} />

            {/* Add other routes as needed */}
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ScrollToTopWrapper>
    </Router>
  );
}

export default Main;
