"use client";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useState } from "react";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config"; 

const { Title } = Typography;

const SignIn = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false); 

  const handleSignIn = async (values) => {
    const { email, password } = values;
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      const user = userCredential.user; 

      if (user) {
        setIsRedirecting(true); 

        const userId = user.uid;
        const userDocRef = doc(db, "users", userId);

      
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
         
          await setDoc(userDocRef, {
            email: email,
            name: user.displayName || "User",
            createdAt: new Date(),
          });
        }

       
        sessionStorage.setItem("user", userId);
        sessionStorage.setItem("userName", user.displayName || "User");

        
        router.push("/createRetro");
      }
    } catch (e) {
      console.error("Sign in error:", e);
    } finally {
      setIsRedirecting(false); 
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#001529",
      }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Sign In
        </Title>
        {loading || isRedirecting ? ( 
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form name="signIn" onFinish={handleSignIn} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid email!",
                },
              ]}>
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}>
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#E8602D",
                  color: "white",
                }}
                loading={loading} 
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        )}
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </Card>
    </div>
  );
};

export default SignIn;