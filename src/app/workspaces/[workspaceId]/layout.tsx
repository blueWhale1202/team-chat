import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Sidebar } from "@/features/workspaces/components/sidebar";
import { Toolbar } from "@/features/workspaces/components/toolbar";
import { WorkspaceSidebar } from "@/features/workspaces/components/workspace-sidebar";

type Props = {
    children: React.ReactNode;
};

const WorkspaceLayout = ({ children }: Props) => {
    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <Sidebar />

                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel defaultSize={20} minSize={20}>
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={80} minSize={20}>
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default WorkspaceLayout;
