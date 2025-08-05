import { useState } from "react";
import api from "../api";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async () => {
    const res = await api.post("/login", form);
    localStorage.setItem("token", res.data.access_token);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <input className="w-full mb-2 p-2 border rounded" placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-500 text-white w-full p-2 rounded" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
