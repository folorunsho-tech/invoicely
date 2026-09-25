/* eslint-disable @typescript-eslint/no-explicit-any */
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
const OverdueModal = ({
	title,
	description,
	overdueFn,
	id,
	queryKey,
}: {
	title: string;
	description: string;
	overdueFn: ({ id }: { id: string }) => Promise<any>;
	id: string;
	queryKey: string[];
}) => {
	const queryClient = useQueryClient();
	const [open, setOpen] = React.useState(false);

	const mutation = useMutation({
		mutationFn: overdueFn,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className='cursor-pointer w-full' asChild>
				<Button variant='green' className='flex justify-start'>
					<span className='text-sm'>Mark as overdue</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={async (event) => {
						event.preventDefault();
						await mutation.mutateAsync({ id });
						setOpen(false);
					}}
					className='flex flex-col gap-4'
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<DialogFooter className='sm:justify-end'>
						<Button variant='destructive' type='submit'>
							Mark as overdue
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

export default OverdueModal;
