"use client";
import { useState } from "react";
import { Card } from "@mantine/core";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { FieldGroup, Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmPasswordInput from "./confirm-password";
const formSchema = z.object({
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(32, "Password must be at most 32 characters."),
	confirm_password: z.string("Must be the same as password").min(8),
});

const ResetStepper = () => {
	const { handleSubmit, control, getValues, formState } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});
	const confirm_password = getValues("confirm_password");
	const password = getValues("password");
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values);
		// const { data, error } = await authClient.signUp.email({
		// 	name: values.name, // required
		// 	email: values.email, // required
		// 	password: values.password, // required
		// 	callbackURL: process.env.BETTER_AUTH_URL + "/verify",
		// });
	};
	return (
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
							rules={{
								required: true,
								validate: (v, fv) => {
									return v === fv.password;
								},
							}}
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
									invalid={confirm_password == password}
									fieldState={fieldState}
								/>
							)}
						/>
						<FieldGroup>
							<Field>
								<Button type='submit' className='cursor-pointer'>
									Change Password
								</Button>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
};

export default ResetStepper;
