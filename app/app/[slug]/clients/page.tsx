"use client";
import DataCards from "@/components/data-cards";
import { DataTable } from "@/components/tables/clients/Table";
import { getClients, trashClients } from "@/lib/queries/client";
import { NumberFormatter } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { columns } from "@/components/tables/clients/columns";

const Page = () => {
	const clients = useQuery({
		queryKey: ["clients"],
		queryFn: async () => {
			return await getClients();
		},
	});
	return (
		<main className='flex flex-col gap-4'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex flex-col gap-4 md:gap-6'>
					<DataCards
						cards={[
							{
								description: "Total clients",
								title: <NumberFormatter value={clients?.data?.length || 0} />,
							},
						]}
					/>
				</div>
			</div>
			<DataTable
				data={clients.data || []}
				columns={columns}
				bulkTrashFn={trashClients}
			/>
		</main>
	);
};

export default Page;
