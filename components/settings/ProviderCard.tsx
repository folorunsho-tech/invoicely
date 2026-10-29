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
import { postProvider, toggleProvider } from "@/lib/queries/providers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Gateway } from "@/generated/prisma/client";

const ProviderCard = ({
	gateway,
	meta,
}: {
	meta: {
		name: string;
		description: string;
		logo: string;
		label: string;
		fallback: string;
	};
	gateway: Gateway;
}) => {
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: postProvider,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({
				queryKey: [`providers`],
			});
		},
	});
	const umutation = useMutation({
		mutationFn: toggleProvider,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({
				queryKey: [`providers`],
			});
		},
	});

	return (
		<Card size='sm' className='w-full'>
			<CardHeader className='flex items-end space-x-4'>
				<Avatar size='lg'>
					<AvatarImage src={meta.logo} />
					<AvatarFallback>{meta.fallback}</AvatarFallback>
				</Avatar>
				<div className='gap-1 flex flex-col'>
					<CardTitle>{meta.label}</CardTitle>
					<CardDescription className='text-sm'>
						{meta.description}
					</CardDescription>
				</div>
				<CardAction className='flex gap-1'>
					{!gateway?.id && (
						<Button
							onClick={async (e) => {
								e.preventDefault();
								await mutation.mutateAsync({
									provider: meta.name,
								});
							}}
						>
							Install
						</Button>
					)}
					{gateway?.id && (
						<Button asChild variant={"green"}>
							<Link
								href={`payments/configure/${gateway?.provider}/${gateway?.id}`}
							>
								Configure
							</Link>
						</Button>
					)}
					{gateway?.isEnabled == false && (
						<Button
							onClick={async (e) => {
								e.preventDefault();
								await umutation.mutateAsync({
									id: gateway?.id,
									data: { isEnabled: true },
								});
							}}
							variant={`green`}
						>
							Activate
						</Button>
					)}
					{gateway?.isEnabled == true && (
						<Button
							onClick={async (e) => {
								e.preventDefault();
								await umutation.mutateAsync({
									id: gateway?.id,
									data: {
										isEnabled: false,
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
