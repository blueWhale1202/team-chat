import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";

export const Sidebar = () => {
    return (
        <aside className="w-[70px] h-full flex flex-col gap-y-4 items-center pb-4 pt-[9px] bg-[#481349]">
            <WorkspaceSwitcher />
            <div className="mt-auto flex flex-col justify-center items-center gap-y-1">
                <UserButton />
            </div>
        </aside>
    );
};
