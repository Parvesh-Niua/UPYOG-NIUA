import React from "react";
import { AppContainer, EmployeeAppContainer } from "@nudmcdgnpm/upyog-ui-react-components-lts";

import Complaint from "./pages/employee/index";
const App = () => {
  return (
    <EmployeeAppContainer>
      <Complaint />
    </EmployeeAppContainer>
  );
};

export default App;
