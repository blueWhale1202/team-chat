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
                <Button variant="ghost" className="rounded-md relative size-10">
                    <Avatar className="rounded-md size-10 hover:opacity-75 transition">
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback className="rounded-md bg-sky-500 text-white">
                            {name?.[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" side="right" align="end">
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
