"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

const signupSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string()
})
.refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
    const router = useRouter();

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: SignupFormValues) => {
        await authClient.signUp.email(
            {
                name: values.email,
                email: values.email,
                password: values.password,
                callbackURL: "/",
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            }
        );
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Get Started
                    </CardTitle>
                    <CardDescription>
                        Create your account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    disabled={isPending}
                                >
                                    Continue with GitHub
                                </Button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    type="button"
                                    disabled={isPending}
                                >
                                    Continue with Google
                                </Button>
                            </div>
                            <div className="grid gap-6">
                                <FieldGroup>
                                    <Controller
                                        name="email"
                                        control={form.control}
                                        render={({ field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel>
                                                  Email
                                                </FieldLabel>
                                                <Input
                                                  {...field}
                                                  aria-invalid={fieldState.invalid}
                                                  placeholder="m@example.com"
                                                  type="email"
                                                />
                                                {fieldState.invalid && (
                                                  <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel>
                                                  Password
                                                </FieldLabel>
                                                <Input
                                                  {...field}
                                                  aria-invalid={fieldState.invalid}
                                                  placeholder="************"
                                                  type="password"
                                                />
                                                {fieldState.invalid && (
                                                  <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="confirmPassword"
                                        control={form.control}
                                        render={({ field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel>
                                                  Confirm Password
                                                </FieldLabel>
                                                <Input
                                                  {...field}
                                                  aria-invalid={fieldState.invalid}
                                                  placeholder="************"
                                                  type="password"
                                                />
                                                {fieldState.invalid && (
                                                  <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isPending}
                                >
                                    Sign up
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="underline underline-offset-4">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}