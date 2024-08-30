"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import { useState } from "react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Emoji } from "@/interfaces";

type Props = {
    hint?: string;
    children: React.ReactNode;
    onEmojiSelected: (value: string) => void;
};

export const EmojiPopover = ({
    hint = "Emoji",
    children,
    onEmojiSelected,
}: Props) => {
    const [openTooltip, setOpenTooltip] = useState(false);
    const [openPopover, setOpenPopover] = useState(false);

    const onSelect = (e: Emoji) => {
        onEmojiSelected(e.native);

        setOpenPopover(false);
        setTimeout(() => {
            setOpenTooltip(false);
        }, 500);
    };

    return (
        <TooltipProvider>
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
                <Tooltip
                    delayDuration={50}
                    open={openTooltip}
                    onOpenChange={setOpenTooltip}
                >
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>{children}</PopoverTrigger>
                    </TooltipTrigger>

                    <TooltipContent>
                        <p className="font-medium text-xs">{hint}</p>
                    </TooltipContent>
                </Tooltip>

                <PopoverContent
                    className="p-0 w-full border-none "
                    align="start"
                >
                    <Picker
                        theme="light"
                        data={data}
                        onEmojiSelect={onSelect}
                    />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
};
