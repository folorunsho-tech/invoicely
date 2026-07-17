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
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
const DeleteModal = ({
	title,
	description,
	deleteFn,
	id,
	queryKey,
	redirect,
	redirectTo = "#",
}: {
	title: string;
	description: string;
	deleteFn: ({ id }: { id: string }) => Promise<any>;
	id: string;
	queryKey: string[];
	redirect?: boolean;
	redirectTo?: string;
}) => {
	const queryClient = useQueryClient();
	const [open, setOpen] = React.useState(false);
	const router = useRouter();
	const mutation = useMutation({
		mutationFn: deleteFn,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className='cursor-pointer w-full' asChild>
				<Button variant='destructive' className='flex justify-start'>
					<Trash /> Delete
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={async (event) => {
						event.preventDefault();
						await mutation.mutateAsync({ id });
						setOpen(false);
						if (redirect) router.push(redirectTo);
					}}
					className='flex flex-col gap-4'
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<DialogFooter className='sm:justify-end'>
						<Button variant='destructive' type='submit'>
							Delete
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

export default DeleteModal;
