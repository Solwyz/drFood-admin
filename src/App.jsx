import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./auth/Login";
import EnquiryPage from "./pages/enquiryPage/EnquiryPage";
import ProductPage from "./Pages/ProductPage/ProductPage";
import BlogPage from "./pages/blogPage/BlogPage";
import BlogForm from "./pages/blogPage/BlogForm";
import Categories from "./pages/CategoryPage/CategoryPage";
import Dashboard from "./Pages/dashBoard/dashBoard";
import OrderManagement from "./Pages/Order/Ordermanagement";
import AdsAndBanners from "./Pages/AdsAndBanner/AdsAndBanner";
import Recipe from "./Pages/RecipiePage/RecipePage";
import AddRecipe from "./Pages/RecipiePage/AddRecipe";
import UserManagement from "./Pages/UserManagement/UserManagement";
import UserDetails from "./Pages/UserManagement/UserDetails";
import SettingsPage from "./Pages/Settings/Settings";

function App() {
  return (
    <Routes>
      {/* <Route index element={<Login />} />  Default route under Layout */}
      <Route path="login" element={<Login />} /> {/* /login route */}
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="enquiry" element={<EnquiryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="adds-banners" element={<AdsAndBanners />} />
        <Route path="categories" element={<Categories />} />
        <Route path="blogs" element={<BlogPage />} />
        <Route path="blogPageForm" element={<BlogForm />} />
        <Route path="blogPageForm/:blogId" element={<BlogForm />} />
        <Route path="recipe" element={<Recipe />} />
        <Route path="settings" element={<SettingsPage/>} />
        <Route path="addRecipe" element={<AddRecipe />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:id" element={<UserDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
