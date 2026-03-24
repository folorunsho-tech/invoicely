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

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
				<CardDescription>
					Enter your information below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor='name'>Full Name</FieldLabel>
							<Input id='name' type='text' placeholder='John Doe' required />
						</Field>
						<Field>
							<FieldLabel htmlFor='email'>Email</FieldLabel>
							<Input
								id='email'
								type='email'
								placeholder='m@example.com'
								required
							/>
						</Field>
						<PasswordInput
							htmlFor='password'
							id='password'
							description='Must be at least 8 characters long.'
							required={true}
							label='Password'
						/>

						<PasswordInput
							label='Confirm Password'
							id='confirm-password'
							htmlFor='confirm-password'
							required={true}
							description='Please confirm your password.'
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
