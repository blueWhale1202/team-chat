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
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    name: z.string().min(3).max(80),
});

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
    name: "",
};

type Props = {
    disabled?: boolean;
    onSubmit: (values: FormValues) => void;
};

export const CreateChannelForm = ({ disabled, onSubmit }: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const parsedName = (name: string) => {
        return name.replace(/\s+/g, "-").toLowerCase();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                <div className="flex justify-end">
                    <Button type="submit" disabled={disabled}>
                        Create
                    </Button>
                </div>
            </form>
        </Form>
    );
};
