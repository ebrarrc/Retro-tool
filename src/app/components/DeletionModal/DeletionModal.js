import React from "react";
import { Modal, Button } from "antd";

const DeletionModal = ({
  showDeleteModal,
  handleDeleteClose,
  handleDelete,
}) => {
  return (
    <Modal
      title="Deletion Confirmation"
      visible={showDeleteModal}
      onCancel={handleDeleteClose}
      footer={[
        <Button
          key="back"
          onClick={handleDeleteClose}
          style={{
            backgroundColor: "#fff",
            borderColor: "#543AAA",
            color: "#543AAA",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#543AAA";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
            e.currentTarget.style.color = "#543AAA";
          }}>
          No
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleDelete}
          style={{
            backgroundColor: "#543AAA",
            borderColor: "#543AAA",
            color: "#fff",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#543AAA";
            e.currentTarget.style.borderColor = "#543AAA";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#543AAA";
            e.currentTarget.style.borderColor = "#543AAA";
          }}>
          Yes
        </Button>,
      ]}>
      <p>Are you sure you want to delete?</p>
    </Modal>
  );
};

export default DeletionModal;
