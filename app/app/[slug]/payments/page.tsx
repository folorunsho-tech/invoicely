/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DataCards from "@/components/data-cards";
import { DataTable } from "@/components/tables/payments/Table";
import { getPayments } from "@/lib/queries/payment";
import { NumberFormatter } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { columns } from "@/components/tables/payments/columns";
import { authClient } from "@/lib/auth-client";

const Page = () => {
	const { data: org } = authClient.useActiveOrganization();
	const res = useQuery({
		queryKey: ["clients"],
		queryFn: async () => {
			return await getPayments();
		},
	});
	const payments: any[] = res.data;
	const total = payments?.reduce((prev, curr) => {
		return prev + Number(curr.amount);
	}, 0);
	return (
		<main className='flex flex-col gap-4'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex gap-4 md:gap-6'>
					<DataCards
						cards={[
							{
								description: "Total payments",
								title: (
									<NumberFormatter
										value={payments?.length || 0}
										thousandSeparator
									/>
								),
							},
						]}
					/>
					<DataCards
						cards={[
							{
								description: "Total amount earned",
								title: (
									<NumberFormatter
										prefix={org?.currencySymbol}
										thousandSeparator
										value={total || 0}
									/>
								),
							},
						]}
					/>
				</div>
			</div>
			<DataTable data={payments || []} columns={columns} />
		</main>
	);
};

export default Page;
