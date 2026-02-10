
import React ,{Children, Fragment}from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Config } from "../../../config/config";
/**
 * Main Parent Component which is handling all the sub / Child components 
 * in this page it is taking config file to render all the componets one by one and also 
 * with the help of config this parent component knows which file have to render first.
 * 
 * It is saving all the filled data in session page by page and extracting it inside params and sending in every component
 * through formdata.
 * 
 * This page also handles the Routing of Check page and Acknowledgement page
 */
const SVCreate = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const stateId = Digit.ULBService.getStateId();
  let config = [];
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("SV_CREATES", {});

  const vendingApplicationNo=sessionStorage.getItem("vendingApplicationID")?sessionStorage.getItem("vendingApplicationID"):null;
  const { data: vendingApplicationData } = Digit.Hooks.sv.useSvSearchApplication(
    {
      tenantId:Digit.ULBService.getCitizenCurrentTenant(true),
      filters: { applicationNumber: vendingApplicationNo,isDraftApplication:false },
        enabled: vendingApplicationNo?true:false
    },
  );
  const vendingData=vendingApplicationData?.SVDetail?.[0]

  const { data: vendingDraftData } = Digit.Hooks.sv.useSvSearchApplication(
    {
      tenantId:Digit.ULBService.getCitizenCurrentTenant(true),
      filters: {isDraftApplication:true} ,
    },
  );

  const vending_draft_data=vendingDraftData?.SVDetail?.[0]
  // function used for traversing through form screens 
  const goNext = (skipStep, index, isAddMultiple, key) => {  
    let currentPath = pathname.split("/").pop(),
      lastchar = currentPath.charAt(currentPath.length - 1),
      isMultiple = false,
      nextPage;
    if (Number(parseInt(currentPath)) || currentPath == "0" || currentPath == "-1") {
      if (currentPath == "-1" || currentPath == "-2") {
        currentPath = pathname.slice(0, -3);
        currentPath = currentPath.split("/").pop();
        isMultiple = true;
      } else {
        currentPath = pathname.slice(0, -2);
        currentPath = currentPath.split("/").pop();
        isMultiple = true;
      }
    } else {
      isMultiple = false;
    }
    if (!isNaN(lastchar)) {
      isMultiple = true;
    }
    let { nextStep = {} } = config.find((routeObj) => routeObj.route === currentPath);


    const redirectWithHistory = (path) => {
      if (skipStep) {
        navigate(path, { replace: true });
      } else {
        navigate(path);
      }
    };
    
    if (isAddMultiple) {
      nextStep = key;
    }
    if (nextStep === null) {
      // OLD:return redirectWithHistory(`${match.path}/check`);
        return redirectWithHistory("check");
    }

    if (!isNaN(nextStep.split("/").pop())) {
      // OLD: nextPage = `${match.path}/${nextStep}`;
        nextPage = nextStep;

    }
     else {
      // OLD:nextPage = isMultiple && nextStep !== "map" ? `${match.path}/${nextStep}/${index}` : `${match.path}/${nextStep}`;
      nextPage = isMultiple && nextStep !== "map" ? `${nextStep}/${index}` : nextStep;
    }

    redirectWithHistory(nextPage);
  };

  // to clear formdata if the data is present before coming to first page of form
  if(params && Object.keys(params).length>0 && window.location.href.includes("/info") && sessionStorage.getItem("docReqScreenByBack") !== "true")
    {
      clearParams();
      queryClient.invalidateQueries("SV_CREATES");
    }

  const svcreate = async () => {
    // OLD: history.replace(`${match.path}/acknowledgement`);
      navigate("acknowledgement", { replace: true });
};

  function handleSelect(key, data, skipStep, index, isAddMultiple = false) {
    if (key === "owners") {
      let owners = params.owners || [];
      owners[index] = data;
      setParams({ ...params, ...{ [key]: [...owners] } });
    } else if (key === "units") {
      let units = params.units || [];
      // if(index){units[index] = data;}else{
      units = data;

      setParams({ ...params, units });
    } else {
      setParams({ ...params, ...{ [key]: { ...params[key], ...data } } });
    }
    goNext(skipStep, index, isAddMultiple, key);
  }

  const handleSkip = () => {};
  const handleMultiple = () => {};


  /**
   * this onSuccess dunction will execute once the application submitted successfully 
   * it will clear all the params from the session storage  and also invalidate the query client
   * as well as remove the beneficiary & disabilityStatus from the session storage
   */
  const onSuccess = () => {
    clearParams();
    queryClient.invalidateQueries("SV_CREATES");
    sessionStorage.removeItem("CategoryDocument");
    sessionStorage.removeItem("vendingApplicationID");
    sessionStorage.removeItem("ApplicationId");
    sessionStorage.removeItem("applicationStatus");
    sessionStorage.removeItem("Response");
    sessionStorage.removeItem("addressIdOne");
    sessionStorage.removeItem("addressIdTwo");
    sessionStorage.removeItem("vendorIds");
    sessionStorage.removeItem("bankIds");
    sessionStorage.removeItem("venId");
  };
  
  let commonFields = Config;
  commonFields.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });
  
  config.indexRoute = "info";

  const SVCheckPage = Digit?.ComponentRegistryService?.getComponent("CheckPage");
  const SVAcknowledgement = Digit?.ComponentRegistryService?.getComponent("SVAcknowledgement");

  
  
  return (
    <Routes>
      {config.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        const user = Digit.UserService.getUser().info.type;
        return (
          <Route 
            path={routeObj.route} 
            key={index}
            element={
              <Component 
                config={{ texts, inputs, key }} 
                onSelect={handleSelect} 
                onSkip={handleSkip} 
                t={t} 
                formData={params} 
                onAdd={handleMultiple} 
                userType={user} 
                editdata={pathname.includes("apply") ? {} : vendingData} 
                previousData={vending_draft_data} 
              />
            }
          />
        );
      })}

      {/***
       * @description -  Using an optional parameter to work in both cases:
       *                 if value of ispayment is present, it will take the value
       *                 if value is not present, will run without any errors.
       * 
       * @author - Khalid Rashid - NIUA
       */}
      <Route 
          path="check/:isPayment?" 
          element={
            <SVCheckPage 
              onSubmit={svcreate} 
              value={params} 
              editdata={pathname.includes("apply") ? {} : vendingData} 
              renewalData={pathname.includes("apply") ? {} : vendingData} 
            />
          }
      />
      <Route 
        path="acknowledgement" 
        element={
          <SVAcknowledgement data={params} onSuccess={onSuccess} />
        }
      />

      <Route 
        path="*" 
        element={<Navigate to={config.indexRoute} replace />} 
      />

    </Routes>
  );
};

export default SVCreate;
