"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "@/lib/toaster";
import countriesList from "@/lib/country_state";
import { useMemo } from "react";
import { Select } from "@mantine/core";
import generateOrgCode from "@/lib/generateOrgCode";
const formSchema = z.object({
	name: z
		.string("Invalid Name")
		.min(3, "Name must be at least 3 characters.")
		.max(32, "Name must be at most 32 characters."),
	email: z.email("Email is not correct"),
	phone: z
		.string("Phone must be valid")
		.min(10, "Phone number must be at least 10 characters."),
	address: z.string("Address must be valid"),
	city: z.string("City must be valid"),
	country_state: z.string("Country - State must be valid"),
	postCode: z.string("Postal Code must be valid"),
});

const Page = () => {
	const router = useRouter();

	const { handleSubmit, control, formState } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		// mode: "onBlur",
	});
	const countriesData = useMemo(() => {
		return countriesList.map((country) => {
			return {
				group: country.name,
				items: country.stateProvinces.map((state) => {
					return {
						label: `${country.name} - ${state.name}`,
						value: `${country.name}_${state.name}`,
					};
				}),
			};
		});
	}, []);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const code = await generateOrgCode(values.name, 5);
		const aCountry = values.country_state.split("_")[0];
		const state = values.country_state.split("_")[1];

		const country = countriesList?.find((country) => country.name == aCountry);

		await authClient.organization.create({
			name: values.name,
			slug: values.name.toLowerCase().replace(/\s+/g, "-"),
			email: values.email,
			phone: values.phone,
			address: values.address,
			postCode: values.postCode,
			state,
			country: aCountry,
			city: values.city,
			currency: country?.currency || "NGN",
			currencyPos: "left",
			currencySymbol: country?.symbol || "\u20A6",
			code,
			fetchOptions: {
				onError(context) {
					toast(context.error.message, "error");
				},
				async onSuccess(context) {
					await authClient.organization.setActive({
						organizationId: context.data?.id,
					});
					toast("Organization created successfully", "success");
					router.push(`/app/`); // Redirect to the organization's page after successful creation
				},
			},
		});
	};
	return (
		<main className='p-4 flex justify-center'>
			<section className='w-full max-w-lg'>
				<Card>
					<CardHeader>
						<CardTitle>Create a business</CardTitle>
						<CardDescription>
							Enter your information below to create your business
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
									name='email'
									control={control}
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor='email'>Business Email</FieldLabel>
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
									name='phone'
									control={control}
									rules={{ required: false }}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
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
												// className='max-w-64'
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
										name='country_state'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='country_state'>
													Country - Sate
												</FieldLabel>
												<Select
													disabled={formState.isSubmitting}
													required
													{...field}
													aria-invalid={fieldState.invalid}
													placeholder='Select a country - state'
													error={formState.errors.country_state?.message}
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
								<FieldGroup>
									<Field orientation='horizontal' className='flex justify-end'>
										<Button
											type='submit'
											className='cursor-pointer'
											disabled={!formState.isValid || formState.isSubmitting}
										>
											Create Business
										</Button>
										<Button
											className='cursor-pointer'
											variant='destructive'
											type='button'
											disabled={formState.isSubmitting}
											onClick={() => {
												router.push("/app");
											}}
										>
											Cancel
										</Button>
									</Field>
								</FieldGroup>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</section>
		</main>
	);
};

export default Page;
