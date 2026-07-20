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
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import Link from "next/link";
import { NumberFormatter } from "@mantine/core";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string) => {
	switch (status) {
		case "Pending":
			return (
				<Badge variant='outline' className='text-yellow-500 border-yellow-500'>
					Pending
				</Badge>
			);

		case "Failed":
			return (
				<Badge variant='outline' className='text-red-500 border-red-500'>
					Failed
				</Badge>
			);
		case "Successful":
			return (
				<Badge variant='outline' className='text-green-500 border-green-500'>
					Successful
				</Badge>
			);
		case "Cancelled":
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
		accessorKey: "invoice",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Invoice' />
		),
		cell: ({ row }) => {
			return row.original.invoice?.invoiceNumber;
		},
		enableHiding: false,
	},
	{
		accessorKey: "paid_at",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Paid On' />
		),
		cell: ({ row }) => format(row.original.paid_at, "Pp") || null,
	},
	{
		accessorKey: "client_name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Client Name' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>
				{row.original.invoice?.client?.name}
			</p>
		),
	},
	{
		accessorKey: "client_email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Client Email' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>
				{row.original.invoice?.client?.email}
			</p>
		),
	},
	{
		accessorKey: "provider",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Provider' />
		),
		cell: ({ row }) => row.original.gateway.provider,
	},
	{
		accessorKey: "provider_reference",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Reference' />
		),
		cell: ({ row }) => (
			<span className='max-w-[45ch] truncate'>
				{row.original.provider_transaction_id}
			</span>
		),
	},
	{
		accessorKey: "channel",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Channel' />
		),
		cell: ({ row }) => row.original.channel,
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Amount' />
		),
		cell: ({ row }) => (
			<NumberFormatter
				value={row.original.amount}
				prefix={row.original?.organization?.currencySymbol || "N"}
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
							href={`/app/${row.original.organization.slug}/payments/${row.original.id}`}
						>
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className='cursor-pointer'
						disabled={row.original.type !== "PROVIDER"}
					>
						<Link
							href={`/app/${row.original.organization.slug}/payments/${row.original.id}/update`}
						>
							Edit
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
export const rcolumns: ColumnDef<z.infer<typeof schema>>[] = [
	{
		accessorKey: "invoice",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Invoice' />
		),
		cell: ({ row }) => {
			return row.original.invoice?.invoiceNumber;
		},
		enableHiding: false,
	},
	{
		accessorKey: "paid_at",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Paid On' />
		),
		cell: ({ row }) => format(row.original.paid_at, "Pp") || null,
	},
	{
		accessorKey: "client_name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Client Name' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>
				{row.original.invoice?.client?.name}
			</p>
		),
	},
	{
		accessorKey: "client_email",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Client Email' />
		),
		cell: ({ row }) => (
			<p className='max-w-[45ch] truncate'>
				{row.original.invoice?.client?.email}
			</p>
		),
	},
	{
		accessorKey: "provider",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Provider' />
		),
		cell: ({ row }) => row.original.gateway.provider,
	},
	{
		accessorKey: "provider_reference",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Reference' />
		),
		cell: ({ row }) => (
			<span className='max-w-[45ch] truncate'>
				{row.original.provider_transaction_id}
			</span>
		),
	},
	{
		accessorKey: "channel",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Channel' />
		),
		cell: ({ row }) => row.original.channel,
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Amount' />
		),
		cell: ({ row }) => (
			<NumberFormatter
				value={row.original.amount}
				prefix={row.original?.organization?.currencySymbol || "N"}
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
							href={`/app/${row.original.organization.slug}/payments/${row.original.id}`}
						>
							View
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						asChild
						className='cursor-pointer'
						disabled={row.original.type !== "PROVIDER"}
					>
						<Link
							href={`/app/${row.original.organization.slug}/payments/${row.original.id}/update`}
						>
							Edit
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		),
	},
];
