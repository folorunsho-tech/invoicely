"use client";
import { type Table } from "@tanstack/react-table";
import { PlusIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	const { slug } = useParams();
	return (
		<div className='flex items-center justify-between flex-wrap gap-2 sm:gap-0'>
			<div className='flex flex-1 flex-wrap items-center gap-2'>
				<Input
					placeholder='Search payments...'
					// value={""}
					onChange={(event) => {
						table.setGlobalFilter(String(event.target.value));
					}}
					className='h-8 w-37.5 lg:w-62.5'
				/>
				{table.getColumn("status") && (
					<DataTableFacetedFilter
						column={table.getColumn("status")}
						title='Status'
						options={[
							{
								label: "Pending",
								value: "Pending",
							},
							{
								label: "Cancelled",
								value: "Cancelled",
							},
							{
								label: "Successful",
								value: "Successful",
							},
							{
								label: "Failed",
								value: "Failed",
							},
						]}
					/>
				)}
				{/* {table.getColumn("channel") && (
					<DataTableFacetedFilter
						column={table.getColumn("channel")}
						title='Channel'
						options={[
							{
								label: "Failed",
								value: "Failed",
							},
						]}
					/>
				)} */}

				{table.getColumn("provider") && (
					<DataTableFacetedFilter
						column={table.getColumn("provider")}
						title='Provider'
						options={[
							{
								label: "Manual",
								value: "Manual",
							},
							{
								label: "Paystack",
								value: "Paystack",
							},
							{
								label: "Flutterwave",
								value: "Flutterwave",
							},
						]}
					/>
				)}
				{isFiltered && (
					<Button
						variant='ghost'
						size='sm'
						onClick={() => table.resetColumnFilters()}
					>
						Reset
						<X />
					</Button>
				)}
			</div>
			<div className='flex items-center gap-2'>
				{/* <Button size='sm' asChild variant='destructive'>
					<Link href={`/app/${slug}/clients/trash`}>
						<Trash className='mr-2 h-4 w-4' />
						Trash
					</Link>
				</Button> */}
				<Button size='sm' asChild>
					<Link href={`/app/${slug}/payments/create`}>
						<PlusIcon className='mr-2 h-4 w-4' />
						Manual Payment
					</Link>
				</Button>
			</div>
		</div>
	);
}
