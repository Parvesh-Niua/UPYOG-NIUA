import React from "react";
import {PaymentModule} from "@upyog/digit-ui-module-common";
import { StreetVendingUI } from "@upyog/digit-ui-module-core";
import { initLibraries } from "@nudmcdgnpm/digit-ui-libraries";
import { initBillsComponents } from "@upyog/digit-ui-module-bills";
import { initEngagementComponents } from "@upyog/digit-ui-module-engagement";
import { SVComponents, SVLinks, SVModule } from "@nudmcdgnpm/upyog-ui-module-sv";


initLibraries();

const enabledModules = [
  "Payment",
  "QuickPayLinks",
  "Engagement",
  "SV"
];
window.Digit.ComponentRegistryService.setupRegistry({
  PaymentModule,
  SVModule,
  SVLinks,
  ...SVComponents,
});


initBillsComponents();
initEngagementComponents();

const moduleReducers = (initData) => ({
  // pgr: PGRReducers(initData),
});


function App() {
  console.log("App component loaded");
  const stateCode =
    window.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") ||
    "pb"; // Default state code
  console.log("State code:", stateCode);
  if (!stateCode) {
    return <h1>stateCode is not defined</h1>;
  }
  return (
    <div>
      <h1>Loading StreetVendingUI...</h1>
      <StreetVendingUI
        stateCode={stateCode}
        enabledModules={enabledModules}
        moduleReducers={moduleReducers}
      />
    </div>
  );
}

export default App;
