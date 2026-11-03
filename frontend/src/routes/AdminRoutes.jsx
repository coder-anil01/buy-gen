import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/auth";

const AdminRoutes = () => {
  const apiDomain = import.meta.env.VITE_API_URL;
  const [auth] = useAuth();

  const [admin, setAdmin] = useState("loading");

  useEffect(() => {
    console.log(auth);
    const authCheck = async () => {
      if (!auth?.user?._id) {
        return;
      }

      try {
        const { data } = await axios.post(
          `${apiDomain}/api/v1/auth/admin-auth`,
          { id: auth.user._id },
        );

        if (data.success) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
      } catch (error) {
        console.log("Admin Auth Error:", error);
        setAdmin(false);
      }
    };

    authCheck();
  }, [auth?.user?._id, apiDomain]);

  // Loading
  if (admin === "loading") {
    return (
      <div
        className="user-routes"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "16px", color: "#555", fontWeight: "500" }}>
          Checking admin access...
        </p>
      </div>
    );
  }

  // Unauthorized
  if (!admin) {
    return <Navigate to="/register" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default AdminRoutes;
