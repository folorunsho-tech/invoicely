"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type schema } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import z from "zod";
import { Checkbox } from "@/components/ui/checkbox";
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
import TrashModal from "../modals/TrashModal";
import { deleteClient, trashClient } from "@/lib/queries/client";
import DeleteModal from "../modals/DeleteModal";
export const columns: ColumnDef<z.infer<typeof schema>>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableSorting: true,
		enableHiding: false,
	},
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
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>{row.original.email}</p>
		),
	},
	{
		accessorKey: "phone",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Phone' />
		),
		cell: ({ row }) => row.original.phone,
	},
	{
		accessorKey: "address",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Address' />
		),
		cell: ({ row }) => row.original.address,
	},
	{
		accessorKey: "city",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='City' />
		),
		cell: ({ row }) => row.original.city,
	},
	{
		accessorKey: "state",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='State' />
		),
		cell: ({ row }) => row.original.state,
	},
	// {
	// 	accessorKey: "postCode",
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title='Zip Code' />
	// 	),
	// 	cell: ({ row }) => row.original.postCode,
	// },
	{
		accessorKey: "country",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Country' />
		),
		cell: ({ row }) => row.original.country,
	},
	{
		accessorKey: "invoices",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Invoices' />
		),
		cell: ({ row }) => row.original._count.invoices,
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
						<Link
							href={`/app/${row.original.organization.slug}/clients/${row.original.id}`}
						>
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className='cursor-pointer'>
						<Link
							href={`/app/${row.original.organization.slug}/clients/${row.original.id}/update`}
						>
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant='destructive'
						className='cursor-pointer'
						asChild
					>
						<TrashModal
							title='Move to Trash'
							description='Are you sure you want to move this client to trash?'
							trashFn={trashClient}
							id={row.original.id}
							queryKey={["clients"]}
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
export const tcolumns: ColumnDef<z.infer<typeof schema>>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableSorting: true,
		enableHiding: false,
	},
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
		accessorKey: "email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>{row.original.email}</p>
		),
	},
	{
		accessorKey: "phone",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Phone' />
		),
		cell: ({ row }) => row.original.phone,
	},
	{
		accessorKey: "address",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Address' />
		),
		cell: ({ row }) => row.original.address,
	},
	{
		accessorKey: "city",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='City' />
		),
		cell: ({ row }) => row.original.city,
	},
	{
		accessorKey: "state",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='State' />
		),
		cell: ({ row }) => row.original.state,
	},

	{
		accessorKey: "country",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Country' />
		),
		cell: ({ row }) => row.original.country,
	},
	{
		accessorKey: "invoices",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Invoices' />
		),
		cell: ({ row }) => row.original._count.invoices,
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
						<Link
							href={`/app/${row.original.organization.slug}/clients/${row.original.id}`}
						>
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className='cursor-pointer'>
						<Link
							href={`/app/${row.original.organization.slug}/clients/${row.original.id}/update`}
						>
							Edit
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant='destructive'
						className='cursor-pointer'
						asChild
					>
						<DeleteModal
							title='Delete Category'
							description='Are you sure you want to delete this client?'
							deleteFn={deleteClient}
							id={row.original.id}
							queryKey={["client", "trash-client"]}
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
