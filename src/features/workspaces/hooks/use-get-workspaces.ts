import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";

export const useGetWorkspaces = () => {
    const query = useQuery(convexQuery(api.workspaces.getList, {}));
    return query;
};
