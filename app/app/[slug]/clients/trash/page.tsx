"use client";
import { TrashTable } from "@/components/tables/TrashTable";
import {
	getTrashClients,
	deleteClients,
	restoreClients,
} from "@/lib/queries/client";
import { useQuery } from "@tanstack/react-query";
import { tcolumns } from "@/components/tables/clients/columns";
import { Label } from "@/components/ui/label";
import { schema } from "@/components/tables/clients/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

const Page = () => {
	const { slug }: { slug: string } = useParams();
	const clients = useQuery({
		queryKey: ["trash-clients", "clients"],
		queryFn: async () => {
			return await getTrashClients();
		},
	});
	return (
		<main className='flex flex-col gap-6'>
			<div className='flex items-center justify-between'>
				<Button asChild>
					<Link
						href={`/app/${slug}/clients`}
						className='w-fit flex gap-2 items-center'
					>
						<ArrowLeft />
						Go back
					</Link>
				</Button>
				<Label className='text-xl'>
					Trashed Clients {clients.data?.length || 0}
				</Label>
			</div>
			<TrashTable
				data={clients.data || []}
				columns={tcolumns}
				bulkDeleteFn={deleteClients}
				bulkRestoreFn={restoreClients}
				queryKey={["trash-clients"]}
				schema={schema}
			/>
		</main>
	);
};

export default Page;
