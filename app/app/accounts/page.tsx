"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
	FieldSeparator,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import toast from "@/lib/toaster";
import { useEffect } from "react";
import ChangePassword from "@/components/settings/accounts/ChangePassword";
// import ChangeImage from "@/components/settings/accounts/ChangeImage";

const formSchema = z.object({
	name: z
		.string("Invalid Name")
		.min(3, "Name must be at least 3 characters.")
		.max(32, "Name must be at most 32 characters."),
	username: z
		.string("Invalid username")
		.min(3, "Name must be at least 3 characters.")
		.max(32, "Name must be at most 32 characters."),
});

const Page = () => {
	const { data: curruser } = authClient.useActiveMember();

	const { data } = authClient.useSession();
	const { handleSubmit, control, formState, setValue, reset } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		// mode: "onBlur",
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (curruser?.role !== "demo") {
			const { data, error } = await authClient.updateUser({
				name: values.name.trim(),
				username: values.username.trim(),
			});
			if (error) {
				toast(error.message, "error");
			} else if (data.status) {
				toast("Changes applied successfully", "success");
				reset();
			}
		} else {
			toast("You are not allowed to update profile", "error");
		}
	};
	useEffect(() => {
		if (data?.user)
			setValue("name", data?.user?.name, {
				shouldDirty: false,
				shouldTouch: false,
			});
		setValue("username", data?.user?.username || "", {
			shouldDirty: false,
			shouldTouch: false,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.user.name]);
	return (
		<section className='max-w-xl mx-auto px-4 py-6'>
			<Card>
				<CardHeader>
					<CardTitle>Account Info</CardTitle>
				</CardHeader>
				<CardContent className='flex-col flex gap-4'>
					{/* <ChangeImage /> */}
					<FieldSeparator />
					<form onSubmit={handleSubmit(onSubmit)}>
						<FieldLabel className='mb-2'>
							Update your name and username
						</FieldLabel>
						<FieldGroup>
							<Controller
								name='name'
								control={control}
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='name'>Name</FieldLabel>
										<Input
											disabled={formState.isSubmitting}
											id='name'
											type='text'
											placeholder='e.g google'
											required
											{...field}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name='username'
								control={control}
								rules={{ required: true }}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor='name'>Username</FieldLabel>
										<Input
											disabled={formState.isSubmitting}
											id='username'
											type='text'
											placeholder='e.g john_doe'
											required
											{...field}
											aria-invalid={fieldState.invalid}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Field className='flex justify-end w-1/3'>
								<Button
									type='submit'
									className='cursor-pointer'
									disabled={!formState.isValid || formState.isSubmitting}
								>
									Update profile
								</Button>
							</Field>
						</FieldGroup>
					</form>
					<FieldSeparator />
					<ChangePassword />
					<FieldSeparator />
				</CardContent>
			</Card>
		</section>
	);
};

export default Page;
