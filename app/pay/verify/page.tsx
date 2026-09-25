/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { verifyPayment } from "@/lib/queries/payment";
import { useMutation } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { CircleCheckBig, CircleX } from "lucide-react";
import { use } from "react";

const Page = ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const reference = use(searchParams).tx_ref;
	const status = use(searchParams).status;
	const [tnxState, setTnxState] = useState<
		"successful" | "failed" | "abandoned" | "cancelled"
	>(status as "successful" | "failed" | "abandoned" | "cancelled");
	const mutation = useMutation({
		mutationFn: verifyPayment,
	});
	useEffect(() => {
		if (status !== "cancelled" && status !== "abandoned" && reference) {
			mutation.mutateAsync({ reference: String(reference) }).then((res) => {
				setTnxState(res?.payment?.status as "successful" | "failed");
			});
		}
	}, [reference, status]);
	return (
		<main className='p-5 bg-gray-100 h-dvh'>
			<Card className='w-1/2 mx-auto'>
				<CardHeader className='flex flex-col gap-4 items-center'>
					{tnxState && (
						<CardTitle className='text-center'>Payment {tnxState}</CardTitle>
					)}
				</CardHeader>
				<CardContent className='flex flex-col gap-4 items-center'>
					{tnxState == "successful" && (
						<CircleCheckBig size={40} className='text-green-600' />
					)}
					{tnxState == "failed" && (
						<CircleX size={40} className='text-red-600' />
					)}
					{tnxState == "abandoned" && (
						<CircleX size={40} className='text-red-600' />
					)}
					{tnxState == "cancelled" && (
						<CircleX size={40} className='text-red-600' />
					)}
				</CardContent>
			</Card>
		</main>
	);
};

export default Page;
