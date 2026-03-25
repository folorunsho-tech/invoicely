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
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import PasswordInput from "./password-input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "react-hook-form";

type Inputs = {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
};
export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<Inputs>();
	const onSubmit = async (values: Inputs) => {
		const { data, error } = await authClient.signUp.email({
			name: values.name, // required
			email: values.email, // required
			password: values.password, // required
			callbackURL: process.env.BETTER_AUTH_URL + "/verify",
		});
	};
	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor='name'>Full Name</FieldLabel>
							<Input
								id='name'
								type='text'
								placeholder='John Doe'
								required
								{...register("name", { required: true })}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='email'>Email</FieldLabel>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								required
								{...register("email", {
									required: true,
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/,
										message: `<p>${errors.email}</p>`,
									},
								})}
							/>
						</Field>
						<PasswordInput
							htmlFor='password'
							id='password'
							description='Must be at least 8 characters long.'
							required={true}
							label='Password'
							{...register("password", { required: true, minLength: 8 })}
						/>

						<PasswordInput
							label='Confirm Password'
							id='confirm-password'
							htmlFor='confirm-password'
							required={true}
							description='Please confirm your password.'
							{...register("confirm_password", {
								required: true,
								minLength: 8,
								validate: (value) => value == getValues("password"),
							})}
						/>

						<FieldGroup>
							<Field>
								<Button type='submit'>Create Account</Button>
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
	);
}
