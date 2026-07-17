"use client";
import { useState } from "react";
import { Stepper, Container, Card, Input } from "@mantine/core";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import EmailStepper from "@/components/EmailStepper";
import ResetStepper from "@/components/ResetStepper";
import { useRouter } from "next/navigation";
const formSchema = z.object({
	email: z.email("Email is not correct"),
});

export default function ForgotPassword() {
	const router = useRouter();
	const [active, setActive] = useState(0);
	const moveTo = (to: number) => setActive(to);
	const { handleSubmit, control } = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const { data, error } = await authClient.requestPasswordReset({
			email: values.email,
		});
		// if(data?.status==200)
		moveTo(1);
	};
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
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>

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
					<EmailStepper moveTo={moveTo} />
				</Stepper.Step>
				<Stepper.Step label='Reset Password' description='Reset your password'>
					<ResetStepper />
				</Stepper.Step>
				<Stepper.Completed>
					<h2>Password successfuly reseted</h2>
					<Button
						onClick={() => {
							router.push("/auth/signin");
						}}
					>
						Login
					</Button>
				</Stepper.Completed>
			</Stepper>
		</Container>
	);
}
