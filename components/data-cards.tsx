"use client";
import React from "react";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
const DataCards = ({
	cards,
}: {
	cards: {
		description: string;
		title: string | React.ReactNode;
		action?: React.ReactNode;
		footer?: React.ReactNode;
	}[];
}) => {
	return (
		<div className='grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
			{cards.map((card, i) => (
				<Card className='@container/card' key={card.description + i}>
					<CardHeader>
						<CardDescription>{card.description}</CardDescription>
						<CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
							{card.title}
						</CardTitle>
						{card.action && <CardAction>{card.action}</CardAction>}
					</CardHeader>
					{card.footer && (
						<CardFooter className='flex-col items-start gap-1.5 text-sm'>
							{card.footer}
						</CardFooter>
					)}
				</Card>
			))}
		</div>
	);
};

export default DataCards;
