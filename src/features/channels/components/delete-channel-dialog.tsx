"use client";

import { useRouter } from "next/navigation";

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

import { useDeleteChannelModal } from "../store/use-delete-modal";

import { useGetWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetCurrentChannel } from "../hooks/use-get-channel";
import { useRemoveChannel } from "../hooks/use-remove-channel";

export const DeleteChannelDialog = () => {
    const [open, setOpen] = useDeleteChannelModal();

    const workspaceId = useGetWorkspaceId();

    const { data: channel } = useGetCurrentChannel();
    const { mutate, isPending } = useRemoveChannel();

    const router = useRouter();

    if (!channel) {
        return null;
    }

    const onDelete = () => {
        mutate(
            {
                id: channel._id,
            },
            {
                onSuccess: () => {
                    router.replace(`/workspaces/${workspaceId}`);
                    toast.success("Deleted channel");
                },
                onError: () => {
                    toast.error("Fail to remove channel");
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
                        <span className="font-semibold">{channel.name}</span>{" "}
                        channel?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete channel and remove your data from our servers.
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
