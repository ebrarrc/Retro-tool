"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  removeCard,
  updateCard,
  voteCard,
  sortCards,
} from "../../redux/slice/boardSlice";
import socket from "../../utils/socket";
import {
  updateCardInFirestore,
  removeCardFromFirestore,
  voteCardInFirestore,
  sortCardsByVotes,
} from "@/services/fireStoreService";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../../firebase/config";

const { confirm } = Modal;

const CustomCard = ({ card, columnId, currentStep, roomId }) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newText, setNewText] = useState(card.text);
  const [votes, setVotes] = useState(card.votes || 0);

  useEffect(() => {
    const cardRef = doc(
      db,
      "rooms",
      roomId,
      "columns",
      columnId,
      "cards",
      card.id
    );

    const unsubscribe = onSnapshot(
      cardRef,
      (doc) => {
        if (doc.exists()) {
          const updatedCard = doc.data();
          setVotes(updatedCard.votes || 0); 
          setNewText(updatedCard.text || ""); 
        }
      },
      (error) => {
        console.error("Gerçek zamanlı güncelleme hatası: ", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomId, columnId, card.id]);

  const showModal = () => setIsModalVisible(true);

  const handleOk = async () => {
    try {
      await updateCardInFirestore({
        roomId,
        columnId,
        cardId: card.id,
        updates: { text: newText },
      });
      dispatch(
        updateCard({
          roomId,
          columnId,
          cardId: card.id,
          updates: { text: newText },
        })
      );
      socket.emit("updateCard", {
        columnId,
        cardId: card.id,
        updates: { text: newText },
      });
      toast.success("Card updated successfuly!");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Card update failed.: ", error);
      toast.error("Card update failed.");
    }
  };

  const handleCancel = () => setIsModalVisible(false);

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this card?",
      icon: (
        <FontAwesomeIcon
          icon={faTrash}
          style={{ color: "red", fontSize: "20px", marginRight: "10px" }}
        />
      ),
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await removeCardFromFirestore({
            roomId,
            columnId,
            cardId: card.id,
          });

          dispatch(removeCard({ roomId, columnId, cardId: card.id }));
          socket.emit("removeCard", { columnId, cardId: card.id });
          toast.error("Card deleted successfuly!");
        } catch (error) {
          console.error("Card delete failed.: ", error);
          toast.error("Card delete failed.");
        }
      },
    });
  };

const handleVote = async () => {
  try {
    await voteCardInFirestore({
      roomId,
      columnId,
      cardId: card.id,
    });

    socket.emit("voteCard", { roomId, columnId, cardId: card.id });
    toast.info("Vote saved successfuly!");
  } catch (error) {
    console.error("Vote save failed: ", error);
    toast.error("Vote save failed.");
  }
};


  return (
    <div
      style={{
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
        borderRadius: "8px",
        marginBottom: "10px",
        padding: "10px",
        position: "relative",
      }}>
      <Row justify="space-between" align="middle">
        <Col>
          <div
            style={{
              fontSize: "13px",
              color: "#333",
              padding: "0px",
              margin: "5px 0",
            }}>
            {newText}
          </div>
        </Col>
        <Col>
          {currentStep === 0 && (
            <Row gutter={16}>
              <Col>
                <Button
                  type="link"
                  icon={
                    <FontAwesomeIcon
                      icon={faEdit}
                      style={{ color: "orange", fontSize: "15px" }}
                    />
                  }
                  onClick={showModal}
                />
              </Col>
              <Col>
                <Button
                  type="link"
                  icon={
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "red", fontSize: "15px" }}
                    />
                  }
                  onClick={showDeleteConfirm}
                />
              </Col>
            </Row>
          )}
          {currentStep === 1 && (
            <>
              <Button
                type="text"
                icon={
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    style={{ color: "green", fontSize: "15px" }}
                  />
                }
                onClick={handleVote}
                style={{ marginLeft: "10px" }}
              />
              <span
                style={{ marginLeft: "5px", fontSize: "16px", color: "#333" }}>
                {votes}
              </span>
            </>
          )}
          {currentStep === 2 && (
            <>
              <Button
                type="text"
                icon={
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    style={{ color: "green", fontSize: "15px" }}
                  />
                }
                onClick={handleVote}
                style={{ marginLeft: "10px" }}
                disabled
              />
              <span
                style={{ marginLeft: "5px", fontSize: "16px", color: "#333" }}>
                {votes}
              </span>
            </>
          )}
        </Col>
      </Row>
      <Modal
        title="Edit Card"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Input value={newText} onChange={(e) => setNewText(e.target.value)} />
      </Modal>
    </div>
  );
};

export default CustomCard;
