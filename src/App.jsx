import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Login from './auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} /> {/* Default route under Layout */}
          <Route path="login" element={<Login />} /> {/* /login route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
