import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./components/Login";
import Messenger from "./components/Messenger";
import Register from "./components/Register";
import ProtectRoute from "./components/ProtectRoute";

function App() {
  return (
    <>
    
    <div>
      <Router>
        <Routes>
         
          <Route path="/messenger/register" element={<Register />}  />
          <Route path="/messenger/login" element={<Login />}  />
          <Route path="/" element={
          <ProtectRoute >
            <Messenger />
          </ProtectRoute>}  />
        </Routes>
      </Router>
    </div>
    </>
  );
}

export default App;
