import { authClient } from "@/lib/auth-client"

export const useUserActiveOrg = () => {
  return authClient.organization.getFullOrganization()
}
