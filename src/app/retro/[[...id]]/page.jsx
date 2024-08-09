"use client";
import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Row, Col } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Column from "@/app/components/Column/Column";
import StepsComponent from "@/app/components/StepsComponent/StepsComponent";
import ActionPlanModal from "@/app/components/ActionPlanModal/ActionPlanModal";
import FinishRetroModal from "@/app/components/FinishRetroModal/FinishRetroModal";
import {
  addCard,
  updateCard,
  removeCard,
  voteCard,
  sortCards,
} from "../../redux/slice/boardSlice";
import {
  showActionPlanModal,
  hideActionPlanModal,
} from "../../redux/slice/actionPlanModalSlice";
import {
  showFinishRetroModal,
  hideFinishRetroModal,
} from "../../redux/slice/finishRetroModalSlice";
import { UserOutlined } from "@ant-design/icons";
import socket from "../../utils/socket";
import Navbar from "@/app/components/Navbar/Navbar";
import CustomFooter from "@/app/components/Footer/Footer";
import UserInfoModal from "@/app/components/UserInfoModal/UserInfoModal";
import {
  updateUserData,
  addGuestData,
  fetchCardsFromFirestore,
} from "@/services/fireStoreService";
import { doc, getDoc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useParams } from "next/navigation";

const { Content, Sider } = Layout;

const RetroPage = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.board.columns);
  const isActionPlanModalVisible = useSelector(
    (state) => state.actionPlanModal.isVisible
  );
  const isFinishRetroModalVisible = useSelector(
    (state) => state.finishRetroModal.isVisible
  );
  const [current, setCurrent] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [guestNames, setGuestNames] = useState([]);
  const params = useParams();
  const id = params.id;
  const roomId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    socket.on("newCard", (data) => {
      dispatch(addCard(data));
    });

    socket.on("updateCard", (data) => {
      dispatch(updateCard(data));
    });

    socket.on("voteCard", (data) => {
      dispatch(voteCard(data));
    });

    socket.on("removeCard", (data) => {
      dispatch(removeCard(data));
    });

    socket.on("updateStep", (step) => {
      setCurrent(step);
      if (step === 2) {
        columns.forEach((column) => {
          dispatch(sortCards({ columnId: column.id }));
        });
      }
      if (step === 3) {

        dispatch(showActionPlanModal());
      }
      if (step === 4) {
        handleActionPlanModalClose();
        dispatch(showFinishRetroModal());
      }
    });

    socket.on("updateActionPlan", (data) => {
      dispatch(updateActionPlan(data));
    });

    socket.on("guestAdded", (guest) => {
      setGuestNames((prevGuests) => [...prevGuests, guest]);
    });

    return () => {
      socket.off("newCard");
      socket.off("updateCard");
      socket.off("voteCard");
      socket.off("removeCard");
      socket.off("updateStep");
      socket.off("guestAdded");
      socket.off("updateActionPlan");
    };
  }, [dispatch, columns]);

  useEffect(() => {
    if (!roomId) {
      console.error("Invalid room id:", roomId);
      return;
    }

    const fetchCards = async () => {
      try {
        const fetchedCards = await fetchCardsFromFirestore({ roomId });
        const sortedCards = sortCardsByVotes(fetchedCards);
        dispatch(sortCards({ columnId: "all", cards: sortedCards }));
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();

    const guestRef = collection(db, "rooms", roomId, "guests");
    const unsubscribe = onSnapshot(
      guestRef,
      (snapshot) => {
        const names = snapshot.docs.map((doc) => {
          const data = doc.data();
          return `${data.firstName} ${data.lastName}`;
        });
        setGuestNames(names);
      },
      (error) => {
        console.error("Error fetching guests:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomId, dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem("user");
      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (!userData.firstName || !userData.lastName) {
            setIsModalVisible(true);
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
          } else {
            setUserFullName(`${userData.firstName} ${userData.lastName}`);
          }
        } else {
          setIsModalVisible(true);
        }
      } else {
        setIsModalVisible(true);
      }
    };

    fetchUserData();
  }, []);

  const handleModalOk = async () => {
    try {
      const fullName = `${firstName} ${lastName}`;
      const roomId = Array.isArray(id) ? id[0] : id;

      await addGuestData({ firstName, lastName, roomId });

      sessionStorage.setItem("userName", firstName);
      sessionStorage.setItem("userSurname", lastName);

      setUserFullName(fullName);

      socket.emit("guestAdded", fullName);

      setIsModalVisible(false);
    } catch (error) {
      console.error("Error handling modal OK: ", error);
    }
  };

  const handleActionPlanModalClose = () => {
    dispatch(hideActionPlanModal());
  };

  const handleFinishRetroModalClose = () => {
    dispatch(hideFinishRetroModal());
  };

  const handleNextStep = () => {
    if (current < 4) {
      setCurrent(current + 1);
      socket.emit("updateStep", current + 1);
    }
  };

  const handlePrevStep = () => {
    if (current > 0) {
      setCurrent(current - 1);
      socket.emit("updateStep", current - 1);
    }
  };

  return (
    <Layout>
      <Navbar />
      <Layout>
        <Sider
          width={200}
          style={{ background: "#fff" }}
          breakpoint="lg"
          collapsedWidth="0">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%", borderRight: 0 }}>
            {guestNames.length > 0 ? (
              guestNames.map((guest, index) => (
                <Menu.Item key={index} icon={<UserOutlined />}>
                  {guest}
                </Menu.Item>
              ))
            ) : (
              <Menu.Item key="1" icon={<UserOutlined />}>
                No guests yet
              </Menu.Item>
            )}
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Retro</Breadcrumb.Item>
            <Breadcrumb.Item>{Array.isArray(id) ? id[0] : id}</Breadcrumb.Item>
          </Breadcrumb>
          <StepsComponent
            currentStep={current}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "#fff",
            }}>
            <Row gutter={[16, 16]}>
              {columns.map((column) => (
                <Col key={column.id} xs={24} sm={12} md={12} lg={6}>
                  <Column
                    column={column}
                    currentStep={current}
                    roomId={roomId}
                  />
                </Col>
              ))}
            </Row>
          </Content>
        </Layout>
      </Layout>
      <CustomFooter />
      <UserInfoModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onOk={handleModalOk}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
      />
      <ActionPlanModal
        visible={isActionPlanModalVisible}
        onClose={handleActionPlanModalClose}
        roomId={roomId}
      />
      <FinishRetroModal
        visible={isFinishRetroModalVisible}
        onClose={handleFinishRetroModalClose}
        roomId={roomId}
      />
    </Layout>
  );
};

export default RetroPage;
