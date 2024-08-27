import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetWorkspaceId = () => {
    const { workspaceId } = useParams<{ workspaceId: Id<"workspaces"> }>();

    return workspaceId;
};
