"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getInvoicesSimple } from "@/lib/queries/invoice";
import { postPayment } from "@/lib/queries/payment";
import { Label } from "@/components/ui/label";
import { NumberFormatter, NumberInput, Select } from "@mantine/core";
import {
	Category,
	Client,
	Invoice,
	Item,
	Organization,
} from "@/generated/prisma/client";
import { banks, chains } from "@/lib/banks";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { DatePickerInput } from "@mantine/dates";
import { format } from "date-fns";
const formSchema = z.object({
	invoiceId: z.string("Invalid invoice id"),
	channel: z.string("Channel is required"),
	status: z.string("Invalid status"),
});
type invoice = {
	category: Category;
	client: Client;
	items: Item[];
	organization: Organization;
} & Invoice;
const Page = () => {
	const [invoice, setInvoice] = useState<invoice | null>(null);
	const [channel, setChannel] = useState<string | null>("");
	const [bank, setBank] = useState<string | null>("");
	const [paid_at, setPaidAt] = useState<string | Date | null>("");
	const [chain, setChain] = useState<string | null>("");
	const [coinAmount, setCoinAmount] = useState<number | string>("");
	const [provider_transaction_id, setTNXId] = useState<string | null>("");
	const queryClient = useQueryClient();
	const { control, formState, setValue, handleSubmit } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});
	const invoicesRes = useQuery({
		queryKey: [`invoices`],
		queryFn: async () => {
			return await getInvoicesSimple();
		},
	});
	const invoices: invoice[] = invoicesRes.data;
	const invoiceList = invoices?.map((inv) => ({
		label: inv.invoiceNumber,
		value: inv.id,
	}));
	const mutation = useMutation({
		mutationFn: postPayment,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["payments"] });
		},
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const getMetadata = () => {
			if (values.channel == "Bank Transfer") {
				return JSON.stringify({
					bank: bank,
				});
			}
			if (values.channel == "cryptocurrency") {
				JSON.stringify({
					chain: chain,
					coinAmount,
				});
			}
		};
		const data = {
			invoiceId: values.invoiceId,
			status: values.status,
			paid_at: paid_at,
			provider_transaction_id: provider_transaction_id,
			channel: values.channel,
			currency: "NGN",
			amount: Number(invoice?.total),
			orgId: invoice?.organizationId,
			metadata: getMetadata(),
		};
		await mutation.mutateAsync(data);
	};

	return (
		<main className='space-y-6'>
			<section className='flex items-center justify-between'>
				<Button asChild>
					<Link
						href={`/app/payments`}
						className='w-fit flex gap-2 items-center'
					>
						<ArrowLeft />
						Go back
					</Link>
				</Button>
				<Label className='text-lg'>Add manual payment</Label>
			</section>
			<Card>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='flex flex-col w-full gap-3'
					>
						<FieldGroup>
							<Controller
								name='invoiceId'
								control={control}
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='invoiceId'>Invoice</FieldLabel>
										<Select
											disabled={formState.isSubmitting}
											required
											{...field}
											onChange={(value) => {
												setValue("invoiceId", String(value), {
													shouldValidate: true,
												});
												const invoice =
													invoices?.find((inv) => inv.id == value) || null;

												setInvoice(invoice);
											}}
											className='max-w-80'
											aria-invalid={fieldState.invalid}
											placeholder='Select invoice to create payment for'
											error={formState.errors.invoiceId?.message}
											checkIconPosition='right'
											searchable
											allowDeselect={false}
											nothingFoundMessage='Nothing found...'
											data={invoiceList}
										/>
									</Field>
								)}
							/>
						</FieldGroup>
						{invoice && (
							<FieldGroup>
								<Card className='w-96'>
									<CardHeader>
										<CardDescription>{invoice?.invoiceNumber}</CardDescription>
										<CardDescription>
											Client Name: {invoice?.client.name}
										</CardDescription>
										<CardDescription>
											Client Email: {invoice?.client.email}
										</CardDescription>
										<CardDescription>
											Due Date: {format(invoice.due_date, "d/M/y")}
										</CardDescription>
									</CardHeader>

									<CardFooter className='flex items-start font-semibold gap-1.5 text-sm'>
										Amount:
										<NumberFormatter
											prefix={invoice?.organization?.currencySymbol}
											value={Number(invoice?.total)}
											thousandSeparator
										/>
									</CardFooter>
								</Card>
								<FieldGroup>
									<Controller
										name='channel'
										control={control}
										rules={{ required: true }}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor='channel'>
													Payment Channel
												</FieldLabel>
												<Select
													disabled={formState.isSubmitting}
													required
													{...field}
													className='max-w-80'
													aria-invalid={fieldState.invalid}
													placeholder='Select payment medium'
													error={formState.errors.channel?.message}
													checkIconPosition='right'
													searchable
													allowDeselect
													onChange={(value) => {
														setValue("channel", value || "");
														setChannel(value);
													}}
													nothingFoundMessage='Nothing found...'
													data={[
														{
															label: "Cash",
															value: "Cash",
														},
														{
															label: "Bank Transfer",
															value: "Bank Transfer",
														},
														{
															label: "Cryptocurrency",
															value: "Cryptocurrency",
														},
													]}
												/>
											</Field>
										)}
									/>
									{channel == "Cryptocurrency" && (
										<FieldGroup>
											<Field>
												<FieldLabel htmlFor='chain'>Chain</FieldLabel>
												<Select
													disabled={formState.isSubmitting}
													className='max-w-80'
													onChange={(v) => {
														setChain(v);
													}}
													placeholder='Select crypro chain'
													checkIconPosition='right'
													searchable
													allowDeselect
													nothingFoundMessage='Nothing found...'
													data={chains}
												/>
											</Field>
											<Field>
												<FieldLabel htmlFor='coinAmount'>
													Coin Amount
												</FieldLabel>
												<NumberInput
													disabled={formState.isSubmitting}
													id='coinAmount'
													type='text'
													w={200}
													min={0}
													placeholder='amount...'
													onChange={(value) => {
														setCoinAmount(value);
													}}
												/>
											</Field>
										</FieldGroup>
									)}
									{channel == "Bank Transfer" && (
										<Field>
											<FieldLabel htmlFor='bank'>Payment Bank</FieldLabel>
											<Select
												disabled={formState.isSubmitting}
												className='max-w-80'
												onChange={(v) => {
													setBank(v);
												}}
												placeholder='Select payment bank'
												checkIconPosition='right'
												searchable
												allowDeselect
												nothingFoundMessage='Nothing found...'
												data={banks}
											/>
										</Field>
									)}
									<Field>
										<FieldLabel htmlFor='provider_transaction_id'>
											Transaction reference (optional)
										</FieldLabel>
										<Input
											disabled={formState.isSubmitting}
											id='provider_transaction_id'
											type='text'
											placeholder='transaction reference...'
											onChange={(e) => {
												setTNXId(e.currentTarget.value);
											}}
										/>
									</Field>
									<div className='flex gap-10'>
										<Field className='w-max'>
											<FieldLabel htmlFor='paid_at'>Payment Date</FieldLabel>

											<DatePickerInput
												placeholder='pick payment date'
												id='paid_at'
												w={160}
												onChange={(d) => {
													setPaidAt(d);
												}}
												required={true}
												disabled={formState.isSubmitting}
											/>
										</Field>
										<Controller
											name='status'
											control={control}
											rules={{ required: true }}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor='status'>
														Payment Status
													</FieldLabel>
													<Select
														disabled={formState.isSubmitting}
														required
														{...field}
														className='max-w-80'
														aria-invalid={fieldState.invalid}
														placeholder='Select payment status'
														error={formState.errors.status?.message}
														checkIconPosition='right'
														searchable
														allowDeselect
														nothingFoundMessage='Nothing found...'
														data={[
															{
																label: "Successful",
																value: "success",
															},
															{
																label: "Failed",
																value: "failed",
															},
															{
																label: "Cancelled",
																value: "cancelled",
															},
														]}
													/>
												</Field>
											)}
										/>
									</div>
								</FieldGroup>
							</FieldGroup>
						)}
						<FieldGroup>
							<Field orientation='horizontal' className='justify-end'>
								<Button
									type='submit'
									className='cursor-pointer'
									disabled={
										!formState.isValid || !paid_at || formState.isSubmitting
									}
								>
									Add payment
								</Button>
								<Button
									asChild
									className='cursor-pointer'
									variant='destructive'
								>
									<Link href={`/app/payments`}>Cancel</Link>
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</main>
	);
};

export default Page;
