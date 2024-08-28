"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { toast } from "sonner";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetWorkspaceInfoById } from "@/features/workspaces/hooks/use-get-info";
import { useJoinWorkspace } from "@/features/workspaces/hooks/use-join-workspace";
import { useEffect } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
    params: {
        workspaceId: Id<"workspaces">;
    };
};

export default function JoinPage({ params }: Props) {
    const { workspaceId } = params;
    const router = useRouter();

    const info = useGetWorkspaceInfoById(workspaceId);
    const { mutate, isPending } = useJoinWorkspace();

    useEffect(() => {
        console.log(info.data);
        if (info.data?.isMember) {
            router.push(`/workspaces/${workspaceId}`);
        }
    }, [router, workspaceId, info]);

    if (info.isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!info.data) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <TriangleAlert className="size-6" />
                <p className="text-sm text-muted-foreground">
                    Workspace not found
                </p>
            </div>
        );
    }

    const joinCodeLength = 6;

    const onComplete = (value: string) => {
        mutate(
            {
                joinCode: value,
                workspaceId,
            },
            {
                onSuccess: () => {
                    router.replace(`/workspaces/${workspaceId}`);
                    toast.success("Workspace joined");
                },
                onError: () => {
                    toast.error("Fail to join workspace");
                },
            }
        );
    };

    return (
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-md shadow-md">
            <Image
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="h-auto w-auto"
            />
            <div className="flex flex-col gap-y-2 items-center justify-center">
                <h1 className="text-2xl font-bold">
                    Join workspace: {info.data.name}
                </h1>
                <p className="text-md text-muted-foreground">
                    Enter the workspace code to join
                </p>
            </div>

            <InputOTP
                maxLength={joinCodeLength}
                onComplete={onComplete}
                disabled={info.isLoading || isPending}
            >
                <InputOTPGroup>
                    {Array(joinCodeLength)
                        .fill(0)
                        .map((_, i) => (
                            <InputOTPSlot
                                key={i}
                                index={i}
                                className="text-lg font-medium text-gray-500"
                            />
                        ))}
                </InputOTPGroup>
            </InputOTP>

            <div className="flex gap-x-4">
                <Button size="lg" variant="link" asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    );
}
