"use client";

import { useDeleteWorkspaceModal } from "../store/use-delete-modal";

import { useMutation } from "@tanstack/react-query";
import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";

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
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { useGetWorkspaces } from "../hooks/use-get-workspaces";

export const DeleteWorkspaceDialog = () => {
    const [open, setOpen] = useDeleteWorkspaceModal();

    const { data: currentWorkspace } = useGetCurrentWorkspace();
    const { data: workspaces } = useGetWorkspaces();

    const { mutate } = useMutation({
        mutationFn: useConvexMutation(api.workspaces.remove),
    });

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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={onDelete}>Continue</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
