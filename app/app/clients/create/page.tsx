"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import countriesList from "@/lib/country_state";
import { useMemo } from "react";
import { Select } from "@mantine/core";
import { postClient } from "@/lib/queries/client";
import { ArrowLeft } from "lucide-react";
const formSchema = z.object({
	name: z
		.string("Name is not correct")
		.min(3, "Name must be at least 3 characters.")
		.max(32, "Name must be at most 32 characters."),
	email: z.email("Email is not correct"),
	phone: z.string().min(10, "Phone number must be at least 10 characters."),
	address: z.string("Address must be valid"),
	city: z
		.string("City is not correct")
		.min(3, "City must be at least 3 characters.")
		.max(32, "City must be at most 32 characters."),
	country_state: z.string("Country - State must be valid"),
	postCode: z.string("Postal Code must be valid"),
});
const Page = () => {
	const queryClient = useQueryClient();
	const { handleSubmit, control, formState, reset } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});

	const mutation = useMutation({
		mutationFn: postClient,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["clients"] });
		},
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
		const country = values.country_state.split("_")[0];
		const state = values.country_state.split("_")[1];
		const data = {
			name: values.name,
			email: values.email,
			phone: values.phone,
			address: values.address,
			city: values.city,
			country,
			state,
			postCode: values.postCode,
		};
		await mutation.mutateAsync({
			data,
		});
		reset();
	};

	return (
		<main className='flex flex-col gap-4'>
			<Button asChild>
				<Link href={`/app/clients`} className='w-fit flex gap-2 items-center'>
					<ArrowLeft />
					Go back
				</Link>
			</Button>
			<section className='w-full '>
				<Card>
					<CardHeader>
						<CardTitle>Add Client</CardTitle>
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
											<FieldLabel htmlFor='name'>Client Name</FieldLabel>
											<Input
												disabled={formState.isSubmitting}
												id='name'
												type='text'
												placeholder='e.g john doe'
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
											<FieldLabel htmlFor='email'>Client Email</FieldLabel>
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
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor='phone'>Phone Number</FieldLabel>
											<Input
												disabled={formState.isSubmitting}
												id='phone'
												type='text'
												placeholder='e.g +23480567890776'
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
													placeholder='city....'
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
												<FieldLabel htmlFor='postcode'>Post Code</FieldLabel>
												<Input
													disabled={formState.isSubmitting}
													id='postcode'
													type='text'
													placeholder='postcode....'
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
													className='max-w-80'
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
											Add Client
										</Button>
										<Button
											asChild
											className='cursor-pointer'
											variant='destructive'
										>
											<Link href={`/app/clients`}>Cancel</Link>
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
