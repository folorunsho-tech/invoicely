/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { type Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	bulkTrashFn?: (
		ids: {
			id: string;
		}[],
	) => Promise<any>;
	queryKey?: string;
	showTrashAction?: boolean;
}

export function DataTablePagination<TData>({
	table,
	bulkTrashFn,
	queryKey,
	showTrashAction,
}: DataTablePaginationProps<TData>) {
	const [bulkActionSelect, setBulkAction] = useState<string>("bulkaction");
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: bulkTrashFn,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [queryKey] });
		},
	});
	return (
		<div className='flex items-center justify-between px-4'>
			{showTrashAction && (
				<div className='hidden flex-1 items-center gap-5 text-sm text-muted-foreground lg:flex'>
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
					{table.getFilteredSelectedRowModel().rows.length &&
						showTrashAction && (
							<form
								className='flex items-center gap-4'
								onSubmit={async (e) => {
									e.preventDefault();
									const data = table
										.getFilteredSelectedRowModel()
										.rows.map((r) => r.original);
									const ids = data.map((d: any) => ({
										id: d?.id,
									}));
									if (bulkActionSelect == "trashaction") {
										await mutation.mutateAsync(ids);
									}
								}}
							>
								<Select
									value={bulkActionSelect}
									onValueChange={(value) => {
										setBulkAction(value);
									}}
								>
									<SelectTrigger size='sm' id='bulkaction'>
										<SelectValue placeholder={bulkActionSelect} />
									</SelectTrigger>
									<SelectContent side='top'>
										<SelectGroup>
											<SelectItem value='bulkaction'>Bulk Action</SelectItem>
											<SelectItem value='trashaction'>Move to trash</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<Button
									variant='default'
									disabled={bulkActionSelect == "bulkaction"}
									className='cursor-pointer'
								>
									Apply
								</Button>
							</form>
						)}
				</div>
			)}
			<div className='flex w-full items-center gap-8 lg:w-fit self-end'>
				<div className='hidden items-center gap-2 lg:flex'>
					<Label htmlFor='rows-per-page' className='text-sm font-medium'>
						Rows per page
					</Label>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger size='sm' className='w-20' id='rows-per-page'>
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side='top'>
							<SelectGroup>
								{[10, 20, 25, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className='flex w-fit items-center justify-center text-sm font-medium'>
					Page {table.getState().pagination.pageIndex + 1} of{" "}
					{table.getPageCount()}
				</div>
				<div className='ml-auto flex items-center gap-2 lg:ml-0'>
					<Button
						variant='outline'
						className='hidden h-8 w-8 p-0 lg:flex'
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant='outline'
						className='size-8'
						size='icon'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant='outline'
						className='size-8'
						size='icon'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className='sr-only'>Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant='outline'
						className='hidden size-8 lg:flex'
						size='icon'
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className='sr-only'>Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
