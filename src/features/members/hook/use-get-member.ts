import { useGetWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";

export const useGetCurrentMember = () => {
    const workspaceId = useGetWorkspaceId();

    const query = useQuery(convexQuery(api.members.current, { workspaceId }));

    return query;
};
