import { useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { isErrorResponse } from "./checkError";

const useAuthRedirect = () => {
  const getUser = useQuery(api.Organisation.OrganisationToUser.getUser);
  // In case the user signs out while on the page.
  if (isErrorResponse(getUser)) {
    redirect("/sign_in");
  }
};

export default useAuthRedirect;
