"use client";
import DataCards from "@/components/data-cards";
import { DataTable } from "@/components/tables/invitations/Table";
import { NumberFormatter } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { columns } from "@/components/tables/invitations/columns";
import { getInvitations } from "@/lib/queries/invitations";

const Page = () => {
	const invitations = useQuery({
		queryKey: ["invitations"],
		queryFn: async () => {
			return await getInvitations();
		},
	});

	return (
		<main className='flex flex-col gap-4'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex flex-col gap-4 md:gap-6'>
					<DataCards
						cards={[
							{
								description: "Total invitations",
								title: (
									<NumberFormatter
										thousandSeparator
										value={invitations.data?.length || 0}
									/>
								),
							},
						]}
					/>
				</div>
			</div>
			<DataTable data={invitations.data || []} columns={columns} />
		</main>
	);
};

export default Page;
