import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

type Props = {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
};

export const ConversationHeader = ({
    memberName = "Member",
    memberImage,
    onClick,
}: Props) => {
    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Button variant="ghost" size="sm" onClick={onClick}>
                <Avatar className="size-6 mr-2">
                    <AvatarImage src={memberImage} alt={memberName} />
                    <AvatarFallback>
                        {memberName[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <span className="truncate">{memberName}</span>
                <ChevronDown className="size-4 ml-2" />
            </Button>
        </div>
    );
};
