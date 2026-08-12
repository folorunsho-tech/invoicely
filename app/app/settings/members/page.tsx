"use client";
import DataCards from "@/components/data-cards";
import { DataTable } from "@/components/tables/members/Table";
import { getOrgMembers } from "@/lib/queries/members";
import { NumberFormatter } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { columns } from "@/components/tables/members/columns";
import { authClient } from "@/lib/auth-client";

const Page = () => {
	const { data } = authClient.useSession();
	const members = useQuery({
		queryKey: ["members"],
		queryFn: async () => {
			return await getOrgMembers(data?.session?.activeOrganizationId || "");
		},
	});
	return (
		<main className='flex flex-col gap-4'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex flex-col gap-4 md:gap-6'>
					<DataCards
						cards={[
							{
								description: "Total members",
								title: <NumberFormatter value={members.data?.total || 0} />,
							},
						]}
					/>
				</div>
			</div>
			<DataTable data={members.data?.members || []} columns={columns} />
		</main>
	);
};

export default Page;
