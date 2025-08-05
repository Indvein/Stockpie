import { useEffect, useState } from "react";
import api from "../api";
import Dashboard from "../components/Dashboard";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(res => setUser(res.data)).catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
  }, []);

  return user ? <Dashboard user={user} /> : <div>Loading...</div>;
}

export default Home;
