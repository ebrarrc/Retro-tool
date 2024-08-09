import { Modal, Button, Form, Input, List } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  addActionPlanItem,
  setActionItems,
  setStatus,
  setError,
} from "../../redux/slice/actionPlanModalSlice";
import {
  getActionItemsFromFirestore,
  addActionItemToFirestore,
} from "@/services/fireStoreService";

const ActionPlanModal = ({ visible, onClose, roomId }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const actionItems = useSelector((state) => state.actionPlanModal.actionItems);
  const status = useSelector((state) => state.actionPlanModal.status);
  const error = useSelector((state) => state.actionPlanModal.error);

  useEffect(() => {
    if (roomId) {
      dispatch(setStatus("loading"));
      getActionItemsFromFirestore(roomId)
        .then((items) => {
          dispatch(setActionItems(items));
          dispatch(setStatus("succeeded"));
        })
        .catch((error) => {
          dispatch(setError(error.message));
          dispatch(setStatus("failed"));
        });
    }
  }, [roomId, dispatch]);

  const handleSubmit = (values) => {
    const newItem = {
      ...values,
      id: Math.random().toString(36).substr(2, 9),
    };
    dispatch(setStatus("loading"));
    addActionItemToFirestore(roomId, newItem)
      .then(() => {
        dispatch(addActionPlanItem(newItem));
        form.resetFields();
        dispatch(setStatus("succeeded"));
      })
      .catch((error) => {
        dispatch(setError(error.message));
        dispatch(setStatus("failed"));
      });
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}>
      
      <Form form={form} onFinish={handleSubmit}>
        <h2 style={{fontSize: "30px", fontWeight: "bold"}}>Action Plan</h2>
        <Form.Item
          name="action"
          label="Action"
          rules={[{ required: true, message: "Please input an action!" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="owner"
          label="Owner"
          rules={[{ required: true, message: "Please input an owner!" }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Due Date"
          rules={[{ required: true, message: "Please input a due date!" }]}>
          <Input type="date" />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ backgroundColor: "#543AAA", color: "#fff" }}
            htmlType="submit"
            loading={status === "loading"}>
            Add Action Item
          </Button>
        </Form.Item>
      </Form>

      <List
        header={<div>Action Items</div>}
        bordered
        dataSource={actionItems}
        renderItem={(item) => (
          <List.Item style={{ paddingBottom: "20px" }}>
            <strong style={{ color: "#543AAA" }}>Action:</strong> {item.action}{" "}
            <br />
            <strong style={{ color: "#543AAA" }}>Owner:</strong> {item.owner}{" "}
            <br />
            <strong style={{ color: "#543AAA" }}>Due Date:</strong>{" "}
            {item.dueDate}
          </List.Item>
        )}
      />
      {status === "failed" && (
        <div style={{ color: "red" }}>Error: {error}</div>
      )}
    </Modal>
  );
};

export default ActionPlanModal;
