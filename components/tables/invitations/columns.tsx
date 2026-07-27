"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type schema } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import z from "zod";
// import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import { format } from "date-fns";

import CancelInvitation from "../modals/CancelInvitation";
import { Badge } from "@/components/ui/badge";
const getStatusBadge = (status: string) => {
	switch (status) {
		case "pending":
			return (
				<Badge variant='outline' className='text-yellow-500 border-yellow-500'>
					Pending
				</Badge>
			);

		case "rejected":
			return (
				<Badge variant='outline' className='text-red-500 border-red-500'>
					Rejected
				</Badge>
			);
		case "accepted":
			return (
				<Badge variant='outline' className='text-green-500 border-green-500'>
					Accepted
				</Badge>
			);
		case "expired":
			return (
				<Badge
					variant='outline'
					className='text-destructive border-destructive'
				>
					Expired
				</Badge>
			);
		case "canceled":
			return (
				<Badge
					variant='outline'
					className='text-destructive border-destructive'
				>
					Cancelled
				</Badge>
			);
	}
};

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
	// {
	// 	id: "select",
	// 	header: ({ table }) => (
	// 		<Checkbox
	// 			checked={
	// 				table.getIsAllPageRowsSelected() ||
	// 				(table.getIsSomePageRowsSelected() && "indeterminate")
	// 			}
	// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	// 			aria-label='Select all'
	// 		/>
	// 	),
	// 	cell: ({ row }) => (
	// 		<Checkbox
	// 			checked={row.getIsSelected()}
	// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
	// 			aria-label='Select row'
	// 		/>
	// 	),
	// 	enableSorting: true,
	// 	enableHiding: false,
	// },

	{
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Invited' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>{row.original.email}</p>
		),
	},
	{
		accessorKey: "user.name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Inviter Name' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>{row.original.user?.name}</p>
		),
	},
	{
		accessorKey: "user.email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Inviter Email' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>{row.original.user?.email}</p>
		),
	},
	{
		accessorKey: "role",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Role' />
		),
		cell: ({ row }) => row.original.role,
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => getStatusBadge(row.original.status),
	},

	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Created At' />
		),
		cell: ({ row }) => format(row.original.createdAt, "Pp") || null,
	},

	{
		accessorKey: "expiresAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Expires At' />
		),
		cell: ({ row }) => format(row.original.expiresAt, "Pp") || null,
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='ghost'
						className='flex size-8 text-muted-foreground data-[state=open]:bg-muted'
						size='icon'
					>
						<EllipsisVerticalIcon />
						<span className='sr-only'>Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-32 cursor-pointer'>
					<DropdownMenuItem
						variant='destructive'
						className='cursor-pointer'
						asChild
					>
						<CancelInvitation id={row.original.id} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
