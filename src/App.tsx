import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import VerifyUser from "./pages/VerifyUser";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Message from "./pages/Message";
import AdminDashboard from "./Dashboard/AdminDashboard/AdminDashboard";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <main className="w-full grow">
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/verify' element={<VerifyUser/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/messages' element={<Message />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App;