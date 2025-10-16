
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./auth/Login";
import EnquiryPage from "./pages/enquiryPage/EnquiryPage";
import ProductPage from './Pages/ProductPage/ProductPage';
import BlogPage from "./pages/blogPage/BlogPage";
import BlogForm from "./pages/blogPage/BlogForm";
import Categories from "./pages/CategoryPage/CategoryPage";

function App() {
  return (
    <Routes>
      {/* <Route index element={<Login />} />  Default route under Layout */}
      <Route path="login" element={<Login />} /> {/* /login route */}
      <Route path="/" element={<Layout />}>
        <Route path="enquiry" element={<EnquiryPage />} />
        <Route path='products' element={<ProductPage />} />
        <Route path='categories' element={<Categories/>} />
        <Route path='blogs' element={<BlogPage />} />
        <Route path='blogPageForm' element={<BlogForm/>} />
          <Route path='blogPageForm/:blogId' element={<BlogForm />} />
      </Route>
    </Routes>
  );
}

export default App;
