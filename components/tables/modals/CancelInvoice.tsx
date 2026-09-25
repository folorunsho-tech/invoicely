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
const CancelModal = ({
	title,
	description,
	cancelFn,
	id,
	queryKey,
}: {
	title: string;
	description: string;
	cancelFn: ({ id }: { id: string }) => Promise<any>;
	id: string;
	queryKey: string[];
}) => {
	const queryClient = useQueryClient();
	const [open, setOpen] = React.useState(false);

	const mutation = useMutation({
		mutationFn: cancelFn,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className='cursor-pointer w-full' asChild>
				<Button variant='destructive' className='flex justify-start'>
					<span className='text-sm'>Cancel invoice</span>
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
							Mark as cancelled
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

export default CancelModal;
