import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";
import { useGetWorkspaceId } from "./use-workspace-id";

export const useGetCurrentMember = () => {
    const workspaceId = useGetWorkspaceId();

    const query = useQuery(convexQuery(api.members.current, { workspaceId }));

    return query;
};
