/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { verifyPayment } from "@/lib/queries/payment";
import { useMutation } from "@tanstack/react-query";
import { CircleCheckBig, CircleX } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
	const searchParams = useSearchParams();
	const status = searchParams.get("status");
	const reference = searchParams.get("tx_ref");
	const tnxId = searchParams.get("transaction_id");
	const mutation = useMutation({
		mutationFn: verifyPayment,
	});
	useEffect(() => {
		if (reference && tnxId) {
			mutation.mutate({ reference, tnxId });
		}
	}, [reference, tnxId]);
	return (
		<main className='p-5 bg-gray-100 h-dvh'>
			<Card className='w-1/2 mx-auto'>
				<CardHeader className='flex flex-col gap-4 items-center'>
					<CardTitle className='text-center'>Payment {status}</CardTitle>
					{status == "successful" && (
						<CircleCheckBig size={40} className='text-green-600' />
					)}
					{status == "failed" && <CircleX size={40} className='text-red-600' />}
					{status == "abandoned" && (
						<CircleX size={40} className='text-red-600' />
					)}
				</CardHeader>
			</Card>
		</main>
	);
};

export default Page;
