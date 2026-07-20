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
import { format } from "date-fns";
import { NumberFormatter } from "@mantine/core";
import { Badge } from "@/components/ui/badge";
import DeleteModal from "../modals/DeleteModal";
import { deleteInvoice, trashInvoice } from "@/lib/queries/invoice";
import TrashModal from "../modals/TrashModal";
const getStatusBadge = (status: string) => {
	switch (status) {
		case "TRASHED":
			return (
				<Badge variant='outline' className='text-red-500 border-red-500'>
					Trashed
				</Badge>
			);
		case "PENDING":
			return (
				<Badge variant='outline' className='text-yellow-500 border-yellow-500'>
					Pending
				</Badge>
			);
		case "DRAFT":
			return (
				<Badge variant='outline' className='text-gray-500 border-gray-500'>
					Draft
				</Badge>
			);
		case "OVERDUE":
			return (
				<Badge variant='outline' className='text-red-500 border-red-500'>
					Overdue
				</Badge>
			);
		case "PAID":
			return (
				<Badge variant='outline' className='text-green-500 border-green-500'>
					Paid
				</Badge>
			);
		case "CANCELLED":
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
		accessorKey: "invoiceNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='No' />
		),
		cell: ({ row }) => {
			return row.original.invoiceNumber;
		},
		enableHiding: false,
	},

	{
		accessorKey: "issued_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Issued At' />
		),
		cell: ({ row }) => format(row.original.issued_date, "dd/MM/yyyy"),
	},
	{
		accessorKey: "due_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Due At' />
		),
		cell: ({ row }) => format(row.original.due_date, "dd/MM/yyyy"),
	},
	{
		accessorKey: "client",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Client' />
		),
		cell: ({ row }) => row.original.client?.name,
	},
	{
		accessorKey: "project_subject",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Project / Subject' />
		),
		cell: ({ row }) => row.original.project_subject,
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Category' />
		),
		cell: ({ row }) => row.original.category?.name,
	},
	{
		accessorKey: "total",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Total' />
		),
		cell: ({ row }) => (
			<NumberFormatter
				value={row.original.total}
				prefix={row.original.organization?.currencySymbol}
				thousandSeparator
			/>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => getStatusBadge(row.original.status),
	},

	{
		accessorKey: "items",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Items' />
		),
		cell: ({ row }) => row.original._count?.items,
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
							href={`/app/${row.original.organization?.slug}/invoices/${row.original.id}`}
						>
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className='cursor-pointer'>
						<Link
							href={`/app/${row.original.organization?.slug}/invoices/${row.original.id}/update`}
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
							description='Are you sure you want to move this invoice to trash?'
							trashFn={trashInvoice}
							id={row.original.id}
							queryKey={["invoices"]}
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
export const rcolumns: ColumnDef<z.infer<typeof schema>>[] = [
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
		accessorKey: "invoiceNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='No' />
		),
		cell: ({ row }) => {
			return row.original.invoiceNumber;
		},
		enableHiding: false,
	},

	{
		accessorKey: "issued_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Issued At' />
		),
		cell: ({ row }) => format(row.original.issued_date, "dd/MM/yyyy"),
	},
	{
		accessorKey: "due_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Due At' />
		),
		cell: ({ row }) => format(row.original.due_date, "dd/MM/yyyy"),
	},
	{
		accessorKey: "project_subject",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Project / Subject' />
		),
		cell: ({ row }) => row.original.project_subject,
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Category' />
		),
		cell: ({ row }) => row.original.category?.name,
	},
	{
		accessorKey: "total",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Total' />
		),
		cell: ({ row }) => (
			<NumberFormatter
				value={row.original.total}
				prefix={row.original.organization?.currencySymbol}
				thousandSeparator
			/>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) =>
			getStatusBadge(row.original.is_deleted ? "TRASHED" : row.original.status),
	},

	{
		accessorKey: "items",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Items' />
		),
		cell: ({ row }) => row.original._count.items,
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
							href={`/app/${row.original.organization?.slug}/invoices/${row.original.id}`}
						>
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className='cursor-pointer'>
						<Link
							href={`/app/${row.original.organization?.slug}/invoices/${row.original.id}/update`}
						>
							Edit
						</Link>
					</DropdownMenuItem>
					{/* <DropdownMenuSeparator />
					<DropdownMenuItem
						variant='destructive'
						className='cursor-pointer'
						asChild
					>
						<TrashModal
							title='Move to Trash'
							description='Are you sure you want to move this invoice to trash?'
							trashFn={trashInvoice}
							id={row.original.id}
							queryKey={["invoices", "trash-invoices"]}
						/>
					</DropdownMenuItem> */}
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
		accessorKey: "invoiceNumber",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='No' />
		),
		cell: ({ row }) => {
			return row.original.invoiceNumber;
		},
		enableHiding: false,
	},

	{
		accessorKey: "issued_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Issued At' />
		),
		cell: ({ row }) => format(row.original.issued_date, "dd/MM/yyyy"),
	},
	{
		accessorKey: "due_date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Due At' />
		),
		cell: ({ row }) => format(row.original.due_date, "dd/MM/yyyy"),
	},
	{
		accessorKey: "project_subject",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Project / Subject' />
		),
		cell: ({ row }) => row.original?.project_subject,
	},
	{
		accessorKey: "category",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Category' />
		),
		cell: ({ row }) => row.original.category?.name,
	},
	{
		accessorKey: "total",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Total' />
		),
		cell: ({ row }) => (
			<NumberFormatter
				value={row.original.total}
				prefix={row.original.organization?.currencySymbol}
				thousandSeparator
			/>
		),
	},
	{
		accessorKey: "status",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Status' />
		),
		cell: ({ row }) => getStatusBadge(row.original.status),
	},

	{
		accessorKey: "items",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Items' />
		),
		cell: ({ row }) => row.original._count.items,
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
							href={`/app/${row.original.organization.slug}/invoices/${row.original.id}`}
						>
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className='cursor-pointer'>
						<Link
							href={`/app/${row.original.organization.slug}/invoices/${row.original.id}/update`}
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
							description='Are you sure you want to delete this invoice?'
							deleteFn={deleteInvoice}
							id={row.original.id}
							queryKey={["invoices", "trash-invoice"]}
						/>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
