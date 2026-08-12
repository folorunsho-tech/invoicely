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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import DeleteModal from "../modals/DeleteModal";
import { deleteCategory } from "@/lib/queries/category";
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
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		),
		cell: ({ row }) => {
			return <p className='max-w-[45ch] truncate'>{row.original.name}</p>;
		},
		enableHiding: false,
	},
	{
		accessorKey: "description",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Description' />
		),
		cell: ({ row }) => {
			return (
				<p className='max-w-[45ch] truncate'>{row.original.description}</p>
			);
		},
		enableHiding: false,
	},
	{
		accessorKey: "invoices",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Invoices' />
		),
		cell: ({ row }) => {
			return (
				<p className='max-w-[45ch] truncate'>{row.original._count?.invoices}</p>
			);
		},
		enableHiding: false,
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
					<DropdownMenuItem asChild className='cursor-pointer'>
						<Link href={`/app/categories/${row.original.id}`}>View</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className='cursor-pointer'>
						<Link href={`/app/categories/${row.original.id}/update`}>Edit</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant='destructive'
						className='cursor-pointer'
						asChild
					>
						<DeleteModal
							title='Delete Category'
							description='Are you sure you want to delete this category?'
							deleteFn={deleteCategory}
							id={row.original.id}
							queryKey={["categories"]}
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
