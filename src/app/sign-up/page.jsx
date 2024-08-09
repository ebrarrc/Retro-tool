"use client";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { Form, Input, Button, Card, Typography } from "antd";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const { Title } = Typography;

const SignUp = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignUp = async (values) => {
    const { email, password, firstName, lastName } = values;
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      const user = res.user;

      if (user) {
        sessionStorage.setItem("user", user.uid);
        sessionStorage.setItem("userName", `${firstName} ${lastName}`);
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          firstName,
          lastName,
          email,
          isAdmin: false,
        });
        router.push("/createRetro");
      }
    } catch (e) {
      console.error("Sign up error:", e);
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
          Sign Up
        </Title>
        <Form name="signUp" onFinish={handleSignUp} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}>
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}>
            <Input placeholder="Last Name" />
          </Form.Item>
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
            <Button htmlType="submit" 
                style={{
                width: "100%",
                backgroundColor: "#E8602D",
                color: "white",
              }}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error.message}</p>}
      </Card>
    </div>
  );
};

export default SignUp;
