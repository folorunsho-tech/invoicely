"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useInterval } from "@mantine/hooks";
import { authClient } from "@/lib/auth-client";
import toast from "@/lib/toaster";
export default function InputOTPForm() {
	const { data } = authClient.useSession();
	const router = useRouter();
	const [value, setValue] = useState("");
	const [invalid, setInvalid] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [seconds, setSeconds] = useState(60);
	const interval = useInterval(() => setSeconds((s) => s - 1), 1000, {
		autoInvoke: true,
	});

	useEffect(() => {
		if (seconds == 0) {
			interval.stop();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [seconds]);
	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Handle form submission, e.g., verify the OTP code
		if (!value || value.length !== 6) {
			setInvalid(true);
			return;
		} else {
			setInvalid(false);
			await authClient.emailOtp.checkVerificationOtp({
				email: data?.user?.email || "",
				otp: value,
				type: "email-verification",
				fetchOptions: {
					async onSuccess() {
						await authClient.emailOtp.verifyEmail({
							email: data?.user?.email || "",
							otp: value,
						});
						interval.stop();
						setIsSubmitting(false);
						router.push("/new-business");
					},
					onError(context) {
						setInvalid(true);
						setIsSubmitting(false);
						toast(context.error.message, "error");
					},
					onRequest() {
						setIsSubmitting(true);
					},
				},
			});
		}
	};
	return (
		<form className='pt-12 px-2' onSubmit={(e) => handleSubmit(e)}>
			<Card className='mx-auto max-w-md'>
				<CardHeader>
					<CardTitle>Verify your email</CardTitle>
					<CardDescription>
						Enter the verification code sent to your email address.
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
								onClick={async () => {
									setSeconds(60);
									interval.start();
									// timeout.start();
									await authClient.sendVerificationEmail({
										email: data?.user?.email || "",
										fetchOptions: {
											onError(context) {
												interval.stop();
												toast(context.error.message, "error");
											},
										},
									}); // Trigger resend of verification email
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
						<Button
							type='submit'
							className='w-full cursor-pointer'
							disabled={isSubmitting || !value}
						>
							{isSubmitting ? "Verifying..." : "Verify Code"}
						</Button>
						<div className='text-sm text-muted-foreground'>
							Having trouble verifying code?{" "}
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
}
