import { useQuery } from "@tanstack/react-query";

const useSVDoc = (tenantId, moduleCode, type, config = {}) => {
    return useQuery({
        queryKey: ["SV_DOCUMENT_REQ_SCREEN"],
        queryFn: () => Digit.Hooks.useSelectedMDMS(moduleCode).getMasterData(tenantId, moduleCode, "Documents"),
        ...config
    });
};

export default useSVDoc;
