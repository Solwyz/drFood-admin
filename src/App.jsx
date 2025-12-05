import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./auth/Login";
import EnquiryPage from "./pages/enquiryPage/EnquiryPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import BlogPage from "./pages/blogPage/BlogPage";
import BlogForm from "./pages/blogPage/BlogForm";
import Categories from "./pages/CategoryPage/CategoryPage";
import Dashboard from "./pages/dashBoard/dashBoard";
import OrderManagement from "./pages/Order/Ordermanagement";
import AdsAndBanners from "./pages/AdsAndBanner/AdsAndBanner";
import Recipe from "./pages/RecipiePage/RecipePage";
import AddRecipe from "./pages/RecipiePage/AddRecipe";
import UserManagement from "./pages/UserManagement/UserManagement";
import UserDetails from "./pages/UserManagement/UserDetails";
import SettingsPage from "./pages/Settings/Settings";
import RecipeCategory from "./pages/RecipeCategory/RecipeCategory";

function App() {
  return (
    <Routes>
      {/* <Route index element={<Login />} />  Default route under Layout */}
      <Route path="login" element={<Login />} /> {/* /login route */}
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="enquiry" element={<EnquiryPage />} />
        <Route path="products/:productId" element={<ProductPage />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="adds-banners" element={<AdsAndBanners />} />
        <Route path="categories" element={<Categories />} />
        <Route path="blogs" element={<BlogPage />} />
        <Route path="blogPageForm" element={<BlogForm />} />
        <Route path="blogPageForm/:blogId" element={<BlogForm />} />
        <Route path="recipe" element={<Recipe />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="recipe/:categoryId" element={<Recipe />} />
        <Route path="addRecipe" element={<AddRecipe />} />

        <Route path="users" element={<UserManagement />} />
        <Route path="users/:id" element={<UserDetails />} />
        <Route path="recipeCategory" element={<RecipeCategory />} />
      </Route>
    </Routes>
  );
}

export default App;
