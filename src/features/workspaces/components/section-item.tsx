import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

import { Hint } from "@/components/hint";

type Props = {
    value: string;
    label: string;
    hint: string;
    onNew?: () => void;
    children: React.ReactNode;
};

export const SectionItem = ({ value, label, hint, children, onNew }: Props) => {
    return (
        <AccordionItem value={value} className="px-2 border-b-0">
            <div className="flex items-center justify-between px-3.5 group">
                <AccordionTrigger className="w-full justify-start text-[#f9edfc] hover:no-underline py-2.5">
                    <span className="line-clamp-1 text-sm ml-2 font-normal capitalize">
                        {label}
                    </span>
                </AccordionTrigger>

                {onNew && (
                    <Hint label={hint}>
                        <Button
                            variant="transparent"
                            size="icon-sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm size-6 shrink-0"
                            onClick={onNew}
                        >
                            <Plus className="size-5 text-[#f9edfc]" />
                        </Button>
                    </Hint>
                )}
            </div>
            <AccordionContent className="pb-2 space-y-2">
                {children}
            </AccordionContent>
        </AccordionItem>
    );
};
