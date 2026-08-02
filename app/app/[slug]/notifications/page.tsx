"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	deleteNotification,
	getAllNotifications,
	markAllNotifications,
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
import { ArrowLeft, Check, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "@/lib/toaster";
import { format } from "date-fns";
import { useNotifications } from "@/hooks/use-notifications";
const Page = () => {
	const { slug }: { slug: string } = useParams();

	const router = useRouter();
	const queryClient = useQueryClient();
	const { notifications, markOneRead, markAllRead, deleteOne } =
		useNotifications();

	const mutation = useMutation({
		mutationFn: markNotification,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
	});
	const amutation = useMutation({
		mutationFn: markAllNotifications,
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
			<div className='flex items-center justify-between'>
				<Button
					className='w-fit flex gap-2 items-center'
					onClick={() => {
						router.back();
					}}
				>
					<ArrowLeft />
					Go back
				</Button>
				<Button
					className='w-fit flex gap-2 items-center'
					onClick={async () => {
						const toMark = notifications.map((not) => ({ id: not.id }));
						await amutation.mutateAsync(toMark);
						markAllRead();
					}}
					variant={`green`}
				>
					<Check />
					Mark all as read
				</Button>
			</div>
			{notifications?.map((not) => (
				<Card key={not.id}>
					<CardHeader
						className={`flex justify-between items-center ${not.status == "read" ? "text-gray-400" : ""}`}
					>
						<Label>{not.title}</Label>
						<div className='flex gap-3 items-center'>
							<Label>{format(not.timestamp, "Pp")}</Label>
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
													markOneRead(not.id);
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
													deleteOne(not.id);
												}}
											>
												Delete
											</DropdownMenuItem>
										</DropdownMenuGroup>
									</DropdownMenuContent>
								</DropdownMenu>
							</CardAction>
						</div>
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
