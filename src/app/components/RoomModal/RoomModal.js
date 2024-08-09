import { Modal, Input, Button } from "antd";

const RoomModal = ({
  showModal,
  handleClose,
  roomName,
  setRoomName,
  handleSave,
}) => {
  return (
    <Modal
      title="Create Retro"
      visible={showModal}
      onCancel={handleClose}
      footer={[
        <Button
          key="back"
          onClick={handleClose}
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
          Close
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
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
          Create
        </Button>,
      ]}>
      <Input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Enter retro name"
      />
    </Modal>
  );
};

export default RoomModal;
