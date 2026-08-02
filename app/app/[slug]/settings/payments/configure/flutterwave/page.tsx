"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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

const Page = () => {
	const { slug }: { slug: string } = useParams();
	const queryClient = useQueryClient();
	const [is_test, setIsTest] = useState(false);
	const [is_enabled, setIsEnabled] = useState(false);
	const [test_public_key, setTestPublicKey] = useState<string>("");
	const [test_secret_key, setTestSecretKey] = useState<string>("");
	const [live_public_key, setLivePublicKey] = useState<string>("");
	const [live_secret_key, setLiveSecretKey] = useState<string>("");

	const flutterwave = useQuery({
		queryKey: [`provider-Flutterwave`],
		queryFn: async () => {
			return await getProvider({ provider: "Flutterwave" });
		},
	});
	const mutation = useMutation({
		mutationFn: updateProvider,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: [`provider-Flutterwave`] });
		},
	});
	const [showTestInputs, setShowTestInputs] = useState(
		!flutterwave.data?.is_live,
	);
	const onsubmit = async () => {
		const data = {
			is_enabled,
			is_live: !is_test,
			test_public_key: test_public_key || null,
			test_secret_key: test_secret_key || null,
			live_public_key: live_public_key || null,
			live_secret_key: live_secret_key || null,
		};
		// console.log(data);
		await mutation.mutateAsync({
			data,
			provider: "Flutterwave",
		});
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsEnabled(flutterwave.data?.is_enabled);
		setIsTest(!flutterwave.data?.is_live);
		setTestPublicKey(flutterwave.data?.test_public_key);
		setTestSecretKey(flutterwave.data?.test_secret_key);
		setLivePublicKey(flutterwave.data?.live_public_key);
		setLiveSecretKey(flutterwave.data?.live_secret_key);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flutterwave.isLoading]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTestPublicKey(flutterwave.data?.test_public_key);
		setTestSecretKey(flutterwave.data?.test_secret_key);
		setLivePublicKey(flutterwave.data?.live_public_key);
		setLiveSecretKey(flutterwave.data?.live_secret_key);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showTestInputs]);
	return (
		<main className='flex-col flex gap-6 py-2 '>
			<div className='flex justify-between'>
				<Button asChild>
					<Link
						href={`/app/${slug}/settings/payments`}
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
								checked={is_enabled}
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
						</Field>
					</FieldGroup>
					{showTestInputs && (
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor='test_secret_key'>
									Test Secret Key
								</FieldLabel>

								<Input
									id={`test_secret_key`}
									value={test_secret_key}
									onChange={(e) => {
										setTestSecretKey(e.currentTarget.value);
									}}
								/>
								<FieldDescription>
									Enter your Test Secret Key here
								</FieldDescription>
							</Field>
							<Field>
								<FieldLabel htmlFor='test_public_key'>
									Test Public Key
								</FieldLabel>

								<Input
									id='test_public_key'
									value={test_public_key}
									onChange={(e) => {
										setTestPublicKey(e.currentTarget.value);
									}}
								/>
								<FieldDescription>
									Enter your Test Public Key here
								</FieldDescription>
							</Field>
						</FieldGroup>
					)}
					{!showTestInputs && (
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
					)}

					<Field orientation='horizontal' className='flex justify-end'>
						<Button asChild className='cursor-pointer' variant='destructive'>
							<Link href={`/app/${slug}/settings/payments`}>Cancel</Link>
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
