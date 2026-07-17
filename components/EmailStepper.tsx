"use client";
import { useEffect, useState } from "react";
import { Card } from "@mantine/core";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RefreshCwIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useInterval, useTimeout } from "@mantine/hooks";

const EmailStepper = ({ moveTo }: { moveTo: (to: number) => void }) => {
	const [value, setValue] = useState("");
	const [invalid, setInvalid] = useState<boolean>(false);
	const [seconds, setSeconds] = useState(0);
	const interval = useInterval(() => setSeconds((s) => s + 1), 1000, {
		autoInvoke: true,
	});
	const timeout = useTimeout(() => {
		interval.stop();
		setSeconds(0);
	}, 60000);
	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Handle form submission, e.g., verify the OTP code
		if (!value || value.length !== 6) {
			setInvalid(true);
			return;
		} else {
			setInvalid(false);
		}
		console.log("Submitted OTP code:", value);
	};
	useEffect(() => {
		timeout.start();
		return timeout.clear;
	}, []);
	return (
		<form onSubmit={() => moveTo(2)}>
			<Card>
				<CardHeader>
					<CardTitle>Verify your email</CardTitle>
					<CardDescription>
						Enter the verification code sent to your email address:{" "}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Field className='space-y-4'>
						<div className='flex items-center justify-between'>
							<FieldLabel htmlFor='otp-verification'>
								Verification code
							</FieldLabel>
							<Button
								variant='outline'
								size='xs'
								type='button'
								onClick={() => {
									interval.start();
									timeout.start();
								}}
								disabled={interval.active}
							>
								<RefreshCwIcon />
								{interval.active ? (
									<span className='text-sm'>Resend Code in {seconds}</span>
								) : (
									<span className='text-sm'>Resend Code</span>
								)}
							</Button>
						</div>
						<InputOTP
							maxLength={6}
							id='otp-verification'
							pattern={REGEXP_ONLY_DIGITS}
							required
							value={value}
							onChange={(newVal) => {
								setValue(newVal);
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
	);
};

export default EmailStepper;
