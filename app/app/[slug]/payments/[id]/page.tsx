"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPayment, sendReceipt } from "@/lib/queries/payment";
import { useParams } from "next/navigation";
import { Label } from "@/components/ui/label";

import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	TableFooter,
	Table,
} from "@/components/ui/table";
import { NumberFormatter } from "@mantine/core";
import { format } from "date-fns";
import { InvoiceStatus } from "@/generated/prisma/enums";
import { invoice } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
	const { id, slug }: { id: string; slug: string } = useParams();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: sendReceipt,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`payment-${id}`] });
		},
	});
	const payment = useQuery({
		queryKey: [`payment-${id}`],
		queryFn: async () => {
			return await getPayment({ id });
		},
	});
	const invoice: invoice = payment.data?.invoice;
	const invTotal = invoice?.items?.reduce((prev, curr) => {
		const iTotal = Number(curr.rate) * curr.quantity;
		return prev + iTotal;
	}, 0);
	const getPayStatus = (status: string) => {
		if (status == "Failed")
			return "text-sm font-semibold outline-red-500 border-red-500 text-red-500";
		if (status == "Canceled")
			return "text-sm font-semibold outline-red-500 border-red-500 text-red-500";
		if (status == "Pending")
			return "text-sm font-semibold outline-orange-500 border-orange-500 text-orange-500";
		if (status == "Successful")
			return "text-sm font-semibold outline-green-500 border-green-500 text-green-500";
	};
	const getInvStatus = (status: InvoiceStatus) => {
		if (status == "CANCELLED")
			return "text-sm font-semibold outline-red-500 border-red-500 text-red-500";
		if (status == "PENDING")
			return "text-sm font-semibold outline-orange-500 border-orange-500 text-orange-500";
		if (status == "PAID")
			return "text-sm font-semibold outline-green-500 border-green-500 text-green-500";
		if (status == "DRAFT")
			return "text-sm font-semibold outline-gray-500 border-gray-500 text-gray-500";
		if (status == "OVERDUE")
			return "text-sm font-semibold outline-blue-500 border-blue-500 text-blue-500";
	};
	return (
		<main className='space-y-6'>
			<div className='flex justify-between items-start'>
				<Button asChild>
					<Link
						href={`/app/${slug}/payments`}
						className='w-fit flex gap-2 items-center'
					>
						<ArrowLeft />
						Go back
					</Link>
				</Button>
				<Button
					onClick={async (e) => {
						e.preventDefault();
						await mutation.mutateAsync(id);
					}}
					disabled={mutation.isPending}
				>
					<LoaderIcon />
					Resend Receipt
				</Button>
			</div>
			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>Payment Info</CardTitle>
				</CardHeader>

				<CardContent className='flex gap-3 flex-wrap'>
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Tnx Id: </Label>
						<span className=''>{payment.data?.id}</span>
					</div>
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Receipt Id: </Label>
						<span className=''>{payment.data?.receipts[0]?.id}</span>
					</div>
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Reference: </Label>
						<span className=''>{payment.data?.provider_transaction_id}</span>
					</div>
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Status: </Label>
						<span className={getPayStatus(payment.data?.status)}>
							{payment.data?.status}
						</span>
					</div>
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Amount: </Label>
						<NumberFormatter
							thousandSeparator
							prefix={invoice?.organization?.currencySymbol}
							value={payment.data?.amount}
						/>
					</div>
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Currency: </Label>
						<span>{payment.data?.currency}</span>
					</div>
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Payment channel: </Label>
						<span>{payment.data?.channel}</span>
					</div>
					{payment.data?.channel == "Cryprocurrency" && (
						<div className='flex gap-2 items-center'>
							<div className='flex gap-3 items-center'>
								<Label className='text-md'>Crypto chain: </Label>
								<span>{payment.data?.metadata?.chain}</span>
							</div>
							<div className='flex gap-3 items-center'>
								<Label className='text-md'>Coin amount: </Label>
								<span>{payment.data?.metadata?.coinAmount}</span>
							</div>
						</div>
					)}
					{payment.data?.channel == "Bank Transfer" && (
						<div className='flex gap-2 items-center'>
							<div className='flex gap-3 items-center'>
								<Label className='text-md'>Bank: </Label>
								<span>{payment.data?.metadata?.bank}</span>
							</div>
						</div>
					)}
					<div className='flex gap-2 items-center'>
						<Label className='text-md'>Payment provider: </Label>
						<span>{payment.data?.provider}</span>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className='text-lg'>Invoice</CardTitle>
				</CardHeader>

				<CardContent>
					<div className='flex justify-between items-center'>
						<div>
							<span className='text-gray-400'>Status: </span>{" "}
							<span className={getInvStatus(invoice?.status)}>
								{invoice?.status}
							</span>
						</div>
					</div>
					<div className='flex items-start justify-between pr-1'>
						<div className='flex flex-col gap-1'>
							<Label className='text-lg'>
								<span className='text-gray-400 -mr-1 font-bold'>#</span>
								{invoice?.invoiceNumber}
							</Label>
							<p className='text-gray-500'>{invoice?.project_subject}</p>
							<p className='text-gray-500'>{invoice?.category?.name}</p>
						</div>
						<p className='text-gray-500 flex flex-col gap-1'>
							<span>{invoice?.organization?.address}</span>
							<span>{invoice?.organization?.city}</span>
							<span>{invoice?.organization?.state}</span>
							<span>{invoice?.organization?.postCode}</span>
							<span>{invoice?.organization?.country}</span>
						</p>
					</div>
					<div className='flex items-start justify-between pr-1 flex-wrap sm:flex-nowrap gap-2'>
						<div className='flex flex-col gap-4'>
							<div className='flex flex-col gap-1'>
								<p className='text-gray-500'>Invoice Date</p>
								<Label className='text-md'>
									{invoice?.issued_date &&
										format(invoice?.issued_date, "d LLL y")}
								</Label>
							</div>
							<div className='flex flex-col gap-1'>
								<p className='text-gray-500'>Payment Due</p>
								<Label className='text-md'>
									{invoice?.due_date &&
										format(invoice?.due_date || null, "d LLL y")}
								</Label>
							</div>
						</div>
						<div className='flex flex-col gap-1'>
							<p className='text-gray-500'>Sent To</p>
							<Label className='text-md'>{invoice?.client?.email}</Label>
						</div>
						<div className='flex flex-col gap-1 justify-self-end'>
							<p className='text-gray-500'>Bill To</p>
							<Label className='text-md'>{invoice?.client?.name}</Label>
							<p className='text-gray-500 flex flex-col gap-1'>
								<span>{invoice?.client?.address}</span>
								<span>{invoice?.client?.city}</span>
								<span>{invoice?.client?.state}</span>
								<span>{invoice?.client?.postCode}</span>
								<span>{invoice?.client?.country}</span>
							</p>
						</div>
					</div>
					<div className='max-w-full overflow-auto mt-2'>
						<Table className=' rounded-b-xl '>
							<TableHeader className='bg-muted'>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Quantity</TableHead>
									<TableHead>Rate</TableHead>
									<TableHead>Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoice?.items?.length ? (
									<>
										{invoice?.items?.map((item) => (
											<TableRow
												key={item.name}
												className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
											>
												<TableCell>{item.name}</TableCell>
												<TableCell>
													<NumberFormatter value={item.quantity} />
												</TableCell>
												<TableCell>
													<NumberFormatter
														prefix={invoice?.organization?.currencySymbol}
														value={Number(item.rate)}
														thousandSeparator
													/>
												</TableCell>
												<TableCell>
													<NumberFormatter
														prefix={invoice?.organization?.currencySymbol}
														value={Number(item.rate) * item.quantity}
														thousandSeparator
													/>
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
							<TableFooter className='bg-indigo-800 '>
								<TableRow>
									<TableCell className='text-white font-thin'>
										Amount Due
									</TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell className='text-lg text-gray-300'>
										<NumberFormatter
											prefix={invoice?.organization?.currencySymbol}
											value={invTotal}
											thousandSeparator
										/>
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
				</CardContent>
			</Card>
		</main>
	);
};

export default Page;
