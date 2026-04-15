import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAudit = ({ tenantId, filters }, config = {}) => {
  const client = useQueryClient();
  const args = tenantId ? { tenantId, filters } : { filters };
  const { isLoading, error, data } = useQuery({
    queryKey: ["AuditList", tenantId, filters],
    queryFn: () => Digit.AuditService.audit_log(args),
    ...config
  });
  return { isLoading, error, data, revalidate: () => client.invalidateQueries({ queryKey: ["AuditList", tenantId, filters] }) };
};

export default useAudit;
