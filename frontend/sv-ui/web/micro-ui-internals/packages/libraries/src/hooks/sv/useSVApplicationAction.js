import { useMutation } from "@tanstack/react-query";
import ApplicationUpdateActionsSV from "../../services/molecules/SV/ApplicationUpdateActionsSV";

/** The following function is used for the mutation function */

const useSVApplicationAction = (tenantId) => {
  
  return useMutation({
    mutationFn: (applicationData) => ApplicationUpdateActionsSV(applicationData, tenantId)
  });
};

export default useSVApplicationAction;
