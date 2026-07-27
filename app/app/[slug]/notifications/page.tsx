"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	deleteNotification,
	getAllNotifications,
	markNotification,
} from "@/lib/queries/notifications";
import { useParams, useRouter } from "next/navigation";
import { Notification } from "@/generated/prisma/client";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toaster";
import { format } from "date-fns";
const Page = () => {
	const { slug }: { slug: string } = useParams();

	const router = useRouter();
	const queryClient = useQueryClient();

	const res = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			return await getAllNotifications();
		},
	});
	console.log(res.data);
	const notifications: Notification[] = res?.data;
	const mutation = useMutation({
		mutationFn: markNotification,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
	const dmutation = useMutation({
		mutationFn: deleteNotification,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
	return (
		<main className='flex flex-col gap-3 py-3'>
			<Button
				className='w-fit flex gap-2 items-center'
				onClick={() => {
					router.back();
				}}
			>
				<ArrowLeft />
				Go back
			</Button>
			{notifications?.map((not) => (
				<Card key={not.id} className='max-w-2/3'>
					<CardHeader
						className={`flex justify-between items-center ${not.status == "read" ? "text-gray-400" : ""}`}
					>
						<Label>
							{not.title} - {format(not.createdAt, "Pp")}
						</Label>
						<CardAction>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline'>
										<EllipsisVertical />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='center'>
									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={async () => {
												const { statusText, success } =
													await mutation.mutateAsync({ id: not.id });
												if (success) toast(statusText, "success");
												if (!success) toast(statusText, "error");
											}}
										>
											Mark as read
										</DropdownMenuItem>
										<DropdownMenuItem
											variant='destructive'
											onClick={async () => {
												await dmutation.mutateAsync({ id: not.id });
											}}
										>
											Delete
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</CardAction>
					</CardHeader>
					<Link href={not.link ? `/app/${slug}/${not.link}` : "#"}>
						<CardDescription
							className={`px-5 ${not.status == "read" ? "text-gray-400" : ""}`}
						>
							{not.description}
						</CardDescription>
					</Link>
				</Card>
			))}
		</main>
	);
};

export default Page;
