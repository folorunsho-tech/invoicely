/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { SetFieldValue } from "react-hook-form";

export function DatePicker({
	date,
	setDate,
	field,
}: {
	date: Date;
	setDate: SetFieldValue<any>;
	field: string;
}) {
	return (
		<Popover>
			<PopoverTrigger
				asChild
				className='justify-start text-left font-normal data-[empty=true]:text-muted-foreground'
			>
				<Button variant='outline' data-empty={!date} className='flex gap-6'>
					{date ? format(date, "PPP") : <span>Pick a date</span>}
					<CalendarIcon className='text-indigo-500' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					mode='single'
					selected={date}
					onSelect={(v) => {
						setDate(field, v);
					}}
					required
				/>
			</PopoverContent>
		</Popover>
	);
}
