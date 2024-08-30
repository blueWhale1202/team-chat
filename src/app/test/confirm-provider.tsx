import React, { createContext, useCallback, useContext, useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    message: string;
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    open,
    onOpenChange,
    message,
    title,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

interface ConfirmContextType {
    confirm: (title: string, message: string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return context.confirm;
};

const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
    const [dialogState, setDialogState] = useState({
        open: false,
        message: "",
        title: "",
        resolve: null as ((value: boolean) => void) | null,
    });

    const confirm = useCallback(
        (title: string, message: string): Promise<boolean> => {
            return new Promise((resolve) => {
                setDialogState({ open: true, message, title, resolve });
            });
        },
        []
    );

    const handleConfirm = useCallback(() => {
        setDialogState((prev) => ({ ...prev, open: false }));
        dialogState.resolve?.(true);
    }, [dialogState]);

    const handleCancel = useCallback(() => {
        setDialogState((prev) => ({ ...prev, open: false }));
        dialogState.resolve?.(false);
    }, [dialogState]);

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (!open) handleCancel();
        },
        [handleCancel]
    );

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog
                open={dialogState.open}
                onOpenChange={handleOpenChange}
                message={dialogState.message}
                title={dialogState.title}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ConfirmContext.Provider>
    );
};

export { ConfirmProvider, useConfirm };
