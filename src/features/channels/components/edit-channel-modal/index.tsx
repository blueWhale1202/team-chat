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

import { EditWorkspaceForm, FormValues } from "./edit-channel-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGetCurrentChannel } from "../../hooks/use-get-channel";
import { useUpdateChannel } from "../../hooks/use-update-channel";
import { useEditChannelModal } from "../../store/use-edit-modal";

export const EditChannelModal = () => {
    const editFormId = useId();

    const [open, setOpen] = useEditChannelModal();

    const { data: channel } = useGetCurrentChannel();

    const { mutate, isPending } = useUpdateChannel();

    if (!channel) {
        return null;
    }

    const onSubmit = ({ name }: FormValues) => {
        mutate(
            {
                id: channel._id,
                name,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    toast.success("Channel updated");
                },
                onError: () => {
                    toast.error("Fail to update channel");
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
                    initialData={channel}
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
