"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import PasswordInput from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "@/lib/toaster";
import { useRouter } from "next/navigation";
const formSchema = z.object({
	email: z.email("Email is not correct"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(32, "Password must be at most 32 characters."),
});

export default function Page() {
	const router = useRouter();
	const { handleSubmit, control, formState } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "onChange",
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await authClient.signIn.email({
			email: values.email, // required
			password: values.password, // required
			rememberMe: true,
			// callbackURL: "/app",
			fetchOptions: {
				onError(context) {
					toast(context.error.message, "error");
				},
				onSuccess(context) {
					const isVerified: boolean = context.data?.user?.emailVerified;
					if (!isVerified) {
						router.push("/auth/verify");
					} else {
						router.push("/app");
					}
				},
			},
		});
	};
	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<div className={"flex flex-col gap-6"}>
					<Card>
						<CardHeader>
							<CardTitle>Login to your account</CardTitle>
							<CardDescription>
								Enter your email below to login to your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)}>
								<FieldGroup>
									<Controller
										name='email'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='email'>Email</FieldLabel>
												<Input
													id='email'
													type='email'
													placeholder='m@example.com'
													required
													{...field}
													aria-invalid={fieldState.invalid}
													disabled={formState.isSubmitting}
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
									<Field>
										<div className='flex items-center'>
											<Link
												href='/auth/forgot-password'
												className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
											>
												Forgot your password?
											</Link>
										</div>
										<Controller
											name='password'
											control={control}
											rules={{ required: true }}
											render={({ field, fieldState }) => (
												<PasswordInput
													htmlFor='password'
													id='password'
													required={true}
													label='Password'
													data-invalid={fieldState.invalid}
													aria-invalid={fieldState.invalid}
													field={field}
													disabled={formState.isSubmitting}
													fieldState={fieldState}
												/>
											)}
										/>
									</Field>
									<Field>
										<Button
											type='submit'
											disabled={!formState.isValid || formState.isSubmitting}
											className='cursor-pointer'
										>
											Login
										</Button>
										{/* <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
										<FieldDescription className='text-center'>
											Don&apos;t have an account?{" "}
											<Link href='/auth/signup'>Sign up</Link>
										</FieldDescription>
									</Field>
								</FieldGroup>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
