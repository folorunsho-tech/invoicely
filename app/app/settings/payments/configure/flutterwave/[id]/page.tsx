"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { getProvider, updateProvider } from "@/lib/queries/providers";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
// import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { PasswordInput } from "@mantine/core";
import { useParams } from "next/navigation";

const Page = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();
	const [isEnabled, setIsEnabled] = useState(false);
	// const [publicKey, setPublicKey] = useState<string>("");
	const [secretKey, setSecretKey] = useState<string>("");
	const [webhookSecret, setWebhookSecret] = useState<string>("");

	const flutterwave = useQuery({
		queryKey: [`provider-flutterwave-${id}`],
		queryFn: async () => {
			return await getProvider({ id: String(id) });
		},
		staleTime: 10,
	});
	const mutation = useMutation({
		mutationFn: updateProvider,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({
				queryKey: [`provider-flutterwave-${id}`, "providers"],
			});
		},
	});
	const onsubmit = async () => {
		const data = {
			isEnabled,
			secretKey,
			// publicKey,
			webhookSecret,
		};
		await mutation.mutateAsync({
			data,
			id: String(id),
		});
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsEnabled(flutterwave.data?.isEnabled);
		// setPublicKey(flutterwave.data?.publicKey);
		setSecretKey(flutterwave.data?.secretKey);
		setWebhookSecret(flutterwave.data?.webhookSecret);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flutterwave.isLoading]);

	return (
		<main className='flex-col flex gap-6 p-2 bg-white h-dvh'>
			<div className='flex justify-between'>
				<Button asChild>
					<Link
						href={`/app/settings/payments`}
						className='w-fit flex gap-2 items-center'
					>
						<ArrowLeft />
						Go back
					</Link>
				</Button>
				<Label className='text-lg font-semibold'>
					Flutterwave configuration
				</Label>
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onsubmit();
				}}
			>
				<FieldSet className='mx-auto max-w-lg'>
					<FieldGroup>
						<Field orientation='horizontal'>
							<Checkbox
								checked={isEnabled}
								onCheckedChange={(checked) => {
									if (checked) {
										setIsEnabled(true);
									} else {
										setIsEnabled(false);
									}
								}}
								className='border-gray-800'
							/>
							<FieldLabel htmlFor='is_enabled'> Enable Flutterwave</FieldLabel>
						</Field>
					</FieldGroup>

					<FieldGroup>
						<Field>
							<FieldLabel htmlFor='secret_key'>Secret Key</FieldLabel>

							<PasswordInput
								value={secretKey}
								onChange={(e) => {
									setSecretKey(e.currentTarget.value);
								}}
								variant='default'
							/>
							<FieldDescription>Enter your Secret Key here</FieldDescription>
						</Field>

						<Field>
							<FieldLabel htmlFor='webhook_secret'>Webhook Secret</FieldLabel>

							<PasswordInput
								value={webhookSecret}
								onChange={(e) => {
									setWebhookSecret(e.currentTarget.value);
								}}
								variant='default'
							/>
							<FieldDescription>
								Enter your Webhook Secret here
							</FieldDescription>
						</Field>
					</FieldGroup>

					<Field orientation='horizontal' className='flex justify-end'>
						<Button asChild className='cursor-pointer' variant='destructive'>
							<Link href={`/app/settings/payments`}>Cancel</Link>
						</Button>
						<Button
							type='submit'
							className='cursor-pointer'
							disabled={mutation.isPending}
						>
							Save Changes
						</Button>
					</Field>
				</FieldSet>
			</form>
		</main>
	);
};

export default Page;
