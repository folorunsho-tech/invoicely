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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { PasswordInput } from "@mantine/core";

const Page = () => {
	const queryClient = useQueryClient();
	const [isActive, setIsActive] = useState(false);
	const [publicKey, setPublicKey] = useState<string>("");
	const [secretKey, setSecretKey] = useState<string>("");
	const [webhookSecret, setWebhookSecret] = useState<string>("");

	const flutterwave = useQuery({
		queryKey: [`provider-flutterwave`],
		queryFn: async () => {
			return await getProvider({ provider: "flutterwave" });
		},
	});
	const mutation = useMutation({
		mutationFn: updateProvider,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`provider-flutterwave`] });
		},
	});
	// const [showTestInputs, setShowTestInputs] = useState(
	// 	!flutterwave.data?.is_live,
	// );
	const onsubmit = async () => {
		const data = {
			isActive,
			secretKey,
			publicKey,
			webhookSecret,
		};
		// console.log(data);
		await mutation.mutateAsync({
			data,
			provider: "flutterwave",
		});
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsActive(flutterwave.data?.isActive);
		setPublicKey(flutterwave.data?.publicKey);
		setSecretKey(flutterwave.data?.secretKey);
		setWebhookSecret(flutterwave.data?.webhookSecret);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flutterwave.isLoading]);

	// useEffect(() => {
	// 	// eslint-disable-next-line react-hooks/set-state-in-effect
	// 	setPublicKey(flutterwave.data?.publicKey);
	// 	setSecretKey(flutterwave.data?.secretKey);
	// 	setWebhookSecret(flutterwave.data?.webhookSecret);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [showTestInputs]);
	return (
		<main className='flex-col flex gap-6 p-2 bg-white'>
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
								checked={isActive}
								onCheckedChange={(checked) => {
									if (checked) {
										setIsActive(true);
									} else {
										setIsActive(false);
									}
								}}
								className='border-gray-800'
							/>
							<FieldLabel htmlFor='is_enabled'> Enable Flutterwave</FieldLabel>
						</Field>
						{/* 
						<Field orientation='horizontal'>
							<Checkbox
								checked={is_test}
								onCheckedChange={(checked) => {
									if (checked) {
										setIsTest(true);
										setShowTestInputs(true);
									} else {
										setIsTest(false);
										setShowTestInputs(false);
									}
								}}
								className='border-gray-800'
							/>
							<FieldLabel htmlFor='is_test'>Enable test mode</FieldLabel>
						</Field> */}
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
							<FieldLabel htmlFor='public_key'>Public Key</FieldLabel>

							<Input
								id='public_key'
								value={publicKey}
								onChange={(e) => {
									setPublicKey(e.currentTarget.value);
								}}
							/>
							<FieldDescription>Enter your Public Key here</FieldDescription>
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

					{/* {!showTestInputs && (
						<FieldGroup>
							<Field>
									setPublicKey(e.currentTarget.value);
								}}
							/>
							<FieldDescription>Enter your Public Key here</FieldDescription>
						</Field>
					</FieldGroup>

					{/* {!showTestInputs && (
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor='live_secret_key'>
									Live Secret Key
								</FieldLabel>

								<Input
									id='live_secret_key'
									value={live_secret_key}
									onChange={(e) => {
										setLiveSecretKey(e.currentTarget.value);
									}}
								/>
								<FieldDescription>
									Enter your Live Secret Key here
								</FieldDescription>
							</Field>
							<Field>
								<FieldLabel htmlFor='live_public_key'>
									Live Public Key
								</FieldLabel>

								<Input
									id='live_public_key'
									value={live_public_key}
									onChange={(e) => {
										setLivePublicKey(e.currentTarget.value);
									}}
								/>
								<FieldDescription>
									Enter your Live Public Key here
								</FieldDescription>
							</Field>
						</FieldGroup>
					)} */}

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
