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
// import Link from "next/link";
import { format } from "date-fns";
import { removeMember } from "@/lib/queries/members";
import RemoveModal from "../modals/RemoveModal";

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
		accessorKey: "user.name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>{row.original.user?.name}</p>
		),
	},
	{
		accessorKey: "user.email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
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
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Created At' />
		),
		cell: ({ row }) => format(row.original.createdAt, "Pp") || null,
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
					{/* <DropdownMenuItem asChild className='cursor-pointer'>
						<Link href={`member/${row.original.id}`}>View</Link>
					</DropdownMenuItem> */}
					{/* <DropdownMenuItem asChild className='cursor-pointer'>
						<Link href={`member/${row.original.id}/update`}>Edit</Link>
					</DropdownMenuItem> */}
					<DropdownMenuItem
						variant='destructive'
						className='cursor-pointer'
						asChild
					>
						<RemoveModal
							title='Remove Member'
							description='Are you sure you want to remove this user from this organization?'
							removeFn={removeMember}
							id={row.original.id}
							orgId={row.original.organizationId}
							queryKey={["members"]}
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
