"use client";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { cn } from "@/lib/utils";

import { EmojiPopover } from "@/components/emoji-popover";
import { Hint } from "@/components/hint";

import { useGetCurrentMember } from "@/features/members/hook/use-get-member";
import { SmilePlus } from "lucide-react";

type Props = {
    data: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    onChange: (value: string) => void;
};

export const Reactions = ({ data, onChange }: Props) => {
    const { data: currentMember } = useGetCurrentMember();

    if (data.length === 0 || !currentMember?._id) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 my-1">
            {data.map((reaction) => {
                const memberReacted = reaction.memberIds.includes(
                    currentMember._id
                );

                return (
                    <Hint
                        key={reaction._id}
                        label={
                            memberReacted
                                ? `cancel ${reaction.value}`
                                : `add ${reaction.value}`
                        }
                    >
                        <button
                            className={cn(
                                "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 flex items-center gap-x-1",
                                memberReacted &&
                                    "bg-blue-100/70 border-blue-500 text-white"
                            )}
                            onClick={() => onChange(reaction.value)}
                        >
                            {reaction.value}
                            <span
                                className={cn(
                                    "text-xs font-semibold text-muted-foreground",
                                    memberReacted && "text-blue-500"
                                )}
                            >
                                {reaction.count}
                            </span>
                        </button>
                    </Hint>
                );
            })}

            <EmojiPopover
                hint="Add reaction"
                onEmojiSelected={(emoji) => onChange(emoji)}
            >
                <button className="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 flex items-center gap-x-1">
                    <SmilePlus className="size-4 " />
                </button>
            </EmojiPopover>
        </div>
    );
};
