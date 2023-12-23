import Login from "./Pages/Login/Login";
import Signup from "./Pages/signup/Signup";
import Home from "./Pages/home/Home";
import { Routes, Route } from "react-router-dom";
import RequireUser from "./components/RequireUser";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<RequireUser />}>
          <Route path="/" element={<Home />}></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </div>
  );
}

export default App;
