"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { CreateChannelForm, FormValues } from "./create-channel-form";

import { useGetWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateChannel } from "../../hooks/ue-create-channel";

import { useCreateChannelModal } from "../../store/use-create-modal";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateChannelModal = () => {
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal();

    const workspaceId = useGetWorkspaceId();
    const { mutate, isPending } = useCreateChannel();

    const onSubmit = ({ name }: FormValues) => {
        mutate(
            {
                name,
                workspaceId,
            },
            {
                onSuccess(id) {
                    setOpen(false);

                    router.push(`/workspaces/${workspaceId}/channels/${id}`);
                    toast.success("Created new channel");
                },
                onError() {
                    toast.error("Fail to create channel");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                    <DialogDescription>Create new channel</DialogDescription>
                </DialogHeader>

                <CreateChannelForm onSubmit={onSubmit} disabled={isPending} />
            </DialogContent>
        </Dialog>
    );
};
