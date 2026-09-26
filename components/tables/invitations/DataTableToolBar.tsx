"use client";
import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";
import InviteMember from "../modals/InviteMember";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0;
	return (
		<div className='flex items-center justify-between flex-wrap gap-2 sm:gap-0'>
			<div className='flex flex-1 flex-wrap items-center gap-2'>
				<Input
					placeholder='Search invitations...'
					// value={""}
					onChange={(event) => {
						table.setGlobalFilter(String(event.target.value));
					}}
					className='h-8 w-37.5 lg:w-62.5'
				/>
				{table.getColumn("role") && (
					<DataTableFacetedFilter
						column={table.getColumn("role")}
						title='Roles'
						options={[
							{
								label: "owner",
								value: "owner",
							},
							{
								label: "admin",
								value: "admin",
							},
							{
								label: "editor",
								value: "editor",
							},
							{
								label: "member",
								value: "member",
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
				<InviteMember />
			</div>
		</div>
	);
}
