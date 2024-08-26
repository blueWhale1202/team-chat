"use client";

import { SignInFlow } from "../../types";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

import { FormValues, SignUpForm } from "./sign-up-form";

import { useAuthActions } from "@convex-dev/auth/react";

type Props = {
    setState: (state: SignInFlow) => void;
};

export const SignUpCard = ({ setState }: Props) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    const { signIn } = useAuthActions();

    const onProviderSignIn = (value: "github" | "google") => {
        setIsPending(true);
        signIn(value).finally(() => {
            setIsPending(false);
        });
    };

    const onPasswordSignUp = (values: FormValues) => {
        setIsPending(true);
        signIn("password", { ...values, flow: "signUp" })
            .catch(() => {
                setError("Something went wrong");
            })
            .finally(() => {
                setIsPending(false);
            });
    };

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Sign up to continue</CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>

            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                </div>
            )}

            <CardContent className="px-0 pb-0 space-y-5">
                <SignUpForm disabled={isPending} onSubmit={onPasswordSignUp} />

                <div className="flex flex-col gap-y-2.5">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                        onClick={() => onProviderSignIn("google")}
                        disabled={isPending}
                    >
                        <FcGoogle className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        Continue with Google
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full relative"
                        onClick={() => onProviderSignIn("github")}
                        disabled={isPending}
                    >
                        <FaGithub className="size-5 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        Continue with Github
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Already have an account?{" "}
                    <span
                        className="text-sky-700 hover:underline cursor-pointer"
                        onClick={() => setState("signIn")}
                    >
                        Sign in
                    </span>
                </p>
            </CardContent>
        </Card>
    );
};
