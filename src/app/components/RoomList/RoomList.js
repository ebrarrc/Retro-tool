import React, { useState } from "react";
import { Card, Row, Col, Button, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const RoomList = ({ rooms, colors, showDeleteConfirm, router }) => {

  const [loadingRoom, setLoadingRoom] = useState(null);

  const handleJoinRetro = (roomId) => {
    setLoadingRoom(roomId);

    setTimeout(() => {
      router.push(`/retro/${roomId}`);
      setLoadingRoom(null); 
    }, 300); 
  };

  return (
    <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
      {rooms.map((room, index) => (
        <Col key={room.id} xs={24} sm={12} md={8}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {room.name}
                </span>
                <DeleteOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    showDeleteConfirm(room.id);
                  }}
                  style={{
                    color: "red",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                />
              </div>
            }
            bordered={false}
            style={{
              backgroundColor: colors[index % colors.length],
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
              <p>{room.date}</p>
              {loadingRoom === room.id ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}>
                  <Spin />
                </div>
              ) : (
                <Button
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoinRetro(room.id);
                  }}
                  style={{
                    backgroundColor: "#543AAA",
                    borderColor: "#543AAA",
                    marginTop: "auto",
                  }}>
                  Join Retro
                </Button>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default RoomList;
