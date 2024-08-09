import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getUserData } from "@/services/fireStoreService";

const { Header } = Layout;

const Navbar = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = sessionStorage.getItem("user");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const userData = await getUserData(userId);
          setUserName(userData.displayName || "");
          setIsAdmin(userData.isAdmin || false);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSignOut = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userSurname");
    router.push("/");
  };

  const displayName = userId
    ? `${userName} ${isAdmin ? "Welcome!" : "Welcome!"}`
    : "RetroSpark";

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#001529",
        padding: "0 20px",
      }}>
      <Menu theme="dark" mode="horizontal" style={{ flex: 1 }}>
        <Menu.Item key="1" icon={<UserOutlined />}>
          {displayName}
        </Menu.Item>
        {userId && (
          <Menu.Item key="2" icon={<LogoutOutlined />} onClick={handleSignOut}>
            Sign Out
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default Navbar;
