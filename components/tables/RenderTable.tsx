/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ChevronsLeftIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsRightIcon,
} from "lucide-react";
import { fuzzyFilter } from "./funcs/fuzzy";

export function RenderTable({
	columns,
	data,
	DataTableToolbar,
	// bulkTrashFn,
	// queryKey,
}: {
	columns: ColumnDef<any>[];
	data: z.infer<any>[];
	DataTableToolbar?: React.ComponentType<{
		table: unknown;
	}>;
	schema: z.ZodObject<any>;
	bulkTrashFn?: (
		ids: {
			id: string;
		}[],
	) => Promise<any>;
	queryKey?: string;
}) {
	const [rowSelection, setRowSelection] = React.useState({});
	// const [bulkActionSelect, setBulkAction] =
	// 	React.useState<string>("bulkaction");
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 25,
	});
	// const queryClient = useQueryClient();
	// const mutation = useMutation({
	// 	mutationFn: bulkTrashFn,
	// 	onSuccess: () => {
	// 		// Invalidate and refetch
	// 		queryClient.invalidateQueries({ queryKey: [queryKey] });
	// 	},
	// });
	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination,
		},
		initialState: {
			pagination: {
				pageSize: 25,
			},
		},
		filterFns: {
			fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<section
			defaultValue='outline'
			className='w-full flex-col justify-start gap-6'
		>
			{DataTableToolbar && (
				<div className='flex items-center justify-between'>
					<DataTableToolbar table={table} />
				</div>
			)}
			<div className='relative flex flex-col gap-4 overflow-auto'>
				<div className='overflow-hidden rounded-lg border'>
					<Table>
						<TableHeader className='sticky top-0 z-10 bg-muted'>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className='**:data-[slot=table-cell]:first:w-8'>
							{table.getRowModel().rows?.length ? (
								<>
									{table.getRowModel().rows.map((row) => (
										<TableRow
											data-state={row.getIsSelected() && "selected"}
											key={row.id}
											className='relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									))}
								</>
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className='h-24 text-center'
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className='flex items-center justify-between px-4'>
					<div className='hidden flex-1 text-sm text-muted-foreground lg:flex'>
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
						{/* {table.getFilteredSelectedRowModel().rows.length && (
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
									if (bulkActionSelect == "permdelete") {
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
											<SelectItem value='permdelete'>
												Permanently delete
											</SelectItem>
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
						)} */}
					</div>
					<div className='flex w-full items-center gap-8 lg:w-fit'>
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
									<SelectValue
										placeholder={table.getState().pagination.pageSize}
									/>
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
								<ChevronsLeftIcon />
							</Button>
							<Button
								variant='outline'
								className='size-8'
								size='icon'
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span className='sr-only'>Go to previous page</span>
								<ChevronLeftIcon />
							</Button>
							<Button
								variant='outline'
								className='size-8'
								size='icon'
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span className='sr-only'>Go to next page</span>
								<ChevronRightIcon />
							</Button>
							<Button
								variant='outline'
								className='hidden size-8 lg:flex'
								size='icon'
								onClick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span className='sr-only'>Go to last page</span>
								<ChevronsRightIcon />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
