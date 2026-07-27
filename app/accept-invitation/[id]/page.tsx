"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	acceptInvitation,
	getInvitation,
	rejectInvitation,
} from "@/lib/queries/invitations";
// import { addExistingMember } from "@/lib/queries/members";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
	const { id }: { id: string } = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const invitation = useQuery({
		queryKey: [`invitation-${id}`],
		queryFn: async () => {
			return await getInvitation(id);
		},
	});
	// const mutation = useMutation({
	// 	mutationFn: addExistingMember,
	// 	onSuccess: () => {
	// 		// Invalidate and refetch
	// 		queryClient.invalidateQueries({ queryKey: [`members`] });
	// 	},
	// });
	const amutation = useMutation({
		mutationFn: acceptInvitation,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`invitation-${id}`] });
		},
	});
	const rmutation = useMutation({
		mutationFn: rejectInvitation,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`invitation-${id}`] });
		},
	});
	return (
		<main className='p-4 flex-col gap-6 items-center flex'>
			{invitation.data?.status == "pending" && (
				<div className='pt-6 space-y-4'>
					<Label className='text-xl'>Accept / reject Invitation</Label>
					<Card>
						<CardContent>
							Accept / reject invitation from{" "}
							<span className='font-semibold'>
								{invitation.data?.user?.name}
							</span>{" "}
							as{" "}
							<span className='font-semibold underline'>
								{invitation.data?.role}
							</span>{" "}
							to{" "}
							<span className='font-semibold'>
								{invitation.data?.organization?.name}
							</span>
							?
						</CardContent>
						<CardFooter className='gap-3'>
							<Button
								onClick={async (e) => {
									e.preventDefault();
									const res = await amutation.mutateAsync({
										id,
										email: invitation.data?.email,
									});
									if (res?.data) {
										// const response = await mutation.mutateAsync({
										// 	email: invitation.data?.email,
										// 	inviteId: id,
										// });
										// if (response) {
										// 	router.push("/app");
										// }
										router.push(`/auth/signin`);
									} else if (!res?.data) {
										router.push(`/auth/invite-signup?id=${id}`);
									}
								}}
								variant={`green`}
							>
								Accept
							</Button>
							<Button
								onClick={async (e) => {
									e.preventDefault();
									await rmutation.mutateAsync(id);
									router.refresh();
								}}
								variant={`destructive`}
							>
								Reject
							</Button>
						</CardFooter>
					</Card>
				</div>
			)}
			{invitation.data?.status == "accepted" && (
				<Label>Invitation has already beein accepted</Label>
			)}
			{invitation.data?.status == "canceled" && (
				<Label>Invitation has been cancelled</Label>
			)}
			{invitation.data?.status == "expired" && (
				<Label>Invitation has expired</Label>
			)}
			{invitation.data?.status == "rejected" && (
				<Label>Invitation has been rejected by you</Label>
			)}
		</main>
	);
};

export default Page;
