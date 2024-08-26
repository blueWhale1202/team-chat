import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isShow: boolean;
    setIsShow: (isShow: boolean) => void;
}

export const TogglePasswordButton = ({
    isShow,
    setIsShow,
    className,
}: Props) => {
    return (
        <Button
            type="button"
            size="icon"
            variant="ghost"
            className={className}
            onClick={() => setIsShow(!isShow)}
        >
            {isShow ? (
                <EyeOff className="size-4 text-muted-foreground" />
            ) : (
                <Eye className="size-4 text-muted-foreground" />
            )}
        </Button>
    );
};
