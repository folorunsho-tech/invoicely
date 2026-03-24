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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
export default function InputOTPForm() {
	const router = useRouter();
	const pathname = usePathname();
	const query = useSearchParams();
	const code = query.get("code");
	const email = query.get("email");
	const [value, setValue] = useState(code || "");
	const [invalid, setInvalid] = useState<boolean>(false);
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(query.toString());
			params.set(name, value);

			return params.toString();
		},
		[query],
	);
	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!value || value.length !== 6) {
			setInvalid(true);
			return;
		} else {
			setInvalid(false);
		}
		// Handle form submission, e.g., verify the OTP code
		console.log("Submitted OTP code:", value);
	};
	return (
		<form className='pt-12 px-2' onSubmit={(e) => handleSubmit(e)}>
			<Card className='mx-auto max-w-md'>
				<CardHeader>
					<CardTitle>Verify your email</CardTitle>
					<CardDescription>
						Enter the verification code sent to your email address:{" "}
						<span className='font-medium'>{email}</span>.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Field className='space-y-4'>
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
							value={value}
							onChange={(newVal) => {
								setValue(newVal);

								router.push(`${pathname}?${createQueryString("code", newVal)}`);
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
}
