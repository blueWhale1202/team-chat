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

const formSchema = z
    .object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password don't match",
        path: ["confirmPassword"],
    });

export type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
};

type Props = {
    disabled: boolean;
    onSubmit: (values: FormValues) => void;
};

export const SignUpForm = ({ disabled = false, onSubmit }: Props) => {
    const [showedPassword, setShowedPassword] = useState(false);
    const [showedConfirmPassword, setShowedConfirmPassword] = useState(false);

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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Full name"
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
                                        type={
                                            showedPassword ? "text" : "password"
                                        }
                                        placeholder="Your password"
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

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={
                                            showedConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm your password"
                                        required
                                        disabled={disabled}
                                        {...field}
                                    />
                                    <TogglePasswordButton
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        isShow={showedConfirmPassword}
                                        setIsShow={setShowedConfirmPassword}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" size="lg" className="w-full">
                    Continue
                </Button>
            </form>
        </Form>
    );
};
