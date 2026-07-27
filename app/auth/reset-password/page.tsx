"use client";
import { Container } from "@mantine/core";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	Card,
} from "@/components/ui/card";
import { FieldGroup, Field, FieldDescription } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmPasswordInput from "@/components/confirm-password";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "@/lib/toaster";
import Link from "next/link";

const formSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(32, "Password must be at most 32 characters."),
		confirm_password: z.string("Must be the same as password").min(8),
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ["confirm_password"],
		message: "Passwords must match",
	});

const Page = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const { handleSubmit, control, formState } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await authClient.resetPassword({
			newPassword: values.confirm_password,
			token: token || "",
			fetchOptions: {
				onError(context) {
					toast(context.error.message, "error");
				},
				onSuccess() {
					toast("Password reset successfuly", "success");
					router.push("/auth/signin");
				},
			},
		});
	};
	return (
		<Container className='py-6 md:w-[50%] space-y-6'>
			<h2 className='text-center text-2xl'>Invoicely</h2>
			<div className={"flex flex-col gap-6"}>
				<Card>
					<CardHeader>
						<CardTitle>Reset Password</CardTitle>
						<CardDescription>Enter your new password below</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldGroup>
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
											fieldState={fieldState}
										/>
									)}
								/>
								<Controller
									name='confirm_password'
									control={control}
									render={({ field, fieldState }) => (
										<ConfirmPasswordInput
											htmlFor='confirm-password'
											id='confirm-password'
											description='Please confirm your password.'
											required={true}
											label='Confirm Password'
											data-invalid={fieldState.invalid}
											aria-invalid={fieldState.invalid}
											field={field}
											fieldState={fieldState}
										/>
									)}
								/>
								<FieldGroup>
									<Field>
										<Button
											disabled={!formState.isValid || formState.isSubmitting}
											type='submit'
											className='cursor-pointer'
										>
											Change Password
										</Button>
										<FieldDescription className='px-6 text-center'>
											<Link href='/auth/signin'>Sign in to your account</Link>
										</FieldDescription>
									</Field>
								</FieldGroup>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
};

export default Page;
