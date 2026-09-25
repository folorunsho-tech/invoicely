"use client";
import DataCards from "@/components/data-cards";
import { DataTable } from "@/components/tables/invoices/Table";
import { getInvoices, trashInvoices } from "@/lib/queries/invoice";
import { NumberFormatter } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { columns } from "@/components/tables/invoices/columns";
import { Invoice } from "@/generated/prisma/client";

const Page = () => {
	const invoices = useQuery({
		queryKey: ["invoices"],
		queryFn: async () => {
			return await getInvoices();
		},
	});
	const paid = invoices?.data?.filter((inv: Invoice) => inv?.status == "PAID");
	const pending = invoices?.data?.filter(
		(inv: Invoice) => inv?.status == "PENDING",
	);
	const overdue = invoices?.data?.filter(
		(inv: Invoice) => inv?.status == "OVERDUE",
	);
	return (
		<main className='flex flex-col gap-4'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex gap-4 md:gap-6'>
					<DataCards
						cards={[
							{
								description: "Total Invoices",
								title: <NumberFormatter value={invoices?.data?.length || 0} />,
							},
							{
								description: "Paid Invoices",
								title: <NumberFormatter value={paid?.length || 0} />,
							},
							{
								description: "Pending Invoices",
								title: <NumberFormatter value={pending?.length || 0} />,
							},
							{
								description: "Overdue Invoices",
								title: <NumberFormatter value={overdue?.length || 0} />,
							},
						]}
					/>
				</div>
			</div>
			<DataTable
				data={invoices.data || []}
				columns={columns}
				bulkTrashFn={trashInvoices}
			/>
		</main>
	);
};

export default Page;
