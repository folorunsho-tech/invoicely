"use client";
import { Container } from "@mantine/core";
import {
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	Card,
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
import toast from "@/lib/toaster";
import { Input } from "@/components/ui/input";
const formSchema = z.object({
	email: z.email("Email is not correct"),
});

export default function ForgotPassword() {
	const { handleSubmit, control } = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await authClient.requestPasswordReset({
			email: values.email,
			redirectTo: `/auth/reset-password`,
			fetchOptions: {
				onError(context) {
					toast(context.error.message, "error");
				},
				onSuccess() {
					toast("Pasword reset link sent to provided email", "success");
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
						<CardTitle>Request reset link</CardTitle>
						<CardDescription>
							Enter your email below to request a reset link
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
									<Button type='submit'>Request Link</Button>
								</Field>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</Container>
	);
}
