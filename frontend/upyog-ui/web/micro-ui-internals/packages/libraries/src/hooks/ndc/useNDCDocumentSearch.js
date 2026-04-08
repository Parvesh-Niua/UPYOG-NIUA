import { useQuery, useQueryClient } from "react-query";

//useNDCDocumentSearch is a custom hook that fetches documents related to NDC applications.
const useNDCDocumentSearch = (data1 = {}, config = {}) => {
  const client = useQueryClient();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const tenant = Digit.ULBService.getStateId();

  let filesArray = [];
  if (data1?.value?.workflowDocs) filesArray = data1?.value?.workflowDocs?.map((ob) => ob?.uuid);

  const { isLoading, error, data } = useQuery([`ndcDocuments-${1}`, filesArray], () => Digit.UploadServices.Filefetch(filesArray, tenant));
  return { isLoading, error, data: { pdfFiles: data?.data }, revalidate: () => client.invalidateQueries([`ndcDocuments-${1}`, filesArray]) };
};

export default useNDCDocumentSearch;
