"use client";

import { useId } from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { EditWorkspaceForm, FormValues } from "./edit-workspace-form";

import { api } from "../../../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetCurrentWorkspace } from "../../hooks/use-get-workspace";
import { useEditWorkspaceModal } from "../../store/use-edit-modal copy";

export const EditWorkspaceModal = () => {
    const editFormId = useId();

    const [open, setOpen] = useEditWorkspaceModal();

    const { data: workspace } = useGetCurrentWorkspace();

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.workspaces.update),
    });

    if (!workspace) {
        return null;
    }

    const onSubmit = ({ name }: FormValues) => {
        mutate(
            {
                id: workspace._id,
                name,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    toast.success("Workspace updated");
                },
                onError: () => {
                    toast.error("Fail to update workspace");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit</DialogTitle>
                    <DialogDescription>Rename this workspace</DialogDescription>
                </DialogHeader>

                <EditWorkspaceForm
                    id={editFormId}
                    onSubmit={onSubmit}
                    initialData={workspace}
                />

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isPending}>
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button
                        type="submit"
                        form={editFormId}
                        disabled={isPending}
                    >
                        Save change
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
