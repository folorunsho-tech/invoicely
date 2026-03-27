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
import ConfirmPasswordInput from "@/components/confirm-password";

const formSchema = z.object({
	name: z
		.string()
		.min(3, "Name must be at least 3 characters.")
		.max(32, "Name must be at most 32 characters."),
	email: z.email("Email is not correct"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(32, "Password must be at most 32 characters."),
	confirm_password: z.string("Must be the same as password").min(8),
});
export default function Page() {
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
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<Card>
					<CardHeader>
						<CardTitle>Create an account</CardTitle>
						<CardDescription>
							Enter your information below to create your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldGroup>
								<Controller
									name='name'
									control={control}
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor='name'>Full Name</FieldLabel>
											<Input
												{...field}
												id='name'
												type='text'
												placeholder='John Doe'
												required
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
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
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
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
										<Button type='submit' disabled={!formState.isValid}>
											Create Account
										</Button>
										{/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
										<FieldDescription className='px-6 text-center'>
											Already have an account?{" "}
											<Link href='/auth/signin'>Sign in</Link>
										</FieldDescription>
									</Field>
								</FieldGroup>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
