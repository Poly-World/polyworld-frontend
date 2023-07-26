//packages
import { Route, Routes } from 'react-router-dom';
import './App.css';

//pages
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Main from './components/pages/Main';
import Three from './components/pages/Three';
import MapList from './components/pages/MapList';
import ThreeViewTest from './components/test/ThreeViewTest';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/three/:id" element={<Three />} />
      <Route path="/maplist" element={<MapList />} />
      {/* <Route path="/three/:id" element={<ThreeViewTest />} /> */}
    </Routes>
  );
}

export default App;
