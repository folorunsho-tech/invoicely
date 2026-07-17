import {
	Category,
	Client,
	Item,
	Organization,
} from "@/generated/prisma/client";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, NumberFormatter, ScrollArea } from "@mantine/core";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { format } from "date-fns";
import {
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	Table,
	TableFooter,
} from "./ui/table";
type Invoice = {
	issued_date: Date;
	due_date: Date;
	project_subject: string | null;
	currency: string | null;
	organization: Organization | null;
	category?: Category;
	client?: Client;
	items?: Item[];
	invoiceNumber?: string;
};
const InvoicePreview = ({
	invoice,
	getPreview,
}: {
	invoice: Invoice;
	getPreview: () => void;
}) => {
	const [opened, { open, close }] = useDisclosure(false);
	const invTotal = invoice?.items?.reduce((prev, curr) => {
		const iTotal = Number(curr.rate) * curr.quantity;
		return prev + iTotal;
	}, 0);
	return (
		<>
			<Button
				variant='outline'
				onClick={() => {
					open();
					getPreview();
				}}
				className='cursor-pointer'
			>
				Preview
			</Button>
			<Drawer
				opened={opened}
				onClose={close}
				title='Invoice preview'
				position='right'
				offset={8}
				radius='sm'
				size='lg'
				scrollAreaComponent={ScrollArea.Autosize}
			>
				<section className='text-sm flex flex-col  gap-6'>
					<div className='flex items-start justify-between'>
						<div className='flex flex-col gap-1'>
							{invoice?.invoiceNumber ? (
								<Label className='text-lg'>
									<span className='text-gray-400 -mr-1 font-bold'>#</span>
									{invoice?.invoiceNumber}
								</Label>
							) : (
								<Label className='text-lg'>
									<span className='text-gray-400 -mr-1 font-bold'>#</span>INV-
									{invoice?.organization?.code}-####
								</Label>
							)}
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
					<Table className='mt-4 rounded-b-xl'>
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
						<TableFooter className='bg-indigo-800'>
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
				</section>
			</Drawer>
		</>
	);
};

export default InvoicePreview;
