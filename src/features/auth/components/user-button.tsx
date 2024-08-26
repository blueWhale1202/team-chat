"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Loader, LogOut } from "lucide-react";

import { useAuthActions } from "@convex-dev/auth/react";

import { api } from "../../../../convex/_generated/api";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const UserButton = () => {
    const { signOut } = useAuthActions();

    // const { data, isLoading } = useCurrentUser();

    // const { data: test, isPending, error } = useQuery(convexQuery(api.user.current, {}));

    const { isPending, data } = useQuery(convexQuery(api.user.current, {}));

    if (isPending) {
        return (
            <Loader className="size-4 animate-spin text-muted-foreground " />
        );
    }

    if (!data) {
        return null;
    }

    const { name, image } = data;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className=" relative size-10 rounded-full"
                >
                    <Avatar className="size-10 hover:opacity-75 transition">
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback className="bg-sky-500 text-white">
                            {name?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void signOut()}>
                    <LogOut className="size-4 mr-2" /> Logout
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
