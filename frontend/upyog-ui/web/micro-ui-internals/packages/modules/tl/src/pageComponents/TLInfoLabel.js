import React, { useState } from "react";
import { TypeSelectCard } from "@nudmcdgnpm/upyog-ui-react-components-lts";
import { FormStep, RadioOrSelect, RadioButtons, CitizenInfoLabel } from "@nudmcdgnpm/upyog-ui-react-components-lts";

const TLInfoLabel = ({ t, config, onSelect, userType, formData }) => {
  return (
    <React.Fragment>
      <div style={{width:"80%"}}>
        <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t("TL_EDIT_INFO_CARD_INFORMATION_DETAILS_LABEL")} />
      </div>
    </React.Fragment>
  );
};

export default TLInfoLabel;
