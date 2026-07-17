"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
	CardAction,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
	getProvider,
	postProvider,
	updateProvider,
} from "@/lib/queries/providers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ProviderCard = ({
	gateway,
	provider,
}: {
	gateway: {
		provider: string;
		countries: "Global" | string[];
		logo?: string | undefined;
		description?: string | undefined;
		fallback: string;
	};
	provider: string;
}) => {
	const queryClient = useQueryClient();
	const currProvider = useQuery({
		queryKey: [`provider-${provider}`],
		queryFn: async () => {
			return await getProvider({ provider });
		},
	});
	const mutation = useMutation({
		mutationFn: postProvider,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({
				queryKey: [`provider-${provider}`],
			});
		},
	});
	const umutation = useMutation({
		mutationFn: updateProvider,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({
				queryKey: [`provider-${provider}`],
			});
		},
	});

	return (
		<Card size='sm' className='w-full'>
			<CardHeader className='flex items-end space-x-4'>
				<Avatar size='lg'>
					<AvatarImage src={gateway.logo} />
					<AvatarFallback>{gateway.provider}</AvatarFallback>
				</Avatar>
				<div className='gap-1 flex flex-col'>
					<CardTitle>{gateway.provider}</CardTitle>
					<CardDescription className='text-sm'>
						{gateway.description}
					</CardDescription>
				</div>
				<CardAction className='flex gap-1'>
					{!currProvider?.data?.id && (
						<Button
							onClick={async (e) => {
								e.preventDefault();
								await mutation.mutateAsync({
									provider: provider,
								});
							}}
						>
							Install
						</Button>
					)}
					{currProvider?.data?.id && (
						<Button asChild variant={"green"}>
							<Link href={`payments/configure/paystack`}>Configure</Link>
						</Button>
					)}
					{currProvider?.data?.is_enabled == false && (
						<Button
							onClick={async (e) => {
								e.preventDefault();
								await umutation.mutateAsync({
									provider: provider,
									data: { is_enabled: true },
								});
							}}
							variant={`green`}
						>
							Activate
						</Button>
					)}
					{currProvider?.data?.is_enabled == true && (
						<Button
							onClick={async (e) => {
								e.preventDefault();
								await umutation.mutateAsync({
									provider: gateway.provider,
									data: {
										is_enabled: false,
									},
								});
							}}
							variant={`destructive`}
						>
							Deactivate
						</Button>
					)}
				</CardAction>
			</CardHeader>
		</Card>
	);
};

export default ProviderCard;
