import React from "react";
import { CheckPoint } from "@nudmcdgnpm/upyog-ui-react-components-lts";

const PendingForAssignment = ({ isCompleted, text, complaintFiledDate, customChild }) => {
  return <CheckPoint isCompleted={isCompleted} label={text} customChild={customChild} />;
};

export default PendingForAssignment;
