import { queryTemplate } from "../../common/queryTemplate";
import { PTSearch } from "../../services/molecules/PT/Search";

const useGenericViewProperty = (t, tenantId, propertyIds, config = {}, userType) => {
  const defaultSelect = (data) => {
    return { ...data };
  };

  return queryTemplate({
    queryKey: ["VIEW_GENERIC_PROPERTY", propertyIds, tenantId],
    queryFn: () => PTSearch.genericPropertyDetails(t, tenantId, propertyIds),
    select: defaultSelect,
    config,
  });
};

export default useGenericViewProperty;
