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
import { LogOut } from "lucide-react";
const RemoveModal = ({
	title,
	description,
	removeFn,
	queryKey,
	id,
	orgId,
}: {
	title: string;
	description: string;
	removeFn: ({ id, orgId }: { id: string; orgId: string }) => Promise<any>;
	queryKey: string[];
	id: string;
	orgId: string;
}) => {
	const queryClient = useQueryClient();
	const [open, setOpen] = React.useState(false);
	const mutation = useMutation({
		mutationFn: removeFn,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey });
		},
	});
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className='cursor-pointer w-full' asChild>
				<Button variant='destructive' className='flex justify-start'>
					<LogOut /> Remove
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form
					onSubmit={async (event) => {
						event.preventDefault();
						await mutation.mutateAsync({ id, orgId });
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
							Remove
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

export default RemoveModal;
