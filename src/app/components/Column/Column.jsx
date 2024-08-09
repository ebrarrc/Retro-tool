import React, { useState, useEffect } from "react";
import { Card, Input, Button, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloudBolt,
  faRainbow,
  faSmog,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  addCardToFirestore,
  fetchCardsFromFirestore,
  removeCardFromFirestore,
  updateCardInFirestore,
} from "@/services/fireStoreService";
import CardComponent from "../Card/Card";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { useDispatch } from "react-redux";
import { sortCards } from "../../redux/slice/boardSlice";
import { sortCardsByVotes } from "@/services/fireStoreService";

const iconMap = {
  sunny: (
    <FontAwesomeIcon
      icon={faSun}
      style={{ color: "yellow", fontSize: "24px" }}
    />
  ),
  thunderstorm: (
    <FontAwesomeIcon
      icon={faCloudBolt}
      style={{ color: "gray", fontSize: "24px" }}
    />
  ),
  rainbow: (
    <FontAwesomeIcon
      icon={faRainbow}
      style={{ color: "blue", fontSize: "24px" }}
    />
  ),
  cloudy: (
    <FontAwesomeIcon
      icon={faSmog}
      style={{ color: "purple", fontSize: "24px" }}
    />
  ),
};

const Column = ({ column, currentStep, roomId }) => {
  const [text, setText] = useState("");
  const [cards, setCards] = useState([]);
  const dispatch = useDispatch();

  const fetchCards = async () => {
    try {
      const fetchedCards = await fetchCardsFromFirestore({
        roomId,
        columnId: column.id,
      });
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error fetching cards: ", error);
    }
  };

  useEffect(() => {
    const cardsRef = collection(
      db,
      "rooms",
      roomId,
      "columns",
      column.id,
      "cards"
    );

    const unsubscribe = onSnapshot(
      cardsRef,
      (snapshot) => {
        const updatedCards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedCards = sortCardsByVotes(updatedCards);
        setCards(sortedCards);
        dispatch(sortCards({ columnId: column.id, cards: sortedCards }));
      },
      (error) => {
        console.error("Error fetching real-time updates: ", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch, roomId, column.id]);

  const handleAddCard = async () => {
    try {
      if (!roomId || !column.id) {
        throw new Error("Invalid roomId, columnId");
      }

      await addCardToFirestore({
        roomId,
        columnId: column.id,
        cardText: text,
      });

      console.log("Card added successfully");
      setText(""); 


    } catch (error) {
      console.error("Error adding card: ", error);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      if (!roomId || !column.id || !cardId) {
        throw new Error("Invalid parameters provided.");
      }

      await removeCardFromFirestore({
        roomId,
        columnId: column.id,
        cardId,
      });

    } catch (error) {
      console.error("Error removing card: ", error);
    }
  };

  const handleUpdateCard = async (cardId, updates) => {
    try {
      if (!roomId || !column.id || !cardId || !updates) {
        throw new Error("Invalid parameters provided.");
      }

      await updateCardInFirestore({
        roomId,
        columnId: column.id,
        cardId,
        updates,
      });

    } catch (error) {
      console.error("Error updating card: ", error);
    }
  };

  return (
    <Card
      title={
        <div>
          <Row align="middle" gutter={16}>
            <Col>{iconMap[column.icon]}</Col>
            <Col
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                padding: "0 4px",
              }}>
              {column.title}
            </Col>
          </Row>
          <p style={{ marginBottom: "5px", color: "gray" }}>
            {column.description}
          </p>
        </div>
      }
      style={{
        backgroundColor: column.backgroundColor,
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
      {currentStep === 0 && (
        <Input.Group compact style={{ margin: "10px 0" }}>
          <Input
            style={{
              width: "calc(100% - 40px)",
              height: "40px",
              border: "1px solid #543aaa",
              fontSize: "15px",
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderRadius: "18px 0 0 18px",
            }}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            style={{
              backgroundColor: "#543aaa",
              color: "white",
              height: "40px",
              width: "40px",
            }}
            onClick={handleAddCard}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </Input.Group>
      )}
      <div className="column-cards" style={{ flexGrow: 1, overflowY: "auto" }}>
        {cards.length > 0 ? (
          cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              columnId={column.id}
              roomId={roomId}
              currentStep={currentStep}
              onDelete={() => handleDeleteCard(card.id)}
              onUpdate={(updates) => handleUpdateCard(card.id, updates)}
            />
          ))
        ) : (
          <p>You haven't written anything yet</p>
        )}
      </div>
    </Card>
  );
};

export default Column;
