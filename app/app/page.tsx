"use client";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { ChartBarInteractive } from "@/components/chart-bar-interactive";
import { getPayments } from "@/lib/queries/payment";
import { useQuery } from "@tanstack/react-query";
import { SectionCards } from "@/components/section-cards";
import { columns } from "@/components/tables/payments/columns";
import { RenderTable } from "@/components/tables/RenderTable";
import { schema } from "@/components/tables/payments/schema";
import { Label } from "@/components/ui/label";
const Page = () => {
	const res = useQuery({
		queryKey: ["payments"],
		queryFn: async () => {
			return await getPayments();
		},
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const payments: any[] = res.data;
	return (
		<div className='flex flex-1 flex-col'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex flex-col gap-4 py-2 md:gap-6 md:py-4'>
					<SectionCards />
					{/* <div className='px-4 lg:px-6 space-y-6'>
						<ChartAreaInteractive />
						<ChartBarInteractive />
					</div> */}
					<div className='space-y-4'>
						<Label className='text-md'>Payments</Label>
						<RenderTable
							data={payments || []}
							columns={columns}
							schema={schema}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
