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
import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getCategory, updateCategory } from "@/lib/queries/category";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
const formSchema = z.object({
	name: z
		.string("Name is not correct")
		.min(3, "Name must be at least 3 characters.")
		.max(32, "Name must be at most 32 characters."),
	// slug: z
	// 	.string("Slug is not valid")
	// 	.min(3, "Slug must be at least 3 characters.")
	// 	.max(32, "Slug must be at most 32 characters."),
	description: z.string().optional(),
});
const Page = () => {
	const queryClient = useQueryClient();
	const { slug, id }: { slug: string; id: string } = useParams();
	const category = useQuery({
		queryKey: ["client", id],
		queryFn: async () => {
			return await getCategory({ id });
		},
	});
	const { handleSubmit, control, formState, reset } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});

	const mutation = useMutation({
		mutationFn: updateCategory,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});
	useEffect(() => {
		if (category.data) {
			reset({
				name: category.data.name,
				// slug: category.data.slug,
				description: category.data.description,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, category.data]);
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await mutation.mutateAsync({
			id,
			data: {
				name: values.name,
				description: values.description,
				// slug: values.slug,
			},
		});
	};

	return (
		<main className='flex flex-col gap-4'>
			<Button asChild>
				<Link
					href={`/app/${slug}/categories`}
					className='w-fit flex gap-2 items-center'
				>
					<ArrowLeft />
					Go back
				</Link>
			</Button>
			<section className='w-full '>
				<Card>
					<CardHeader>
						<CardTitle>Update Client</CardTitle>
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
											<FieldLabel htmlFor='name'>Category Name</FieldLabel>
											<Input
												disabled={formState.isSubmitting}
												id='name'
												type='text'
												placeholder='e.g web development'
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

								{/* <Controller
									name='slug'
									control={control}
									rules={{ required: true }}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor='slug'>Category Slug</FieldLabel>
											<Input
												disabled={formState.isSubmitting}
												id='slug'
												type='text'
												placeholder='e.g web-development'
												required
												{...field}
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/> */}
								<Controller
									name='description'
									control={control}
									rules={{ required: false }}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor='description'>
												Category Description
											</FieldLabel>
											<Textarea
												disabled={formState.isSubmitting}
												id='description'
												placeholder='e.g A category for web development invoices'
												{...field}
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<FieldGroup>
									<Field orientation='horizontal' className='flex justify-end'>
										<Button
											type='submit'
											className='cursor-pointer'
											disabled={!formState.isValid || formState.isSubmitting}
										>
											Update Category
										</Button>
										<Button
											asChild
											className='cursor-pointer'
											variant='destructive'
										>
											<Link href={`/app/${slug}/categories`}>Cancel</Link>
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
