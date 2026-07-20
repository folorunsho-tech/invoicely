"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { initTransaction } from "@/lib/queries/payment";
import { popup } from "@/lib/providers/paystack";
import { useEffect } from "react";
const Page = () => {
	const { id }: { id: string } = useParams();
	const searchParams = useSearchParams();
	const reference = searchParams.get("ref");
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: initTransaction,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`invoice-${id}`] });
		},
	});

	return <div>Please wait...</div>;
};

export default Page;
