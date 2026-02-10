 /* 
 * hook to structure the data of applicationDetails page for a single application
 * Uses the SVSearch page where the data is strtured and returned here
 */

import { useQuery } from "@tanstack/react-query";
import { SVSearch } from "../../services/molecules/SV/Search";

const useSVApplicationDetail = (t, tenantId, applicationNumber, isDraftApplication,config = {}, userType, args) => {
  
  const defaultSelect = (data) => {
     let applicationDetails = data.applicationDetails.map((obj) => {
      return obj;
    });
    
    return {
      applicationData : data,
      applicationDetails
    }
  };

  return useQuery(
    {
      queryKey: ["APPLICATION_SEARCH", "SV_SEARCH", applicationNumber,isDraftApplication, userType, args],
      queryFn: () => SVSearch.applicationDetails(t, tenantId, applicationNumber,isDraftApplication, userType, args),
      select: defaultSelect,
      ...config
    }
  );
};

export default useSVApplicationDetail;
