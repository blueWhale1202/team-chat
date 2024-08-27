"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import { useCreateWorkspaceModal } from "../../store/use-create-modal";

const formSchema = z.object({
    name: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
    name: "",
};

export const CreateWorkspaceForm = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const { mutate, isPending, error } = useMutation({
        mutationFn: useConvexMutation(api.workspaces.create),
    });

    const router = useRouter();

    const [_, setOpen] = useCreateWorkspaceModal();

    const onSubmit = ({ name }: FormValues) => {
        mutate(
            { name },
            {
                onSuccess: (id) => {
                    toast.success("Workspace created");

                    form.reset(defaultValues);
                    setOpen(false);

                    router.push(`/workspaces/${id}`);
                },
            }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Workspace name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Workspace name e.g 'Work', 'Home', 'Personal'"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        Create
                    </Button>
                </div>

                {error && <p className="text-destructive">{error.message}</p>}
            </form>
        </Form>
    );
};
