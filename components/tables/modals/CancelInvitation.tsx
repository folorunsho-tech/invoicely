"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelInvitation } from "@/lib/queries/invitations";
import { X } from "lucide-react";

const CancelInvitation = ({ id }: { id: string }) => {
	const queryClient = useQueryClient();
	const [open, setOpen] = React.useState(false);
	const mutation = useMutation({
		mutationFn: cancelInvitation,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["invitations"] });
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className='cursor-pointer w-full' asChild>
				<Button variant='destructive' className='flex justify-start'>
					<X /> Cancel
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						await mutation.mutateAsync(id);
						setOpen(false);
					}}
					className='flex flex-col gap-4'
				>
					<DialogHeader>
						<DialogTitle>Cancel invitatiom</DialogTitle>
						<DialogDescription>Cancel this invitation</DialogDescription>
					</DialogHeader>

					<DialogFooter className='sm:justify-end'>
						<Button variant='destructive' type='submit'>
							Cancel invitation
						</Button>
						<DialogClose asChild>
							<Button variant='outline' type='button'>
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CancelInvitation;
