import { Doc, Id } from "../../../../convex/_generated/dataModel";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, Loader, Mail, TriangleAlert, X } from "lucide-react";

import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { useConfirm } from "@/hooks/use-confirm";
import { useGetMemberById } from "../hook/use-get-member-by-id";

import { useGetCurrentMember } from "../hook/use-get-member";
import { useRemoveMember } from "../hook/use-remove-member";
import { useUpdateMember } from "../hook/use-update-member";

type Role = Doc<"members">["role"];

type Props = {
    memberId: Id<"members">;
    onClose: () => void;
};

export const Profile = ({ memberId, onClose }: Props) => {
    const router = useRouter();

    const { data: member, isPending: memberPending } =
        useGetMemberById(memberId);

    const { data: currentMember, isPending: currentMemberPending } =
        useGetCurrentMember();

    const updateMember = useUpdateMember();
    const removeMember = useRemoveMember();

    const [UpdateDialog, confirmUpdate] = useConfirm(
        "Change role",
        "Are you sure you want to change this member's role"
    );

    const [LeaveDialog, confirmLeave] = useConfirm(
        "Leave workspace",
        "Are you sure you want to leave this workspace?"
    );

    const [RemoveDialog, confirmRemove] = useConfirm(
        "Remove member",
        "Are you sure you want to remove this member?"
    );

    const onRemove = async () => {
        const ok = await confirmRemove();

        if (!ok) return;

        removeMember.mutate(
            { id: memberId },
            {
                onSuccess: () => {
                    toast.success("Member removed");
                    onClose();
                },
                onError: () => {
                    toast.error("Fail to remove member");
                },
            }
        );
    };

    const onLeave = async () => {
        const ok = await confirmLeave();

        if (!ok) return;

        removeMember.mutate(
            {
                id: memberId,
            },
            {
                onSuccess: () => {
                    toast.success("You left the workspace");
                    onClose();
                    router.replace("/");
                },
                onError: () => {
                    toast.error("Fail to leave the workspace");
                },
            }
        );
    };

    const onUpdate = async (role: Role) => {
        const ok = await confirmUpdate();

        if (!ok) return;

        updateMember.mutate(
            {
                id: memberId,
                role,
            },
            {
                onSuccess: () => {
                    toast.success("Role changed");
                },
                onError: () => {
                    toast.error("Fail to change role");
                },
            }
        );
    };

    if (memberPending || currentMemberPending) {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[52px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>

                    <Button variant="ghost" size="icon-sm" onClick={onClose}>
                        <X className="size-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="h-full flex justify-center items-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!member || !currentMember) {
        return (
            <div className="h-full flex flex-col">
                <div className="h-[52px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>

                    <Button variant="ghost" size="icon-sm" onClick={onClose}>
                        <X className="size-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="h-full flex flex-col justify-center items-center gap-y-2">
                    <TriangleAlert className="size-6 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                        Profile not found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <LeaveDialog />
            <RemoveDialog />
            <UpdateDialog />
            <div className="h-full flex flex-col">
                <div className="h-[49px] flex justify-between items-center px-4 border-b">
                    <p className="text-lg font-bold">Profile</p>

                    <Button variant="ghost" size="icon-sm" onClick={onClose}>
                        <X className="size-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="p-4 flex flex-col justify-center items-center">
                    <Avatar className="max-w-64 max-h-64 size-full">
                        <AvatarImage
                            src={member.user.image}
                            alt={member.user.name}
                        />
                        <AvatarFallback className="aspect-square text-6xl">
                            {member.user.name?.[0].toUpperCase() || "M"}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="flex flex-col p-4 pt-0">
                    <p className="text-xl font-bold text-center">
                        {member.user.name}
                    </p>

                    {currentMember.role === "admin" &&
                        currentMember._id !== member._id && (
                            <div className="flex items-center gap-2 mt-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full capitalize"
                                        >
                                            {member.role}{" "}
                                            <ChevronDown className="size-4 ml-2" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-full">
                                        <DropdownMenuRadioGroup
                                            value={member.role}
                                            onValueChange={(value) =>
                                                onUpdate(value as Role)
                                            }
                                        >
                                            <DropdownMenuRadioItem value="admin">
                                                Admin
                                            </DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="member">
                                                Member
                                            </DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={onRemove}
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                    {currentMember._id === member._id &&
                        currentMember.role !== "admin" && (
                            <div className="mt-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={onLeave}
                                >
                                    Leave
                                </Button>
                            </div>
                        )}
                </div>

                <Separator />

                <div className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4">
                        Contact information
                    </p>

                    <div className="flex items-center gap-2">
                        <div className="size-9 rounded-md flex items-center justify-center bg-muted">
                            <Mail className="size-4 " />
                        </div>

                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-muted-foreground">
                                Email Address
                            </p>
                            <Link
                                href={`mailto:${member.user.email}`}
                                className="text-sm hover:underline text-[#1264a3]"
                            >
                                {member.user.email}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
