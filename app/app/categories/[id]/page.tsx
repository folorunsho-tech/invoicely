"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "@/lib/queries/category";
import { Label } from "@/components/ui/label";
import { rcolumns } from "@/components/tables/invoices/columns";
import { RenderTable } from "@/components/tables/RenderTable";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { NumberFormatter } from "@mantine/core";
import { schema } from "@/components/tables/invoices/schema";

const Page = () => {
	const { id }: { id: string } = useParams();
	const category = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			return await getCategory({ id });
		},
	});
	return (
		<main className='flex flex-col gap-4'>
			<Button asChild>
				<Link
					href={`/app/categories`}
					className='w-fit flex gap-2 items-center'
				>
					<ArrowLeft />
					Go back
				</Link>
			</Button>
			<Card>
				<CardHeader>
					<CardTitle>{category.data?.name}</CardTitle>
				</CardHeader>
				<CardContent className='flex justify-between items-start'>
					<div>
						{/* <div className='flex gap-2'>
							<Label>slug:</Label>
							<p>{category.data?.slug}</p>
						</div> */}
						<div className='flex gap-2'>
							<Label>description:</Label>
							<p>{category.data?.description}</p>
						</div>
					</div>

					<div className='flex gap-2 flex-col text-xl'>
						<Label className='text-xl'>Invoices:</Label>
						<NumberFormatter value={category.data?._count?.invoices || 0} />
					</div>
				</CardContent>
			</Card>
			<section className='flex flex-col gap-4'>
				<Label className='text-xl'>Invoices</Label>
				<RenderTable
					data={category.data?.invoices || []}
					columns={rcolumns}
					schema={schema}
				/>
			</section>
		</main>
	);
};

export default Page;
