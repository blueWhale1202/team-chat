"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { parsedName } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(3).max(80),
});

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
    name: "",
};

type Props = {
    id: string;
    initialData?: FormValues | null;
    onSubmit: (values: FormValues) => void;
};

export const EditWorkspaceForm = ({ id, initialData, onSubmit }: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ?? defaultValues,
    });

    return (
        <Form {...form}>
            <form
                id={id}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g plan-budget"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(
                                            parsedName(e.target.value)
                                        );
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};
