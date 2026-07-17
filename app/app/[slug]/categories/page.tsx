"use client";
import { columns } from "@/components/tables/category/columns";
import { DataTable } from "@/components/tables/category/Table";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/queries/category";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
const Page = () => {
	const { slug }: { slug: string } = useParams();

	const categories = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			return await getCategories();
		},
	});
	return (
		<main className='flex flex-col gap-4'>
			<Label className='text-lg'>Categroies</Label>
			<DataTable columns={columns} data={categories.data || []} slug={slug} />
		</main>
	);
};

export default Page;
