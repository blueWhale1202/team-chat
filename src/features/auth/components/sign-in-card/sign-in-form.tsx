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
import { useState } from "react";
import { TogglePasswordButton } from "../toggle-password-button";

const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex, {
        message: "Password invalid",
    }),
});

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
    email: "",
    password: "",
};

type Props = {
    disabled: boolean;
    onSubmit: (values: FormValues) => void;
};

export const SignInForm = ({ disabled = false, onSubmit }: Props) => {
    const [showedPassword, setShowedPassword] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2.5"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your email"
                                    type="email"
                                    disabled={disabled}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Your password"
                                        type={
                                            showedPassword ? "text" : "password"
                                        }
                                        disabled={disabled}
                                        {...field}
                                    />

                                    <TogglePasswordButton
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        isShow={showedPassword}
                                        setIsShow={setShowedPassword}
                                    />
                                </div>
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={disabled}
                >
                    Continue
                </Button>
            </form>
        </Form>
    );
};
