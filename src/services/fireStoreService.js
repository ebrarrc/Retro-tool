import { doc, getDoc,getDocs,addDoc, setDoc,deleteDoc, updateDoc,collection } from "firebase/firestore";
import { db } from "../firebase/config";
import { v4 as uuidv4 } from "uuid"; 


export const getUserData = async (userId) => {
  const userDoc = doc(db, "users", userId);
  const userSnap = await getDoc(userDoc);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error("User not found");
  }
};

export const updateUserData = async (userId, userData) => {
  try  {
    const userRef =  doc(db, "users", userId);
     updateDoc(userRef, userData);
    console.log("User data updated successfully.");
  } catch (error) {
    console.error("Error updating user data: ", error);
  };
};
export const addGuestData = async ({ firstName, lastName, roomId }) => {
  try {
    const guestId = uuidv4(); 
    await setDoc(doc(db, "rooms", roomId, "guests", guestId), {
      firstName,
      lastName,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error adding guest data: ", error);
  }
};
export const addCardToFirestore = async ({ roomId, columnId, cardText }) => {
  try {
    console.log("Adding card with:", { roomId, columnId, cardText });

    if (!roomId || !columnId || !cardText) {
      throw new Error("Invalid roomId, columnId, or cardText");
    }

    const cardId = uuidv4();
    const cardData = {
      id: cardId,
      text: cardText,
      votes: 0,
      createdAt: new Date(),
    };

    const cardRef = doc(
      db,
      "rooms",
      roomId,
      "columns",
      columnId,
      "cards",
      cardId
    );
    await setDoc(cardRef, cardData);
    return cardData; 
  } catch (error) {
    console.error("Error adding card: ", error);
    throw error;
  }
};

export const updateCardInFirestore = async ({
  roomId,
  columnId,
  cardId,
  updates,
}) => {
  try {
    const cardRef = doc(
      db,
      "rooms",
      roomId,
      "columns",
      columnId,
      "cards",
      cardId
    );
    await updateDoc(cardRef, updates);
  } catch (error) {
    console.error("Error updating card: ", error);
  }
};

export const removeCardFromFirestore = async ({ roomId, columnId, cardId }) => {
  try {
    if (!roomId || !columnId || !cardId) {
      throw new Error("Invalid parameters provided.");
    }

    const cardRef = doc(
      db,
      "rooms",
      roomId,
      "columns",
      columnId,
      "cards",
      cardId
    );
    await deleteDoc(cardRef);
    console.log("Card removed successfully");
  } catch (error) {
    console.error("Error removing card: ", error);
    throw error;
  }
};

export const fetchCardsFromFirestore = async ({ roomId, columnId }) => {
  if (!roomId || !columnId) {
    throw new Error("Invalid roomId or columnId");
  }

  try {
    console.log("Fetching from Firestore with:", { roomId, columnId });
    const cardsRef = collection(
      db,
      "rooms",
      roomId,
      "columns",
      columnId,
      "cards"
    );
    const cardsSnapshot = await getDocs(cardsRef);
    const cards = cardsSnapshot.docs.map((doc) => doc.data());
    return cards;
  } catch (error) {
    console.error("Error fetching cards: ", error);
    throw error;
  }
};

export const voteCardInFirestore = async ({ roomId, columnId, cardId }) => {
    
console.log("roomId:", roomId);
console.log("columnId:", columnId);
console.log("cardId:", cardId);


  if (!roomId || !columnId || !cardId) {
    throw new Error("Invalid roomId, columnId, or cardId");
  }

  try {
    const cardRef = doc(
      db,
      "rooms",
      roomId,
      "columns",
      columnId,
      "cards",
      cardId
    );
    const cardSnap = await getDoc(cardRef);
    if (cardSnap.exists()) {
      const cardData = cardSnap.data();
      await updateDoc(cardRef, { votes: (cardData.votes || 0) + 1 });
    } else {
      throw new Error("Card not found");
    }
  } catch (error) {
    console.error("Error voting card: ", error);
    throw error;
  }
};



export const sortCardsByVotes = (cards) => {

  const sortedCards = [...cards];
  

  sortedCards.sort((a, b) => b.votes - a.votes);

  return sortedCards;
};


export const fetchAndSortCards = async (roomId, columnId, dispatch) => {
  try {
    const cards = await fetchCardsFromFirestore({ roomId, columnId });
    const sortedCards = sortCardsByVotes(cards);
    dispatch(sortCards({ columnId, cards: sortedCards }));
  } catch (error) {
    console.error("Error fetching sorted cards: ", error);
    toast.error("Kartlar alınırken bir hata oluştu.");
  }
};
export const addActionItemToFirestore = async (roomId, item) => {
  try {
    const actionItemsRef = collection(db, `rooms/${roomId}/actionItems`);
    await addDoc(actionItemsRef, item);
    console.log("Action item added successfully");
  } catch (error) {
    console.error("Error adding action item: ", error);
    throw error;
  }
};

export const getActionItemsFromFirestore = async (roomId) => {
  try {
    const actionItemsRef = collection(db, `rooms/${roomId}/actionItems`);
    const snapshot = await getDocs(actionItemsRef);
    const actionItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return actionItems;
  } catch (error) {
    console.error("Error fetching action items: ", error);
    throw error;
  }
};
export const getCardsFromFirestore = async (roomId,columnId) => {
  try {
    const cardsRef = collection(
      db,
      `rooms/${roomId}/columns/${columnId}/cards`
    );
    const snapshot = await getDocs(cardsRef);
    const cards = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched cards from Firestore:", cards); 

    return cards;
  } catch (error) {
    console.error("Error fetching cards: ", error);
    throw error;
  }
};
