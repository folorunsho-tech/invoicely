/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { initTransaction, isInvoicePaid } from "@/lib/queries/payment";
import { popup } from "@/lib/providers/paystack";
import { useEffect } from "react";
const Page = () => {
	const { id }: { id: string } = useParams();
	const invoice = useQuery({
		queryKey: [`ispaid-${id}`],
		queryFn: async () => {
			return await isInvoicePaid(id);
		},
	});
	const mutation = useMutation({
		mutationFn: initTransaction,
	});
	useEffect(() => {
		if (!invoice.data?.paid) {
			mutation.mutateAsync(id).then((res) => {
				popup.resumeTransaction(res?.access_code);
			});
		}
	}, [invoice.isLoading]);
	if (invoice.data?.paid) {
		return <div>Invoice has been paid</div>;
	}
	return <div>Please wait...</div>;
};

export default Page;
