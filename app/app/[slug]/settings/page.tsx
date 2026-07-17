"use client";
import { authClient } from "@/lib/auth-client";

import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import toast from "@/lib/toaster";
import countriesList from "@/lib/country_state";
import { useEffect, useMemo } from "react";
import { Select } from "@mantine/core";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
	country_state: z.string("Country must be valid"),
	postCode: z.string("Postal Code must be valid"),
});
const Page = () => {
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const { handleSubmit, control, formState, reset } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const aCountry = values.country_state.split("_")[0];
		const state = values.country_state.split("_")[1];
		await authClient.organization.update({
			organizationId: activeOrganization?.id,
			data: {
				name: values.name,
				email: values.email,
				phone: values.phone,
				address: values.address,
				city: values.city,
				state,
				country: aCountry,
				postCode: values.postCode,
			},

			fetchOptions: {
				onError(context) {
					toast(context.error.message, "error");
				},
				async onSuccess() {
					toast("Organization updated successfully", "success");
					// router.push(`/app/${context.data?.slug}`);
				},
			},
		});
	};
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
	useEffect(() => {
		if (activeOrganization) {
			reset({
				name: activeOrganization?.name,
				email: activeOrganization?.email,
				phone: activeOrganization?.phone,
				address: activeOrganization?.address,
				city: activeOrganization?.city,
				country_state: `${activeOrganization?.country}_${activeOrganization?.state}`,
				postCode: activeOrganization?.postCode,
			});
		}
	}, [activeOrganization]);
	return (
		<main className='p-4'>
			<section className='w-full'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup className='flex gap-3'>
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
						<Field>
							<FieldLabel htmlFor='slug'>Business Slug</FieldLabel>
							<Input
								id='slug'
								type='text'
								placeholder={activeOrganization?.slug}
								disabled={true}
							/>
						</Field>
						<Controller
							name='email'
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='email'>Business Email</FieldLabel>
									<Input
										disabled={formState.isSubmitting}
										id='email'
										type='email'
										placeholder='m@example.com'
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
											// allowDeselect={false}
											searchable
											nothingFoundMessage='Nothing found...'
											data={countriesData}
										/>
									</Field>
								)}
							/>
							<Controller
								name='city'
								control={control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className='max-w-48'>
										<FieldLabel htmlFor='city'>City</FieldLabel>
										<Input
											disabled={formState.isSubmitting}
											id='city'
											type='text'
											placeholder='city....'
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
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid} className='max-w-48'>
										<FieldLabel htmlFor='postcode'>Post Code</FieldLabel>
										<Input
											disabled={formState.isSubmitting}
											id='postcode'
											type='text'
											placeholder='postcode....'
											{...field}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
						<FieldGroup>
							<Field orientation='horizontal' className='flex justify-end'>
								<Button
									type='submit'
									className='cursor-pointer'
									disabled={!formState.isReady || formState.isSubmitting}
								>
									Update Info
								</Button>
								<Button
									onClick={() => {
										reset();
									}}
									className='cursor-pointer'
									variant='destructive'
									type='button'
								>
									Cancel
								</Button>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</section>
		</main>
	);
};

export default Page;
