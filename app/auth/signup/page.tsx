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
	FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import PasswordInput from "@/components/password-input";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmPasswordInput from "@/components/confirm-password";
import toast from "@/lib/toaster";
import { useRouter } from "next/navigation";
import { states } from "@/lib/country_state";
import generateOrgCode from "@/lib/generateOrgCode";
import { Select } from "@mantine/core";
import { useMemo } from "react";
import { randomId } from "@mantine/hooks";
import { signupAllowed } from "@/lib/queries/organization";
import { useQuery } from "@tanstack/react-query";
const formSchema = z
	.object({
		fullname: z
			.string()
			.min(3, "Name must be at least 3 characters.")
			.max(32, "Name must be at most 32 characters."),
		username: z
			.string()
			.min(3, "Name must be at least 3 characters.")
			.max(32, "Name must be at most 32 characters."),
		email: z.email("Email is not correct"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(32, "Password must be at most 32 characters."),
		confirm_password: z
			.string()
			.min(8, "Password must be at least 8 characters"),
		businessname: z
			.string("Invalid Name")
			.min(3, "Name must be at least 3 characters.")
			.max(32, "Name must be at most 32 characters."),
		businessemail: z.email("Email is not correct"),
		phone: z
			.string("Phone must be valid")
			.min(10, "Phone number must be at least 10 characters."),
		address: z.string("Address must be valid"),
		city: z.string("City must be valid"),
		state: z.string("State must be valid"),
		postCode: z.string("Postal Code must be valid"),
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ["confirm_password"],
		message: "Passwords must match",
	});

export default function Page() {
	const router = useRouter();
	const response = useQuery({
		queryKey: ["isAllowed"],
		queryFn: async () => {
			return await signupAllowed();
		},
	});
	const countriesData = useMemo(() => {
		return states.map((state) => {
			return state.name;
		});
	}, []);
	const { handleSubmit, control, formState } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		// mode: "onBlur",
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (response?.data?.isAllowed == true) {
			const code = await generateOrgCode(values.businessname, 5);
			const slug = randomId(values.businessname.split(" ").join("-"));
			await authClient.signUp.email({
				name: values.fullname, // required
				email: values.email, // required
				password: values.password, // required
				username: values.username,
				displayUsername: values.username,
				fetchOptions: {
					onError(context) {
						toast(context.error.message, "error");
					},
					async onSuccess() {
						await authClient.organization.create({
							name: values.businessname,
							slug,
							email: values.businessemail,
							phone: values.phone,
							address: values.address,
							postCode: values.postCode,
							state: values.state,
							country: "Nigeria",
							city: values.city,
							currency: "NGN",
							currencySymbol: "\u20A6",
							code,
							fetchOptions: {
								onError(context) {
									toast(context.error.message, "error");
								},
								async onSuccess(context) {
									await authClient.organization.setActive({
										organizationId: context.data?.id,
									});
									toast("Business and account created successfully", "success");
									router.push(`/app`); // Redirect to the organization's page after successful creation
								},
							},
						});
					},
				},
			});
		} else {
			toast("You are not allowed to signup", "error");
		}
	};

	return (
		<div className='flex min-h-svh w-full items-center justify-center'>
			<div className='w-full max-w-2xl'>
				<Card>
					<CardHeader>
						<CardTitle>Signup your account and business</CardTitle>
						<CardDescription>
							Enter your information below to create your account and business
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldSet className='mb-3'>
								<FieldLabel>Account Information</FieldLabel>
								<div className='flex gap-3 flex-wrap '>
									<Controller
										name='fullname'
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
													disabled={formState.isSubmitting}
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
										name='username'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid} className='w-80'>
												<FieldLabel htmlFor='name'>Username</FieldLabel>
												<Input
													{...field}
													id='username'
													type='text'
													placeholder='john_doe'
													disabled={formState.isSubmitting}
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
											<Field data-invalid={fieldState.invalid} className='w-68'>
												<FieldLabel htmlFor='email'>Email</FieldLabel>
												<Input
													disabled={formState.isSubmitting}
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
												className='w-74'
												disabled={formState.isSubmitting}
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
										}}
										render={({ field, fieldState }) => (
											<ConfirmPasswordInput
												className='w-74'
												disabled={formState.isSubmitting}
												htmlFor='confirm-password'
												id='confirm-password'
												description='Please confirm your password.'
												required={true}
												label='Confirm Password'
												data-invalid={fieldState.invalid}
												aria-invalid={fieldState.invalid}
												field={field}
												fieldState={fieldState}
											/>
										)}
									/>
								</div>
							</FieldSet>
							<FieldSet>
								<FieldLabel>Business Information</FieldLabel>
								<div className='flex flex-wrap gap-3'>
									<Controller
										name='businessname'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid} className='w-80'>
												<FieldLabel htmlFor='name'>Business Name</FieldLabel>
												<Input
													disabled={formState.isSubmitting}
													id='name'
													type='text'
													placeholder='e.g google'
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
										name='businessemail'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid} className='w-74'>
												<FieldLabel htmlFor='businessemail'>
													Business Email
												</FieldLabel>
												<Input
													disabled={formState.isSubmitting}
													id='businessemail'
													type='businessemail'
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
										name='phone'
										control={control}
										rules={{ required: false }}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid} className='w-74'>
												<FieldLabel htmlFor='phone'>Phone Number</FieldLabel>
												<Input
													disabled={formState.isSubmitting}
													id='phone'
													type='text'
													placeholder='e.g +23480567890776'
													{...field}
													aria-invalid={fieldState.invalid}
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
									<div className='flex gap-4 items-center flex-wrap'>
										<Controller
											name='address'
											control={control}
											rules={{ required: true }}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={fieldState.invalid}
													className='max-w-78'
												>
													<FieldLabel htmlFor='address'>Address</FieldLabel>
													<Input
														disabled={formState.isSubmitting}
														id='address'
														type='text'
														placeholder='address...'
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
											name='city'
											control={control}
											rules={{ required: true }}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={fieldState.invalid}
													className='max-w-48'
												>
													<FieldLabel htmlFor='city'>City</FieldLabel>
													<Input
														disabled={formState.isSubmitting}
														id='city'
														type='text'
														placeholder='city...'
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
											name='postCode'
											control={control}
											rules={{ required: true }}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={fieldState.invalid}
													className='max-w-48'
												>
													<FieldLabel htmlFor='postcode'>
														Post Code / Zip
													</FieldLabel>
													<Input
														disabled={formState.isSubmitting}
														id='postcode'
														type='text'
														placeholder='postcode...'
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
											name='state'
											control={control}
											rules={{ required: true }}
											render={({ field, fieldState }) => (
												<Field
													data-invalid={fieldState.invalid}
													className='max-w-74'
												>
													<FieldLabel htmlFor='state'>State</FieldLabel>
													<Select
														disabled={formState.isSubmitting}
														required
														{...field}
														aria-invalid={fieldState.invalid}
														placeholder='Select a state'
														error={formState.errors.state?.message}
														checkIconPosition='right'
														allowDeselect={false}
														searchable
														nothingFoundMessage='Nothing found...'
														data={countriesData}
													/>
												</Field>
											)}
										/>
									</div>
								</div>
							</FieldSet>
							<FieldGroup className='mt-6'>
								<Field>
									<Button
										type='submit'
										className='cursor-pointer'
										disabled={!formState.isValid || formState.isSubmitting}
									>
										Signup
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
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
