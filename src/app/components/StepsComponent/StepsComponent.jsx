import React from "react";
import { Steps, Button, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/css/main.css"

const StepsComponent = ({ currentStep, onNext, onPrev }) => {
  return (
    <Row
      align="middle"
      justify="center"
      gutter={16}
      style={{ marginBottom: 16 }}>
      <Col>
        <Button
          type="text"
          onClick={onPrev}
          disabled={currentStep === 0}
          icon={<FontAwesomeIcon icon={faChevronLeft} />}
        />
      </Col>
      <Col flex="auto">
        <Steps current={currentStep} direction="horizontal" responsive={true}>
          <Steps.Step title="Think" />
          <Steps.Step title="Vote" />
          <Steps.Step title="Discuss" />
          <Steps.Step title="Action Plans" />
          <Steps.Step title="Finish Retro" />
        </Steps>
      </Col>
      <Col>
        <Button
          type="text"
          onClick={onNext}
          disabled={currentStep === 4}
          icon={<FontAwesomeIcon icon={faChevronRight} />}
        />
      </Col>
    </Row>
  );
};

export default StepsComponent;
