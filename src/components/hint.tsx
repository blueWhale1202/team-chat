import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
    children: React.ReactNode;
    label: string;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
};

export const Hint = ({
    children,
    label,
    side = "top",
    align = "center",
}: Props) => {
    return (
        <TooltipProvider delayDuration={50}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    side={side}
                    align={align}
                    // className="bg-black text-white border border-white/5"
                >
                    <p className="font-medium text-sm">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
