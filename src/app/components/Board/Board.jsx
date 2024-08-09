import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCard } from "../../redux/slice/boardSlice";
import Column from "../Column/Column";
import socket from "../../utils/socket";
import { Row, Col } from "antd";

const Board = () => {
  const columns = useSelector((state) => state.board.columns);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("newCard", (data) => {
      dispatch(addCard(data));
    });

    return () => {
      socket.off("newCard");
    };
  }, [dispatch]);

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[20, 20]}>
        {columns?.map((column) => (
          <Col key={column.id} span={8}>
            <Column column={column} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Board;
