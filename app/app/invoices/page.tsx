"use client";
import DataCards from "@/components/data-cards";
import { DataTable } from "@/components/tables/invoices/Table";
import { getInvoices, trashInvoices } from "@/lib/queries/invoice";
import { NumberFormatter } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { columns } from "@/components/tables/invoices/columns";

const Page = () => {
	const invoices = useQuery({
		queryKey: ["invoices"],
		queryFn: async () => {
			return await getInvoices();
		},
	});
	return (
		<main className='flex flex-col gap-4'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex flex-col gap-4 md:gap-6'>
					<DataCards
						cards={[
							{
								description: "Total Invoices",
								title: <NumberFormatter value={invoices?.data?.length || 0} />,
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
