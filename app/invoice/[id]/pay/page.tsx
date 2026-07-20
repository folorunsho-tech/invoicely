"use client";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NumberFormatter } from "@mantine/core";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
	Category,
	Client,
	InvoiceStatus,
	Item,
	Organization,
} from "@/generated/prisma/client";
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
	TableFooter,
} from "@/components/ui/table";
import { getInvoice } from "@/lib/queries/invoice";
import { Button } from "@/components/ui/button";
import { initTransaction } from "@/lib/queries/payment";
import toast from "@/lib/toaster";

type Invoice = {
	issued_date: Date;
	due_date: Date;
	project_subject: string | null;
	organization: Organization | null;
	category?: Category;
	client?: Client;
	items?: Item[];
	invoiceNumber: string;
	status: InvoiceStatus;
};
const Page = () => {
	const { id }: { id: string } = useParams();
	const router = useRouter();
	const invoiceRes = useQuery({
		queryKey: [`invoice-${id}`],
		queryFn: async () => {
			return await getInvoice({ id });
		},
	});

	const invoice: Invoice = invoiceRes.data;
	const invTotal = invoice?.items?.reduce((prev, curr) => {
		const iTotal = Number(curr.rate) * curr.quantity;
		return prev + iTotal;
	}, 0);
	const mutation = useMutation({
		mutationFn: initTransaction,
	});
	return (
		<section className='text-sm flex flex-col mx-auto pt-8 p-3 sm:w-3/6 gap-4'>
			<Label className='text-md'>{invoice?.organization?.name}</Label>
			<div className='flex items-start justify-between'>
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
			<div className='flex items-start justify-between flex-wrap sm:flex-nowrap gap-2'>
				<div className='flex flex-col gap-4'>
					<div className='flex flex-col gap-1'>
						<p className='text-gray-500'>Invoice Date</p>
						<Label className='text-md'>
							{invoice?.issued_date && format(invoice?.issued_date, "d LLL y")}
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
			<div className='max-w-full overflow-auto'>
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
					<TableFooter className='bg-gray-900'>
						<TableRow>
							<TableCell className='text-white font-thin'>Amount Due</TableCell>
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
			<Button
				disabled={invoiceRes.isPending || mutation.isPending}
				onClick={async () => {
					await mutation.mutateAsync(id).then((res) => {
						if (res?.status) {
							router.push(`/invoice/${id}/checkout?ref=${res?.reference}`);
						} else {
							toast(res?.message, "error");
						}
					});
				}}
			>
				Pay
				<NumberFormatter
					prefix={invoice?.organization?.currencySymbol}
					value={invTotal}
					thousandSeparator
				/>
				Now
			</Button>
		</section>
	);
};

export default Page;
