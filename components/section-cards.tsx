"use client";

// import { Badge } from "@/components/ui/badge";
import {
	Card,
	// CardAction,
	CardDescription,
	// CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { getDashboardData } from "@/lib/queries/analytics";
// import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { NumberFormatter } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
export function SectionCards() {
	const { data: activeOrg } = authClient.useActiveOrganization();
	const members = activeOrg?.members;
	const dashboard = useQuery({
		queryKey: ["dashboard-data"],
		queryFn: async () => {
			return await getDashboardData();
		},
	});

	return (
		<div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Revenue</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						<NumberFormatter
							value={dashboard.data?.revenue}
							thousandSeparator
							prefix={activeOrg?.currencySymbol}
						/>
					</CardTitle>
					{/* <CardAction>
						<Badge variant='outline'>
							<TrendingUpIcon />
							+12.5%
						</Badge>
					</CardAction> */}
				</CardHeader>
				{/* <CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Trending up this month <TrendingUpIcon className='size-4' />
					</div>
					<div className='text-muted-foreground'>
						Visitors for the last 6 months
					</div>
				</CardFooter> */}
			</Card>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Invoices</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						<NumberFormatter
							value={dashboard.data?.invoices}
							thousandSeparator
						/>
					</CardTitle>
					{/* <CardAction>
						<Badge variant='outline'>
							<TrendingDownIcon />
							-20%
						</Badge>
					</CardAction> */}
				</CardHeader>
				{/* <CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Down 20% this period <TrendingDownIcon className='size-4' />
					</div>
					<div className='text-muted-foreground'>
						Acquisition needs attention
					</div>
				</CardFooter> */}
			</Card>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Total Clients</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						<NumberFormatter
							value={dashboard.data?.clients}
							thousandSeparator
						/>
					</CardTitle>
					{/* <CardAction>
						<Badge variant='outline'>
							<TrendingUpIcon />
							+12.5%
						</Badge>
					</CardAction> */}
				</CardHeader>
				{/* <CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Strong user retention <TrendingUpIcon className='size-4' />
					</div>
					<div className='text-muted-foreground'>Engagement exceed targets</div>
				</CardFooter> */}
			</Card>
			<Card className='@container/card'>
				<CardHeader>
					<CardDescription>Members</CardDescription>
					<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
						<NumberFormatter value={members?.length || 0} thousandSeparator />
					</CardTitle>
				</CardHeader>
				{/* <CardFooter className='flex-col items-start gap-1.5 text-sm'>
					<div className='line-clamp-1 flex gap-2 font-medium'>
						Steady performance increase <TrendingUpIcon className='size-4' />
					</div>
					<div className='text-muted-foreground'>Meets growth projections</div>
				</CardFooter> */}
			</Card>
		</div>
	);
}
