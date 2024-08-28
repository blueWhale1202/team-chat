"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { CheckCheck, Copy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useGetCurrentWorkspace } from "../hooks/use-get-workspace";
import { useNewJoinCode } from "../hooks/use-new-join-code";
import { useInviteModal } from "../store/use-invite-modal";

export const InviteModal = () => {
    const [open, setOpen] = useInviteModal();
    const { isCopied, copyToClipboard } = useCopyToClipboard();

    const { data: workspace } = useGetCurrentWorkspace();
    const { mutate, isPending } = useNewJoinCode();

    if (!workspace) {
        return null;
    }

    const onCopy = () => {
        const invitedLink = `${location.origin}/join/${workspace._id}`;
        copyToClipboard(invitedLink);
    };

    const onNewCode = () => {
        mutate(
            {
                id: workspace._id,
            },
            {
                onSuccess: () => {
                    toast.success("Invite code regenerate");
                },
                onError: () => {
                    toast.error("Fail to regenerate invite code");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite people to {workspace.name}</DialogTitle>
                    <DialogDescription>
                        Use code bellow to invite people to your workspace
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center justify-center gap-x-4 py-10">
                    <p className="text-4xl font-bold tracking-widest">
                        {workspace.joinCode}
                    </p>

                    <Button variant="ghost" size="icon" onClick={onCopy}>
                        {isCopied ? (
                            <CheckCheck className="size-4" />
                        ) : (
                            <Copy className="size-4" />
                        )}
                    </Button>
                </div>

                <div className="flex items-center justify-between w-full">
                    <Button
                        variant="outline"
                        disabled={isPending}
                        onClick={onNewCode}
                    >
                        New code
                        <RefreshCcw className="size-4 ml-2" />
                    </Button>

                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};
