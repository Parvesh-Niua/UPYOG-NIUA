import { Banner, Card, CardText, LinkButton, LinkLabel, Loader, Row, StatusTable, SubmitBar, Toast } from "@upyog/digit-ui-react-components";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import getEwAcknowledgementData from "../../../utils/getEwAcknowledgementData";
import { EWDataConvert } from "../../../utils";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("ES_EWASTE_RESPONSE_CREATE_ACTION") : t("CS_EWASTE_UPDATE_APPLICATION_SUCCESS");
  } else if (props.isLoading) {
    return !window.location.href.includes("edit-application") ? t("CS_EWASTE_APPLICATION_PENDING") : t("CS_EWASTE_UPDATE_APPLICATION_PENDING");
  } else if (!props.isSuccess) {
    return !window.location.href.includes("edit-application") ? t("CS_EWASTE_APPLICATION_FAILED") : t("CS_EWASTE_UPDATE_APPLICATION_FAILED");
  }
};

const rowContainerStyle = {
  padding: "4px 0px",
  justifyContent: "space-between",
};

const BannerPicker = (props) => {
  
  return (
    <Banner
      message={GetActionMessage(props)}
      applicationNumber={props.data?.EwasteApplication[0].requestId}
      info={props.isSuccess ? props.t("EWASTE_APPLICATION_NO") : ""}
      successful={props.isSuccess}
      style={{width: "100%"}}
    />
  );
};


const EWASTEAcknowledgement = ({ data, onSuccess }) => {
  
  const { t } = useTranslation();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const tenantId = Digit.ULBService.getCitizenCurrentTenant(true) || Digit.ULBService.getCurrentTenantId();
  const mutation = Digit.Hooks.ew.useEWCreateAPI(data?.address?.city?.code); 
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};

  const handleSuccess = useCallback((response) => {
    setHasSubmitted(true);
    if (onSuccess) {
      onSuccess(response);
    }
  }, [onSuccess]);

  const [errorToast, setErrorToast] = useState(null);

  const handleError = useCallback((error) => {
    console.error('EW Create API Error:', error);
    setHasSubmitted(true);
    setErrorToast(error?.response?.data?.Errors?.[0]?.message || t("CS_EWASTE_APPLICATION_FAILED"));
  }, [t]);

  useEffect(() => {
    if (!hasSubmitted && data) {
      try {
        const formData = { ...data, tenantId };
        const convertedData = EWDataConvert(formData);
        
        mutation.mutate(convertedData, {
          onSuccess: handleSuccess,
          onError: handleError
        });
      } catch (err) {
        console.error('EW Data Conversion Error:', err);
        setHasSubmitted(true);
      }
    }
  }, [data ,hasSubmitted]);


  const handleDownloadPdf = async () => {
    const { EwasteApplication = [] } = mutation.data || {};
    let EW = (EwasteApplication && EwasteApplication[0]) || {};
    const tenantInfo = tenants.find((tenant) => tenant.code === EW.tenantId);
    let tenantId = EW.tenantId || tenantId;
   
    const data = await getEwAcknowledgementData({ ...EW }, tenantInfo, t);
    Digit.Utils.pdf.generateTable(data);
  };

  const isLoading = mutation.isPending || (!hasSubmitted && data);
  const isSuccess = mutation.isSuccess && hasSubmitted;

  return isLoading ? (
    <Loader />
  ) : 
  (
    <Card>
      <BannerPicker t={t} data={mutation.data} isSuccess={isSuccess} isLoading={isLoading} />
      <StatusTable>
        {isSuccess && (
          <Row
            rowContainerStyle={rowContainerStyle}
            last       
            textStyle={{ whiteSpace: "pre", width: "60%" }}
          />
        )}
      </StatusTable>
      {isSuccess && <SubmitBar label={t("EWASTE_DOWNLOAD_ACK_FORM")} onSubmit={handleDownloadPdf} />}
      {errorToast && <Toast error label={errorToast} onClose={() => setErrorToast(null)} />}
      <Link to={`/upyog-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default EWASTEAcknowledgement;