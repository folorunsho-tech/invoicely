"use client";
import { TrashTable } from "@/components/tables/TrashTable";
import {
	getTrashInvoices,
	deleteInvoices,
	restoreInvoices,
} from "@/lib/queries/invoice";
import { useQuery } from "@tanstack/react-query";
import { tcolumns } from "@/components/tables/invoices/columns";
import { Label } from "@/components/ui/label";
import { schema } from "@/components/tables/invoices/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Page = () => {
	const invoices = useQuery({
		queryKey: ["trash-invoices", "invoices"],
		queryFn: async () => {
			return await getTrashInvoices();
		},
	});
	return (
		<main className='flex flex-col gap-6'>
			<div className='flex items-center justify-between'>
				<Button asChild>
					<Link
						href={`/app/invoices`}
						className='w-fit flex gap-2 items-center'
					>
						<ArrowLeft />
						Go back
					</Link>
				</Button>
				<Label className='text-xl'>
					Trashed Invoices {invoices.data?.length || 0}
				</Label>
			</div>
			<TrashTable
				data={invoices.data || []}
				columns={tcolumns}
				bulkDeleteFn={deleteInvoices}
				bulkRestoreFn={restoreInvoices}
				queryKey={["trash-invoices"]}
				schema={schema}
			/>
		</main>
	);
};

export default Page;
