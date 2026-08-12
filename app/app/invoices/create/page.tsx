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
import { postInvoice } from "@/lib/queries/invoice";
import { authClient } from "@/lib/auth-client";
import { getClients } from "@/lib/queries/client";
import { SyntheticEvent, useState } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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

const formSchema = z.object({
	issued_date: z.date("Invalid date"),
	due_date: z.date("Invalid date"),
	project_subject: z.string("Invalid description"),
	clientId: z.string(),
});
const Page = () => {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const queryClient = useQueryClient();
	const { control, formState, reset, getValues, setValue } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
		defaultValues: {
			due_date: new Date(),
			issued_date: new Date(),
			project_subject: "",
			clientId: "",
		},
	});
	const clients = useQuery({
		queryKey: ["clients"],
		queryFn: async () => {
			return await getClients();
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
	const clientsList = clients.data?.map((c: { id: string; name: string }) => ({
		value: c?.id,
		label: c?.name,
	}));
	const [selected, setSelected] = useState<string | null>(null);
	const [client, setClient] = useState<{
		id: string;
		name: string;
		address: string;
		postCode: string;
		city: string;
		country: string;
		state: string;
		email: string;
	} | null>(null);
	const [preview, setPreview] = useState<any>(null);
	const [items, setItems] = useState<
		{
			id: string;
			name: string;
			quantity: number;
			rate: number;
			total: number;
		}[]
	>([]);
	const [itemId, setItemId] = useState<string>("");
	const [itemName, setItemName] = useState<string>("");
	const [itemQuantity, setItemQuantity] = useState<number | string>(0);
	const [itemRate, setItemRate] = useState<number | string>(0);
	const mutation = useMutation({
		mutationFn: postInvoice,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["invoices"] });
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
			clientId: string;
			categoryId: string | null;
			items: {
				id: string;
				name: string;
				rate: number;
				quantity: number;
				total: number;
			}[];
			status?: string;
		},
		button: string,
	) => {
		if (button == "draft") {
			await mutation.mutateAsync({ ...values, status: "DRAFT" });
			// console.log("draft", values);
		} else if (button == "send") {
			await mutation.mutateAsync(values);
		} else if (button == "save") {
		}
		reset({
			due_date: new Date(),
			issued_date: new Date(),
			project_subject: "",
			clientId: "",
		});
		setClient(null);
		setSelected(null);
		setItems([]);
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
			organization: activeOrganization,
			currency: activeOrganization?.currencySymbol || "N",
			categoryId: selected,
			clientId: getValues("clientId"),
		});
	};

	return (
		<main className='flex flex-col gap-6'>
			<section className='flex items-center justify-between w-full sticky top-1 bg-white z-50 py-4 px-2 rounded-xl outline-1'>
				<Button asChild>
					<Link
						href={`/app/invoices`}
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
						<CardTitle>Add Invoice</CardTitle>
					</CardHeader>
					<CardContent>
						<form className='flex flex-col gap-6'>
							<FieldSet>
								<FieldLegend className='text-indigo-500 text-lg'>
									Bill From
								</FieldLegend>
								<div className='flex flex-wrap gap-2'>
									<Field
										data-invalid={!activeOrganization?.name}
										className='max-w-60'
									>
										<FieldLabel htmlFor='address'>Address</FieldLabel>
										<Input
											disabled={true}
											value={activeOrganization?.address}
											aria-invalid={!activeOrganization?.address}
										/>
										{!activeOrganization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business Name" }]}
											/>
										)}
									</Field>

									<Field
										data-invalid={!activeOrganization?.city}
										className='max-w-60'
									>
										<FieldLabel htmlFor='city'>City</FieldLabel>
										<Input
											disabled={true}
											value={activeOrganization?.city}
											aria-invalid={!activeOrganization?.city}
										/>
										{!activeOrganization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business City" }]}
											/>
										)}
									</Field>
									<Field
										data-invalid={!activeOrganization?.state}
										className='max-w-60'
									>
										<FieldLabel htmlFor='state'>State</FieldLabel>
										<Input
											disabled={true}
											value={activeOrganization?.state}
											aria-invalid={!activeOrganization?.state}
										/>
										{!activeOrganization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business State" }]}
											/>
										)}
									</Field>
									<Field
										data-invalid={!activeOrganization?.postCode}
										className='max-w-28'
									>
										<FieldLabel htmlFor='postCode'>Post Code</FieldLabel>
										<Input
											disabled={true}
											value={activeOrganization?.postCode}
											aria-invalid={!activeOrganization?.postCode}
										/>
										{!activeOrganization?.address && (
											<FieldError
												errors={[{ message: "Invalid Business Post Code" }]}
											/>
										)}
									</Field>
									<Field
										data-invalid={!activeOrganization?.country}
										className='max-w-60'
									>
										<FieldLabel htmlFor='postCode'>Country</FieldLabel>
										<Input
											disabled={true}
											value={activeOrganization?.country}
											aria-invalid={!activeOrganization?.country}
										/>
										{!activeOrganization?.address && (
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
								<Controller
									name='clientId'
									control={control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<Select
												aria-invalid={fieldState.invalid}
												onValueChange={(v) => {
													setValue("clientId", v);
													const cl = clients.data?.find(
														(c: { id: string }) => c.id == v,
													);
													setClient(cl);
												}}
												{...field}
												disabled={formState.isSubmitting}
											>
												<SelectTrigger className='w-full max-w-48'>
													<SelectValue
														placeholder={client?.name || "Select Client"}
													/>
												</SelectTrigger>
												<SelectContent align='end' id='clientId'>
													<SelectGroup>
														<SelectLabel>Clients</SelectLabel>
														{clientsList?.map(
															(item: { value: string; label: string }) => (
																<SelectItem key={item.value} value={item.value}>
																	{item.label}
																</SelectItem>
															),
														)}
													</SelectGroup>
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
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
											prefix={activeOrganization?.currencySymbol}
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
										Add item
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
																prefix={activeOrganization?.currencySymbol}
																value={item.rate}
																thousandSeparator
															/>
														</TableCell>
														<TableCell>
															<NumberFormatter
																prefix={activeOrganization?.currencySymbol}
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
																	const remainder = items.filter(
																		(it) => it.name !== item.name,
																	);
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
										<Link href={`/app/invoices`}>Discard</Link>
									</Button>
									<div className='flex gap-2 items-center'>
										<Button
											id='draft'
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
															total: item.quantity * item.rate,
														})),
														categoryId: selected,
														clientId: getValues("clientId"),
														status: "DRAFT",
													},
													"draft",
												);
											}}
											className='cursor-pointer'
											disabled={!formState.isValid || formState.isSubmitting}
										>
											Save as Draft
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
															total: item.quantity * item.rate,
														})),
														categoryId: selected,
														clientId: getValues("clientId"),
													},
													"send",
												);
											}}
											className='cursor-pointer'
											disabled={!formState.isValid || formState.isSubmitting}
										>
											Save & Send
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
