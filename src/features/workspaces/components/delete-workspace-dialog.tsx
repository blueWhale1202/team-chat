"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { useDeleteWorkspaceModal } from "../store/use-delete-modal";

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";

import { useRouter } from "next/navigation";
import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";
import { useGetWorkspaces } from "../hooks/use-get-workspaces";

export const DeleteWorkspaceDialog = () => {
    const [open, setOpen] = useDeleteWorkspaceModal();

    const { data: currentWorkspace } = useGetCurrentWorkspace();
    const { data: workspaces } = useGetWorkspaces();

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.workspaces.remove),
    });

    const router = useRouter();

    if (!currentWorkspace || !workspaces) {
        return null;
    }

    const onDelete = () => {
        mutate(
            {
                id: currentWorkspace._id,
            },
            {
                onSuccess: () => {
                    router.replace(`/`);
                    toast.success("Deleted workspace");
                },
                onError: () => {
                    toast.error("Fail to remove workspace");
                },
            }
        );
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete{" "}
                        <span className="font-semibold">
                            {currentWorkspace.name}
                        </span>{" "}
                        workspace?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete workspace and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={onDelete} disabled={isPending}>
                            Continue
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
