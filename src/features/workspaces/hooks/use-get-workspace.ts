import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";

export const useGetWorkspace = () => {
    const { workspaceId } = useParams<{ workspaceId: Id<"workspaces"> }>();

    const query = useQuery(
        convexQuery(api.workspaces.getById, { id: workspaceId })
    );

    return query;
};
