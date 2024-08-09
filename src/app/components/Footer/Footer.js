import React from "react";
import { Layout, Typography } from "antd";

const { Footer } = Layout;
const { Text } = Typography;

const CustomFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "#001529",
        color: "white",
        textAlign: "center",
        fontSize: "20px",
        padding: "20px 0",
      }}>
      <Text style={{ color: "white" }}>Created By Ezgi, Buğra, Ebrar</Text>
    </Footer>
  );
};

export default CustomFooter;
