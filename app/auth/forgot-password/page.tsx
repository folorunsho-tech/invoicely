"use client";
import { useState } from "react";
import { Stepper, Container, Card, Input } from "@mantine/core";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RefreshCwIcon } from "lucide-react";
import PasswordInput from "@/components/password-input";

export default function ForgotPassword() {
	const [active, setActive] = useState(0);
	const [otp, setOTP] = useState("");
	const [invalid, setInvalid] = useState<boolean>(false);
	const moveTo = (to: number) => setActive(to);

	return (
		<Container className='py-6 md:w-[50%] space-y-6'>
			<h2 className='text-center text-2xl'>Invoicely</h2>
			<Stepper active={active} color='violet'>
				<Stepper.Step label='Input Email' description='Input your email'>
					<div className={"flex flex-col gap-6"}>
						<Card>
							<CardHeader>
								<CardTitle>Request Verification Code</CardTitle>
								<CardDescription>
									Enter your email below to request a verification code
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={() => moveTo(1)}>
									<FieldGroup>
										<Field>
											<FieldLabel htmlFor='email'>Email</FieldLabel>
											<Input
												id='email'
												type='email'
												placeholder='m@example.com'
												required
												error='Please enter a valid email address'
											/>
											<FieldError>
												Please enter a valid email address
											</FieldError>
										</Field>

										<Field>
											<Button type='submit'>Request Code</Button>
										</Field>
									</FieldGroup>
								</form>
							</CardContent>
						</Card>
					</div>
				</Stepper.Step>
				<Stepper.Step label='Verify Email' description='Verify your email'>
					<form className='' onSubmit={() => moveTo(2)}>
						<Card className=''>
							<CardHeader>
								<CardTitle>Verify your email</CardTitle>
								<CardDescription>
									Enter the verification code sent to your email address:{" "}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Field className=''>
									<div className='flex items-center justify-between'>
										<FieldLabel htmlFor='otp-verification'>
											Verification code
										</FieldLabel>
										<Button variant='outline' size='xs' type='button'>
											<RefreshCwIcon />
											<span className='text-sm'>Resend Code</span>
										</Button>
									</div>
									<InputOTP
										maxLength={6}
										id='otp-verification'
										pattern={REGEXP_ONLY_DIGITS}
										required
										value={otp}
										onChange={(value) => {
											setOTP(value);
										}}
									>
										<InputOTPGroup className='mx-auto my-4 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'>
											<InputOTPSlot index={0} aria-invalid={invalid} />
											<InputOTPSlot index={1} aria-invalid={invalid} />
											<InputOTPSlot index={2} aria-invalid={invalid} />
											<InputOTPSlot index={3} aria-invalid={invalid} />
											<InputOTPSlot index={4} aria-invalid={invalid} />
											<InputOTPSlot index={5} aria-invalid={invalid} />
										</InputOTPGroup>
									</InputOTP>
									{/* <FieldDescription>
							<a href='#'>I no longer have access to this email address.</a>
						</FieldDescription> */}
								</Field>
							</CardContent>
							<CardFooter>
								<Field>
									<Button type='submit' className='w-full cursor-pointer'>
										Verify
									</Button>
									<div className='text-sm text-muted-foreground'>
										Having trouble signing in?{" "}
										<a
											href='#'
											className='underline underline-offset-4 transition-colors hover:text-primary'
										>
											Contact support
										</a>
									</div>
								</Field>
							</CardFooter>
						</Card>
					</form>
				</Stepper.Step>
				<Stepper.Step label='Reset Password' description='Reset your password'>
					<Card>
						<CardHeader>
							<CardTitle>Reset Password</CardTitle>
							<CardDescription>Enter your new password below</CardDescription>
						</CardHeader>
						<CardContent>
							<form>
								<FieldGroup>
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
											<Button type='submit' className='cursor-pointer'>
												Change Password
											</Button>
										</Field>
									</FieldGroup>
								</FieldGroup>
							</form>
						</CardContent>
					</Card>
				</Stepper.Step>
				<Stepper.Completed>
					Completed, click back button to get to previous step
				</Stepper.Completed>
			</Stepper>
		</Container>
	);
}
