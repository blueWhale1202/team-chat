import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";

export const useUpdateChannel = () => {
    const mutation = useMutation({
        mutationFn: useConvexMutation(api.channels.update),
    });

    return mutation;
};
