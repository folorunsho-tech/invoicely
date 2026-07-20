"use client";
import {
	Category,
	Client,
	InvoiceStatus,
	Item,
	Organization,
	Payment,
} from "@/generated/prisma/client";
import { NumberFormatter } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
	TableFooter,
} from "@/components/ui/table";
import {
	deleteInvoice,
	getInvoice,
	markInvoiceCancelled,
	sendInvoice,
} from "@/lib/queries/invoice";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, LoaderIcon, Pencil } from "lucide-react";
import Link from "next/link";
import { InvoiceNotification } from "@/lib/types";
import DeleteModal from "@/components/tables/modals/DeleteModal";
import { rcolumns } from "@/components/tables/payments/columns";
import { schema } from "@/components/tables/payments/schema";
import { RenderTable } from "@/components/tables/RenderTable";
type Invoice = {
	issued_date: Date;
	due_date: Date;
	project_subject: string | null;
	organization: Organization | null;
	category?: Category;
	client?: Client;
	items?: Item[];
	invoiceNumber: string;
	notifications: InvoiceNotification[];
	status: InvoiceStatus;
	payments: Payment[];
};
const Page = () => {
	const { id, slug }: { id: string; slug: string } = useParams();
	const result = useQuery({
		queryKey: [`invoice-${id}`],
		queryFn: async () => {
			return await getInvoice({ id });
		},
	});
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: sendInvoice,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`invoice-${id}`] });
		},
	});
	const cmutation = useMutation({
		mutationFn: markInvoiceCancelled,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`invoice-${id}`] });
		},
	});

	const invoice: Invoice = result.data;
	const invTotal = invoice?.items?.reduce((prev, curr) => {
		const iTotal = Number(curr.rate) * curr.quantity;
		return prev + iTotal;
	}, 0);
	const getStatusColor = (status: string) => {
		if (status == "FAILED")
			return "outline-red-500 border-red-500 text-red-500";
		return "outline-green-500 border-green-500 text-green-500";
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
		<main className='flex flex-col gap-6'>
			<section className='text-sm flex flex-col gap-4'>
				<div className='flex justify-between items-start'>
					<Button asChild>
						<Link
							href={`/app/${slug}/invoices`}
							className='w-fit flex gap-2 items-center'
						>
							<ArrowLeft />
							Go back
						</Link>
					</Button>
					<Button
						onClick={async (e) => {
							e.preventDefault();
							await mutation.mutateAsync({ id });
						}}
						disabled={mutation.isPending}
					>
						<LoaderIcon />
						Resend Invoice
					</Button>
				</div>
				<div className='flex justify-between items-center'>
					<div>
						<span className='text-gray-400'>Status: </span>{" "}
						<span className={getInvStatus(invoice?.status)}>
							{invoice?.status}
						</span>
					</div>
					<div className='flex gap-3'>
						<Button variant={`outline`}>
							<Link
								href={`/app/${slug}/invoices/${id}/update`}
								className='w-fit flex gap-2 items-center'
							>
								<Pencil />
								Edit
							</Link>
						</Button>
						<div>
							<DeleteModal
								id={id}
								deleteFn={deleteInvoice}
								title={`Delete invoice ${invoice?.invoiceNumber}`}
								description="Are you sure you want to delete this invoice an it's related data?"
								queryKey={[`invoice-${id}`, "invoices"]}
								redirect={false}
								redirectTo={`/app/${slug}/invoices`}
							/>
						</div>

						<Button
							onClick={async (e) => {
								e.preventDefault();
								await cmutation.mutateAsync({ id });
							}}
							variant={`destructive`}
							disabled={cmutation.isPending}
						>
							<Check />
							Mark as Cancelled
						</Button>
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
				<section className='flex flex-col gap-4'>
					<Label className='text-xl'>Payments</Label>
					<RenderTable
						data={invoice?.payments || []}
						columns={rcolumns}
						schema={schema}
						queryKey='payments'
					/>
				</section>
			</section>

			<section className='flex flex-col gap-4 items-start max-w-full'>
				<Label className='text-lg'>Notifications</Label>
				<Table className='rounded-b-xl overflow-auto'>
					<TableHeader className='bg-muted'>
						<TableRow>
							<TableHead>Type</TableHead>
							<TableHead>Channel</TableHead>
							<TableHead>Sent At</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Last Error</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoice?.notifications?.length ? (
							<>
								{invoice?.notifications?.map((item) => (
									<TableRow
										key={item.id}
										className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
									>
										<TableCell>{item.type}</TableCell>
										<TableCell>{item.channel}</TableCell>
										<TableCell>
											{item?.sentAt
												? format(item?.sentAt, "dd/MM/yyyy, p")
												: ""}
										</TableCell>
										<TableCell className={getStatusColor(item.status)}>
											{item.status}
										</TableCell>
										<TableCell className='text-red-500'>
											{item.lastError}
										</TableCell>
									</TableRow>
								))}
							</>
						) : (
							<TableRow>
								<TableCell colSpan={5} className='h-24 text-center'>
									No notifications sent yet.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</section>
		</main>
	);
};

export default Page;
