/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { ArrowLeft, LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPayment, sendReceipt, updatePayment } from "@/lib/queries/payment";
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
	const { id, slug }: { id: string; slug: string } = useParams();
	const paymentRes = useQuery({
		queryKey: [`payment-${id}`],
		queryFn: async () => {
			return await getPayment({ id });
		},
	});
	const payment = paymentRes.data;
	const [channel, setChannel] = useState<string | null>("");
	const [bank, setBank] = useState<string | null>("");
	const [paid_at, setPaidAt] = useState<string | Date | null>("");
	const [chain, setChain] = useState<string | null>("");
	const [coinAmount, setCoinAmount] = useState<number | string>("");
	const [provider_transaction_id, setTNXId] = useState<string | null>("");
	const queryClient = useQueryClient();
	const { control, formState, setValue, handleSubmit, setValues } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		mode: "all",
	});

	const invoice: invoice = paymentRes.data?.invoice;

	const mutation = useMutation({
		mutationFn: updatePayment,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["payments"] });
		},
	});
	const rmutation = useMutation({
		mutationFn: sendReceipt,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`payment-${id}`] });
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
			status: values.status,
			paid_at: paid_at,
			provider_transaction_id: provider_transaction_id,
			channel: values.channel,
			metadata: getMetadata(),
		};
		await mutation.mutateAsync({ id, data });
	};
	useEffect(() => {
		if (payment) {
			setValues({
				invoiceId: invoice?.id,
				status: payment?.status,
				channel: payment?.channel,
			});
			setChannel(payment?.channel);
			setPaidAt(new Date(payment?.paid_at));
			setTNXId(payment?.provider_transaction_id);
			if (payment?.channel == "Cryptocurrency") {
				setChain(payment?.metadata?.chain);
				setCoinAmount(payment?.metadata?.coinAmount);
			} else if (payment?.channel == "Bank Transfer") {
				setBank(payment?.metadata?.bank);
			}
		}
	}, [paymentRes.isLoading]);
	return (
		<main className='space-y-6'>
			<section className='flex items-center justify-between'>
				<Button asChild>
					<Link
						href={`/app/${slug}/payments`}
						className='w-fit flex gap-2 items-center'
					>
						<ArrowLeft />
						Go back
					</Link>
				</Button>
				<Label className='text-lg'>Update manual payment</Label>
			</section>
			<Card>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className='flex flex-col w-full gap-3'
					>
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
												value={paid_at}
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
																value: "Successful",
															},
															{
																label: "Failed",
																value: "Failed",
															},
															{
																label: "Cancelled",
																value: "Cancelled",
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
									onClick={async (e) => {
										e.preventDefault();
										await rmutation.mutateAsync(id);
									}}
									disabled={rmutation.isPending || !mutation.isSuccess}
								>
									<LoaderIcon />
									Resend Receipt
								</Button>
								<Button
									type='submit'
									className='cursor-pointer'
									disabled={
										!formState.isValid || !paid_at || formState.isSubmitting
									}
								>
									Update payment
								</Button>
								<Button
									asChild
									className='cursor-pointer'
									variant='destructive'
								>
									<Link href={`/app/${slug}/payments`}>Cancel</Link>
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
