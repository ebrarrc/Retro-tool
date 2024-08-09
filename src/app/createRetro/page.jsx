"use client";
import React, { useState, useEffect } from "react";
import { Button, Input, Layout, Typography, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import RoomModal from "../components/RoomModal/RoomModal";
import RoomList from "../components/RoomList/RoomList";
import DeletionModal from "../components/DeletionModal/DeletionModal";
import Navbar from "../components/Navbar/Navbar";
import CustomFooter from "../components/Footer/Footer";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import "@dotlottie/player-component/dist/dotlottie-player.js";

const { Content } = Layout;
const { Title } = Typography;

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRoomToDelete, setCurrentRoomToDelete] = useState(null);
  const [visibleCount, setVisibleCount] = useState(9);
  const [showMore, setShowMore] = useState(true);
  const router = useRouter();
  const colors = ["#D2E4CC", "#FCEFDF", "#F6EBE9", "#ECF9FF"];

  useEffect(() => {
    const fetchRooms = async () => {
      const userId = sessionStorage.getItem("user");
      if (userId) {
        const q = query(collection(db, "rooms"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    const results = rooms.filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRooms(results);
  }, [searchTerm, rooms]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleSave = async () => {
    if (roomName.trim() !== "") {
      const randomId = Math.random().toString(36).substr(2, 9);
      const userId = sessionStorage.getItem("user");
      const newRoom = {
        name: roomName,
        createdDate: new Date().toLocaleDateString("en-EN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        color: colors[rooms.length % colors.length],
        userId,
      };

      try {
        const roomRef = doc(collection(db, "rooms"), randomId);
        await setDoc(roomRef, newRoom);
        const updatedRooms = [...rooms, { id: randomId, ...newRoom }];
        setRooms(updatedRooms);
        setFilteredRooms(updatedRooms);
        setRoomName("");
        handleClose();
      } catch (error) {
        console.error("Error saving room: ", error.message);
      }
    } else {
      console.error("Room name cannot be empty");
    }
  };
  const showDeleteConfirm = (id) => {
    setCurrentRoomToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "rooms", currentRoomToDelete));
      const updatedRooms = rooms.filter(
        (room) => room.id !== currentRoomToDelete
      );
      setRooms(updatedRooms);
      setFilteredRooms(updatedRooms);
    } catch (error) {
      console.error("Error deleting room: ", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setCurrentRoomToDelete(null);
  };

  const handleShowMore = () => {
    setVisibleCount(visibleCount + 9);
    if (visibleCount + 9 >= filteredRooms.length) {
      setShowMore(false);
    }
  };

  const handleShowLess = () => {
    setVisibleCount(9);
    setShowMore(true);
  };

  const roomsToDisplay = filteredRooms.slice(0, visibleCount);

  return (
    <Layout>
      <Navbar />
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          minHeight: "100vh",
          position: "relative",
        }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1000px",
            marginTop: "20px",
            position: "relative",
          }}>
          <div style={{ width: "100%" }}>
            <Row gutter={[8, 8]} justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0 }}>
                  Your Retros
                </Title>
              </Col>
              <Col>
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <Button
                      type="primary"
                      onClick={handleShow}
                      style={{
                        backgroundColor: "#543AAA",
                        borderColor: "#543AAA",
                        width: "100%",
                      }}>
                      Create Retro
                    </Button>
                    <RoomModal
                      showModal={showModal}
                      handleClose={handleClose}
                      roomName={roomName}
                      setRoomName={setRoomName}
                      handleSave={handleSave}
                    />
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12}>
                    <Input
                      placeholder="Enter a Retro name to search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      prefix={<SearchOutlined />}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          {filteredRooms.length === 0 && searchTerm ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "5rem",
                fontSize: "18px",
                color: "#888",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
              }}>
              <dotlottie-player
                src="https://lottie.host/c80ceb0d-b974-407a-92f6-fee8aa59b745/T4c0RvIUb6.json"
                background="transparent"
                speed="1"
                style={{ width: "400px", height: "400px" }}
                loop
                autoplay></dotlottie-player>
              <p>You have not created a retro with this name yet.</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "5rem",
                fontSize: "18px",
                color: "#888",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh",
              }}>
              <dotlottie-player
                src="https://lottie.host/c80ceb0d-b974-407a-92f6-fee8aa59b745/T4c0RvIUb6.json"
                background="transparent"
                speed="1"
                style={{ width: "400px", height: "400px" }}
                loop
                autoplay></dotlottie-player>
              You don't have a retro that you've created yet. Create a retro
              now!
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <RoomList
                rooms={roomsToDisplay}
                colors={colors}
                showDeleteConfirm={showDeleteConfirm}
                router={router}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}>
                {filteredRooms.length > visibleCount && showMore && (
                  <Button
                    type="primary"
                    onClick={handleShowMore}
                    style={{
                      backgroundColor: "#543AAA",
                      borderColor: "#543AAA",
                    }}>
                    Show More
                  </Button>
                )}
                {visibleCount > 9 && (
                  <Button
                    type="primary"
                    onClick={handleShowLess}
                    style={{
                      backgroundColor: "#543AAA",
                      borderColor: "#543AAA",
                      marginLeft: "10px",
                    }}>
                    Show Less
                  </Button>
                )}
              </div>
            </div>
          )}
          <DeletionModal
            showDeleteModal={showDeleteModal}
            handleDeleteClose={handleDeleteClose}
            handleDelete={handleDelete}
          />
        </div>
      </Content>
      <CustomFooter />
    </Layout>
  );
};

export default Page;
