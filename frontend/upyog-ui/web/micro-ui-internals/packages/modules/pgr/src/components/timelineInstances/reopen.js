import { GreyOutText } from "@nudmcdgnpm/upyog-ui-react-components-lts";
import React from "react";
const Reopen = ({ text, reopenDate }) => {
  // let { t } = useTranslation();
  // let reopenDate = ConvertTimestampToDate(obj.auditDetails.createdTime);
  return (
    <React.Fragment>
      {text}
      <p>{reopenDate}</p>
    </React.Fragment>
  );
};

export default Reopen;
