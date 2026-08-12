"use client";
import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/queries/client";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderTable } from "@/components/tables/RenderTable";
import { rcolumns } from "@/components/tables/invoices/columns";
import { schema } from "@/components/tables/invoices/schema";
import { Label } from "@/components/ui/label";
import { NumberFormatter } from "@mantine/core";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
const Page = () => {
	const { id }: { id: string } = useParams();
	const client = useQuery({
		queryKey: ["client", id],
		queryFn: async () => {
			return await getClient({ id });
		},
	});
	return (
		<main className='flex flex-col gap-6 justify-items-start'>
			<Button asChild>
				<Link href={`/app/clients`} className='w-fit flex gap-2 items-center'>
					<ArrowLeft />
					Go back
				</Link>
			</Button>
			<Card>
				<CardHeader>
					<CardTitle>{client.data?.name}</CardTitle>
				</CardHeader>
				<CardContent className='flex justify-between'>
					<div>
						<div className='flex gap-2'>
							<Label>Email:</Label>
							<p>{client.data?.email}</p>
						</div>
						<div className='flex gap-2'>
							<Label>Phone:</Label>
							<p>{client.data?.phone}</p>
						</div>
						<div className='flex gap-2'>
							<Label>Zip Code:</Label>
							<p>{client.data?.postCode}</p>
						</div>
						<div className='flex gap-2'>
							<Label>Address:</Label>
							<p>
								{client.data?.address}, {client.data?.city}
							</p>
						</div>
						<div className='flex gap-2'>
							<Label>State - Country:</Label>
							<p>
								{client.data?.state} - {client.data?.country}
							</p>
						</div>
					</div>
					<div>
						<div className='flex gap-2 flex-col text-xl'>
							<Label className='text-xl'>Invoices:</Label>
							<NumberFormatter value={client.data?.invoices?.length || 0} />
						</div>
					</div>
				</CardContent>
			</Card>
			<section className='flex flex-col gap-4'>
				<Label className='text-xl'>Invoices</Label>
				<RenderTable
					data={client.data?.invoices || []}
					columns={rcolumns}
					schema={schema}
					queryKey='invoices'
				/>
			</section>
		</main>
	);
};

export default Page;
