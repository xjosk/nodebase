"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"

const loginSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        await authClient.signIn.email({
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
        });
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Login to continue
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
                                </FieldGroup>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isPending}
                                >
                                    Login
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Don't have an account?{" "}
                                <Link href="/signup" className="underline underline-offset-4">
                                    Signup
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}