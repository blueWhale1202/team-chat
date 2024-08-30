import dynamic from "next/dynamic";

import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Hint } from "@/components/hint";
import { Thumbnail } from "./thumbnail";

import { format, isToday, isYesterday } from "date-fns";

const Render = dynamic(() => import("./render"), { ssr: false });

type Props = {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createAt: Doc<"messages">["_creationTime"];
    updateAt: Doc<"messages">["updateAt"];
    isEditing: boolean;
    setEditing: (id: Id<"messages"> | null) => void;
    isCompact?: boolean;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number;
};

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
    id,
    isAuthor,
    memberId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    image,
    createAt,
    updateAt,
    isEditing,
    isCompact,
    setEditing,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp,
}: Props) => {
    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                <div className="flex items-start gap-2">
                    <Hint label={formatFullTime(new Date(createAt))}>
                        <button className=" w-10 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 leading-5 text-center hover:underline">
                            {format(createAt, "hh:mm")}
                        </button>
                    </Hint>

                    <div className="w-full flex flex-col">
                        <Render value={body} />

                        <Thumbnail url={image} />

                        {updateAt && (
                            <span className="text-xs text-muted-foreground">
                                (edited)
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
            <div className="flex items-start gap-2">
                <button>
                    <Avatar>
                        <AvatarImage src={authorImage} alt={authorName} />
                        <AvatarFallback>
                            {authorName[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </button>

                <div className="flex flex-col w-full overflow-hidden">
                    <div className="text-sm">
                        <button className="mr-2 font-bold text-primary hover:underline">
                            {authorName}
                        </button>

                        <Hint label={formatFullTime(new Date(createAt))}>
                            <button className="text-xs text-muted-foreground hover:underline">
                                {format(createAt, "hh:mm a")}
                            </button>
                        </Hint>
                    </div>

                    <Render value={body} />

                    <Thumbnail url={image} />

                    {updateAt && (
                        <span className="text-xs text-muted-foreground">
                            (edited)
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
