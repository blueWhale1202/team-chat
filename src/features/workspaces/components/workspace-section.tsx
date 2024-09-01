import { Doc } from "../../../../convex/_generated/dataModel";

import { Accordion } from "@/components/ui/accordion";

import { Hash } from "lucide-react";

import { UserItem } from "@/features/members/components/user-item";
import { SectionItem } from "./section-item";
import { SidebarItem } from "./sidebar-item";

import { useChannelId } from "@/features/channels/hooks/use-channel-id";
import { useCreateChannelModal } from "@/features/channels/store/use-create-modal";
import { useMemberId } from "@/features/members/hook/use-member-id";

import { useGetMembers } from "@/features/members/hook/use-get-members";
import { useGetChannels } from "../../channels/hooks/use-get-channels";

type Props = {
    currentMember: Doc<"members">;
};

export const WorkspaceSection = ({ currentMember }: Props) => {
    const channelId = useChannelId();
    const memberId = useMemberId();

    const channels = useGetChannels();
    const members = useGetMembers();

    const [_open, setOpen] = useCreateChannelModal();

    const onNewChannel =
        currentMember.role === "admin" ? () => setOpen(true) : undefined;

    return (
        <Accordion type="multiple" defaultValue={["channels", "messages"]}>
            <SectionItem
                value="channels"
                label="Channels"
                hint="New channel"
                onNew={onNewChannel}
            >
                {channels.data?.map((channel) => (
                    <SidebarItem
                        key={channel._id}
                        id={channel._id}
                        label={channel.name}
                        Icon={Hash}
                        isActive={channelId === channel._id}
                    />
                ))}
            </SectionItem>

            <SectionItem
                value="messages"
                label="Direct Messages"
                hint="New direct message"
            >
                {members.data?.map((member) => (
                    <UserItem
                        key={member._id}
                        id={member._id}
                        label={member.user.name}
                        imageUrl={member.user.image}
                        isActive={member._id === memberId}
                    />
                ))}
            </SectionItem>
        </Accordion>
    );
};
