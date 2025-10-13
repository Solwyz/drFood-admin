import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './auth/Login';

function App() {
  return (
    <Routes>
      {/* <Route index element={<Login />} />  Default route under Layout */}
      <Route path="login" element={<Login />} />  {/* /login route */}
      <Route path="/" element={<Layout />}>

      </Route>
    </Routes>
  );
}

export default App;
