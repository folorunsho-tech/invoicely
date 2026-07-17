/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
	FieldSet,
	FieldSeparator,
	FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getInvoice, updateInvoice } from "@/lib/queries/invoice";
import { SyntheticEvent, useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import InvoicePreview from "@/components/InvoicePreview";
import { NumberFormatter, NumberInput } from "@mantine/core";
import { SelectDropdownSearch } from "@/components/SelectWithSearch";
import { v4 as uuidv4 } from "uuid";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { getCategories, postCategory } from "@/lib/queries/category";
import { InvoiceStatus } from "@/generated/prisma/enums";

const formSchema = z.object({
	issued_date: z.date("Invalid date"),
	due_date: z.date("Invalid date"),
	project_subject: z.string("Invalid description"),
	categoryId: z.string(),
	items: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			quantity: z.number(),
			rate: z.number(),
			total: z.number(),
		}),
	),
});
const Page = () => {
	const { slug, id }: { slug: string; id: string } = useParams();
	const queryClient = useQueryClient();
	const { control, formState, getValues, setValue, setValues } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
		defaultValues: {
			due_date: new Date(),
			issued_date: new Date(),
			project_subject: "",
			categoryId: "",
			items: [],
		},
	});
	const invoice = useQuery({
		queryKey: [`invoice-${id}`, "invoices"],
		queryFn: async () => {
			return await getInvoice({ id });
		},
	});
	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			return await getCategories();
		},
	});
	const categoryList = categories.data?.map(
		(c: { id: string; name: string }) => ({
			value: c?.id,
			label: c?.name,
		}),
	);
	const client: {
		id: string;
		name: string;
		address: string;
		postCode: string;
		city: string;
		country: string;
		state: string;
		email: string;
	} | null = invoice?.data?.client;
	const [selected, setSelected] = useState<string | null>(null);
	const [items, setItems] = useState<
		{
			id: string;
			name: string;
			quantity: number;
			rate: number;
			total: number;
		}[]
	>([]);
	const [project_subject, setProjectSubject] = useState<string>("");
	const [submitAllowed, setSubmitAllowed] = useState(false);
	const [itemId, setItemId] = useState<string>("");
	const [itemName, setItemName] = useState<string>("");
	const [itemQuantity, setItemQuantity] = useState<number | string>(0);
	const [itemRate, setItemRate] = useState<number | string>(0);
	const [preview, setPreview] = useState<any>(null);
	const [toDelete, setToDelete] = useState<
		{
			id: string;
		}[]
	>([]);
	const mutation = useMutation({
		mutationFn: updateInvoice,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({
				queryKey: [`invoice-${id}`, "invoices"],
			});
		},
	});
	const cmutation = useMutation({
		mutationFn: postCategory,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
	});

	const addItems = (e: SyntheticEvent) => {
		e.preventDefault();
		const notItem = items.filter((item) => item.id !== itemId);
		setItems([
			{
				id: itemId || uuidv4(),
				name: itemName,
				rate: Number(itemRate),
				quantity: Number(itemQuantity),
				total: Number(itemRate) * Number(itemQuantity),
			},
			...notItem,
		]);
		setValue(
			"items",
			[
				{
					id: itemId || uuidv4(),
					name: itemName,
					rate: Number(itemRate),
					quantity: Number(itemQuantity),
					total: Number(itemRate) * Number(itemQuantity),
				},
				...notItem,
			],
			{ shouldTouch: true, shouldDirty: true },
		);
		setItemId("");
		setItemName("");
		setItemQuantity(0);
		setItemRate(0);
	};
	const onSubmit = async (
		values: {
			issued_date: Date;
			due_date: Date;
			project_subject: string;
			categoryId: string | null;
			toDelete: {
				id: string;
			}[];
			items: {
				id: string;
				name: string;
				rate: number;
				quantity: number;
			}[];
			status?: InvoiceStatus;
			sendNotification?: boolean;
		},
		button: string,
	) => {
		if (button == "update") {
			await mutation.mutateAsync({ data: values, id });
		} else if (button == "send") {
			await mutation.mutateAsync({ data: values, id });
		}
	};

	const getPreview = () => {
		const category = categories.data?.find(
			(cat: { id: string }) => cat.id == selected,
		);
		setPreview({
			issued_date: getValues("issued_date"),
			due_date: getValues("due_date"),
			project_subject: getValues("project_subject"),
			category,
			items,
			client,
			organization: invoice.data?.organization,
			currency: invoice.data?.organization?.currencySymbol || "N",
			categoryId: selected,
			invoiceNumber: invoice.data.invoiceNumber,
		});
	};

	useEffect(() => {
		if (invoice?.data) {
			setValues({
				issued_date: new Date(invoice.data?.issued_date),
				due_date: new Date(invoice.data?.due_date),
				project_subject: invoice.data?.project_subject,
				categoryId: invoice.data.categoryId,
				items: invoice.data?.items,
			});
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setItems(invoice.data?.items);
			setProjectSubject(invoice.data?.project_subject);
			setSelected(invoice.data?.categoryId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [invoice.isLoading]);
	useEffect(() => {
		const isAllowed =
			project_subject !== invoice.data?.project_subject || formState.isDirty;
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSubmitAllowed(Boolean(isAllowed));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project_subject, selected, items]);

	return (
		<main className='flex flex-col gap-6'>
			<section className='flex items-center justify-between w-full sticky top-1 bg-white z-50 py-4 px-2 rounded-xl outline-1'>
				<Button asChild>
					<Link
						href={`/app/${slug}/invoices`}
						className='w-fit flex gap-2 items-center'
					>
						<ArrowLeft />
						Go back
					</Link>
				</Button>
				<InvoicePreview invoice={preview} getPreview={getPreview} />
			</section>
			<section className='w-full '>
				<Card>
					<CardHeader>
						<CardTitle>Edit #{invoice.data?.invoiceNumber}</CardTitle>
					</CardHeader>
					<CardContent>
						<form className='flex flex-col gap-6'>
							<FieldSet>
								<FieldLegend className='text-indigo-500 text-lg'>
									Bill From
								</FieldLegend>
								<div className='flex flex-wrap gap-2'>
									<Field
										data-invalid={!invoice.data?.organization?.name}
										className='max-w-60'
									>
										<FieldLabel htmlFor='address'>Address</FieldLabel>
										<Input
											disabled={true}
											value={invoice.data?.organization?.address}
											aria-invalid={!invoice.data?.organization?.address}
										/>
										{!invoice.data?.organization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business Name" }]}
											/>
										)}
									</Field>

									<Field
										data-invalid={!invoice.data?.organization?.city}
										className='max-w-60'
									>
										<FieldLabel htmlFor='city'>City</FieldLabel>
										<Input
											disabled={true}
											value={invoice.data?.organization?.city}
											aria-invalid={!invoice.data?.organization?.city}
										/>
										{!invoice.data?.organization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business City" }]}
											/>
										)}
									</Field>
									<Field
										data-invalid={!invoice.data?.organization?.state}
										className='max-w-60'
									>
										<FieldLabel htmlFor='state'>State</FieldLabel>
										<Input
											disabled={true}
											value={invoice.data?.organization?.state}
											aria-invalid={!invoice.data?.organization?.state}
										/>
										{!invoice.data?.organization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business State" }]}
											/>
										)}
									</Field>
									<Field
										data-invalid={!invoice.data?.organization?.postCode}
										className='max-w-28'
									>
										<FieldLabel htmlFor='postCode'>Post Code</FieldLabel>
										<Input
											disabled={true}
											value={invoice.data?.organization?.postCode}
											aria-invalid={!invoice.data?.organization?.postCode}
										/>
										{!invoice.data?.organization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business Post Code" }]}
											/>
										)}
									</Field>
									<Field
										data-invalid={!invoice.data?.organization?.country}
										className='max-w-60'
									>
										<FieldLabel htmlFor='postCode'>Country</FieldLabel>
										<Input
											disabled={true}
											value={invoice.data?.organization?.country}
											aria-invalid={!invoice.data?.organization?.country}
										/>
										{!invoice.data?.organization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business Country" }]}
											/>
										)}
									</Field>
								</div>
							</FieldSet>
							<FieldSeparator />
							<FieldSet>
								<FieldLegend className='text-indigo-500 text-lg'>
									Bill To
								</FieldLegend>

								<div className='flex flex-wrap gap-2'>
									<Field data-invalid={!client?.address} className='max-w-60'>
										<FieldLabel htmlFor='address'>Address</FieldLabel>
										<Input
											disabled={true}
											value={client?.address}
											aria-invalid={!client?.address}
										/>
										{!client?.address && (
											<FieldError
												errors={[{ message: "Invalid Client Address" }]}
											/>
										)}
									</Field>

									<Field data-invalid={!client?.city} className='max-w-60'>
										<FieldLabel htmlFor='city'>City</FieldLabel>
										<Input
											disabled={true}
											value={client?.city}
											aria-invalid={!client?.city}
										/>
										{!client?.address && (
											<FieldError
												errors={[{ message: "Invalid Client City" }]}
											/>
										)}
									</Field>
									<Field data-invalid={!client?.state} className='max-w-60'>
										<FieldLabel htmlFor='state'>State</FieldLabel>
										<Input
											disabled={true}
											value={client?.state}
											aria-invalid={!client?.state}
										/>
										{!client?.state && (
											<FieldError
												errors={[{ message: "Invalid Client State" }]}
											/>
										)}
									</Field>
									<Field data-invalid={!client?.postCode} className='max-w-28'>
										<FieldLabel htmlFor='postCode'>Post Code</FieldLabel>
										<Input
											disabled={true}
											value={client?.postCode}
											aria-invalid={!client?.postCode}
										/>
										{!client?.postCode && (
											<FieldError
												errors={[{ message: "Invalid Client Post Code" }]}
											/>
										)}
									</Field>
									<Field data-invalid={!client?.country} className='max-w-60'>
										<FieldLabel htmlFor='postCode'>Country</FieldLabel>
										<Input
											disabled={true}
											value={client?.country}
											aria-invalid={!client?.country}
										/>
										{!client?.country && (
											<FieldError
												errors={[{ message: "Invalid Client Country" }]}
											/>
										)}
									</Field>
								</div>
							</FieldSet>
							<FieldSeparator />
							<FieldSet>
								<FieldGroup className='flex w-full items-end flex-row'>
									<Controller
										name='issued_date'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field
												data-invalid={fieldState.invalid}
												className='w-max'
											>
												<FieldLabel htmlFor='issued_date'>
													Invoice Date
												</FieldLabel>

												<DatePickerInput
													placeholder='pick issued date'
													{...field}
													id='issued_date'
													w={155}
													onChange={(d) => {
														if (d) setValue("issued_date", new Date(d));
													}}
													aria-invalid={fieldState.invalid}
													disabled={formState.isSubmitting}
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
									<Controller
										name='due_date'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field
												data-invalid={fieldState.invalid}
												className='w-max'
											>
												<FieldLabel htmlFor='due_date'>Due Date</FieldLabel>

												<DatePickerInput
													placeholder='pick due date'
													{...field}
													id='due_date'
													w={155}
													onChange={(d) => {
														if (d) setValue("due_date", new Date(d));
													}}
													aria-invalid={fieldState.invalid}
													disabled={formState.isSubmitting}
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
									<Field className='max-w-72'>
										<FieldLabel>Invoice category</FieldLabel>
										<SelectDropdownSearch
											list={categoryList}
											selected={selected}
											setSelected={setSelected}
											usedIn='category'
											setValue={setValue}
											addNew={(name) => {
												cmutation.mutateAsync({
													name,
												});
											}}
										/>
									</Field>
								</FieldGroup>
								<Controller
									name='project_subject'
									control={control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor='project_subject'>
												Project / Subject
											</FieldLabel>
											<Input
												disabled={formState.isSubmitting}
												id='project_subject'
												placeholder="John's Doe website"
												{...field}
												onChange={(e) => {
													setProjectSubject(e.currentTarget.value);
													setValue("project_subject", e.currentTarget.value, {
														shouldDirty: true,
														shouldTouch: true,
													});
												}}
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldSet>
							<FieldSet
								onKeyDown={(e) => {
									if (e.key == "Enter") {
										addItems(e);
									}
								}}
							>
								<FieldLegend className='text-indigo-500 text-lg'>
									Invoice Items
								</FieldLegend>
								<FieldGroup className='grid grid-cols-4 items-end'>
									<Field>
										<FieldLabel htmlFor='item_name'>Item Name</FieldLabel>
										<Input
											disabled={formState.isSubmitting}
											id='item_name'
											placeholder='Website design'
											value={itemName}
											onChange={(e) => {
												setItemName(e.currentTarget.value);
											}}
										/>
									</Field>

									<Field>
										<FieldLabel htmlFor='item_quantity'>
											Item Quantity
										</FieldLabel>
										<NumberInput
											disabled={formState.isSubmitting}
											id='item_quantity'
											placeholder='e.g. 1'
											value={itemQuantity}
											thousandSeparator
											onChange={(v) => {
												setItemQuantity(v);
											}}
										/>
									</Field>

									<Field>
										<FieldLabel htmlFor='item_rate'>Item Rate</FieldLabel>
										<NumberInput
											disabled={formState.isSubmitting}
											id='item_rate'
											placeholder='e.g. 15.00'
											value={itemRate}
											thousandSeparator
											prefix={invoice.data?.organization?.currencySymbol}
											onChange={(v) => {
												setItemRate(v);
											}}
										/>
									</Field>
									<Button
										className='cursor-pointer'
										onClick={(e) => {
											addItems(e);
										}}
										type='button'
										disabled={!itemName}
									>
										Add / Update item
									</Button>
								</FieldGroup>
								<Table>
									<TableHeader className='bg-muted'>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Quantity</TableHead>
											<TableHead>Rate</TableHead>
											<TableHead>Total</TableHead>
											<TableHead></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody className=''>
										{items?.length ? (
											<>
												{items?.map((item) => (
													<TableRow
														key={item.id}
														className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
													>
														<TableCell>{item.name}</TableCell>
														<TableCell>
															<NumberFormatter value={item.quantity} />
														</TableCell>
														<TableCell>
															<NumberFormatter
																prefix={
																	invoice.data?.organization?.currencySymbol
																}
																value={item.rate}
																thousandSeparator
															/>
														</TableCell>
														<TableCell>
															<NumberFormatter
																prefix={
																	invoice.data?.organization?.currencySymbol
																}
																value={item.total}
																thousandSeparator
															/>
														</TableCell>
														<TableCell className='gap-3 justify-self-end flex items-center'>
															<Button
																type='button'
																onClick={() => {
																	const itemF = items.find(
																		(it) => it.id == item.id,
																	);
																	setItemId(itemF?.id ?? "");
																	setItemName(itemF?.name ?? "");
																	setItemQuantity(itemF?.quantity ?? 0);
																	setItemRate(itemF?.rate ?? 0);
																}}
																variant='green'
																color='teal'
															>
																<Pencil />
															</Button>
															<Button
																type='button'
																onClick={() => {
																	setToDelete((prev) => [
																		...prev,
																		{ id: item.id },
																	]);
																	const remainder = items.filter(
																		(it) => it.id !== item.id,
																	);
																	setValue("items", remainder, {
																		shouldDirty: true,
																		shouldTouch: true,
																	});
																	setItems(remainder);
																}}
																variant='destructive'
															>
																<Trash />
															</Button>
														</TableCell>
													</TableRow>
												))}
											</>
										) : (
											<TableRow>
												<TableCell colSpan={5} className='h-24 text-center'>
													No item listed.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</FieldSet>
							<FieldGroup>
								<Field
									orientation='horizontal'
									className='flex justify-between'
								>
									<Button
										asChild
										className='cursor-pointer'
										variant='destructive'
									>
										<Link href={`/app/${slug}/invoices`}>Discard</Link>
									</Button>
									<div className='flex gap-2 items-center'>
										<Button
											id='update'
											variant={`outline`}
											onClick={(e) => {
												e.preventDefault();
												onSubmit(
													{
														issued_date: getValues("issued_date"),
														due_date: getValues("due_date"),
														project_subject: getValues("project_subject"),
														items: items.map((item) => ({
															id: item.id,
															name: item.name,
															quantity: item.quantity,
															rate: item.rate,
															total: item.rate * item.quantity,
														})),
														categoryId: selected,
														status: invoice.data?.status,
														sendNotification: false,
														toDelete,
													},
													"update",
												);
											}}
											className='cursor-pointer'
											disabled={!formState.isDirty || formState.isSubmitting}
										>
											Update
										</Button>
										<Button
											id='send'
											onClick={(e) => {
												e.preventDefault();
												onSubmit(
													{
														issued_date: getValues("issued_date"),
														due_date: getValues("due_date"),
														project_subject: getValues("project_subject"),
														items: items.map((item) => ({
															id: item.id,
															name: item.name,
															quantity: item.quantity,
															rate: item.rate,
															total: item.rate * item.quantity,
														})),
														categoryId: selected,
														sendNotification: true,
														status: "PENDING",
														toDelete,
													},
													"send",
												);
											}}
											className='cursor-pointer'
											disabled={!submitAllowed || formState.isSubmitting}
										>
											Update & Send
										</Button>
									</div>
								</Field>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</section>
		</main>
	);
};

export default Page;
