import { createSlice } from "@reduxjs/toolkit";

export const sortCardsByVotes = (cards) => {
  return cards.slice().sort((a, b) => b.votes - a.votes);
};

const boardSlice = createSlice({
  name: "board",
  initialState: {
    currentStep: 0,
    columns: [
      {
        id: "1",
        title: "Sunny",
        description: "It's going well...",
        icon: "sunny",
        backgroundColor: "#d2e4cc",
        cards: [],
      },
      {
        id: "2",
        title: "Thunderstorm",
        description: "Things that slow down the team...",
        icon: "thunderstorm",
        backgroundColor: "#fcefdf",
        cards: [],
      },
      {
        id: "3",
        title: "Rainbow",
        description: "Things that will move the team forward...",
        icon: "rainbow",
        backgroundColor: "#ecf9ff",
        cards: [],
      },
      {
        id: "4",
        title: "Cloudy",
        description: "If you have unclear questions in your mind...",
        icon: "cloudy",
        backgroundColor: "#f6ebe9",
        cards: [],
      },
    ],
    loading: false,
    error: null,
  },
  reducers: {
    addCard: (state, action) => {
      const { card, columnId } = action.payload;
      const column = state.columns.find((column) => column.id === columnId);
      if (column) {
        column.cards.push(card);
      }
    },
    updateCard: (state, action) => {
      const { cardId, columnId, updates } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      const card = column?.cards.find((c) => c.id === cardId);
      if (card) {
        Object.assign(card, updates);
      }
    },
    removeCard: (state, action) => {
      const { roomId, columnId, cardId } = action.payload;

      if (!state[roomId] || !state[roomId].columns) return;

      const column = state[roomId].columns.find((col) => col.id === columnId);
      if (!column) return;

      column.cards = column.cards.filter((card) => card.id !== cardId);
    },
    voteCard: (state, action) => {
      const { cardId, columnId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      const card = column?.cards.find((c) => c.id === cardId);
      if (card) {
        card.votes += 1;
      }
    },
    sortCards: (state, action) => {
      const { columnId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        column.cards = sortCardsByVotes(column.cards);
      }
    },
    setCards: (state, action) => {
      const { columnId, cards } = action.payload;
      const column = state.columns.find((column) => column.id === columnId);
      if (column) {
        column.cards = cards;
      }
    },
    updateStep(state, action) {
      state.currentStep = action.payload;
    },
  },
});

export const { addCard, updateCard, removeCard, voteCard, sortCards, setCards,updateStep } = boardSlice.actions;
export default boardSlice.reducer;
