"use client";
import React, { useState } from "react";
import { Layout, Menu, Button, Row, Col, Typography, Spin } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import Lottie from "react-lottie-player";
import animationData from "../assets/Lottie/animation.json";
import TypingEffect from "react-typing-effect";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigation = (path) => {
    setLoading(true);
    setTimeout(() => {
      router.push(path);
      setLoading(false);
    }, 300); 
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div
          className="logo"
          style={{ color: "white", fontSize: "40px", fontWeight: "bold" }}>
          RetroSpark
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: 1, justifyContent: "flex-end", fontSize: "20px" }}>
          <Menu.Item
            key="1"
            icon={<UserOutlined style={{ fontSize: "20px" }} />}
            onClick={() => handleNavigation("/sign-in")}>
            Sign In
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<UserAddOutlined style={{ fontSize: "20px" }} />}
            onClick={() => handleNavigation("/sign-up")}>
            Sign Up
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "50px", textAlign: "center" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}>
            <Spin size="large" />
          </div>
        ) : (
          <Row
            gutter={[16, 32]}
            justify="center"
            align="middle"
            style={{ minHeight: "80vh" }}>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              style={{ textAlign: "left", paddingLeft: "20px" }}>
              <Title
                level={1}
                style={{ fontSize: "45px", marginBottom: "20px" }}>
                <TypingEffect
                  text={["Welcome to RetroSpark"]}
                  speed={100}
                  eraseDelay={1500}
                  displayTextRenderer={(text) => <span>{text}</span>}
                />
              </Title>
              <Text
                style={{
                  fontSize: "24px",
                  display: "block",
                  marginBottom: "20px",
                }}>
                Advertise your retrospectives with ease and collaborate with
                your team effectively.
              </Text>
              <div style={{ marginBottom: "20px" }}>
                <Button
                  style={{
                    backgroundColor: "#543aaa",
                    color: "white",
                    padding: "30px 50px",
                    fontSize: "28px",
                  }}
                  size="large"
                  onClick={() => handleNavigation("/sign-up")}>
                  Get Started
                </Button>
              </div>
              <div>
                <Text style={{ fontSize: "20px" }}>
                  If you have an account,{" "}
                </Text>
                <Button
                  type="link"
                  onClick={() => handleNavigation("/sign-in")}
                  style={{ fontSize: "20px" }}>
                  Sign In
                </Button>
              </div>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={12}
              style={{ display: "flex", justifyContent: "center" }}>
              <Lottie
                loop
                animationData={animationData}
                play
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  borderRadius: "8px",
                }}
              />
            </Col>
          </Row>
        )}
      </Content>
      <Footer
        style={{
          backgroundColor: "#001529",
          color: "white",
          textAlign: "center",
          fontSize: "20px",
        }}>
        Created By Ezgi , Buğra , Ebrar
      </Footer>
    </Layout>
  );
};

export default HomePage;
