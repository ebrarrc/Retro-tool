import { faHourglass3 } from "@fortawesome/free-solid-svg-icons";
import { Modal, Input, Button } from "antd";

const UserInfoModal = ({
  visible,
  onClose,
  onOk,
  firstName,
  setFirstName,
  lastName,
  setLastName,
}) => (
  <Modal
    visible={visible}
    onCancel={onClose}
    footer={[
      <Button key="cancel" onClick={onClose}>
        Cancel
      </Button>,
      <Button key="save" style={{backgroundColor: "#543AAA", color: 'white'}} onClick={onOk}>
        Save
      </Button>
    ]}
  >
    <h2 style={{ marginBottom: "10px" }}>Enter your details</h2>
    <Input
      placeholder="First Name"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      style={{ marginBottom: "10px" }}
    />
    <Input
      placeholder="Last Name"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
    />
  </Modal>
);

export default UserInfoModal;
