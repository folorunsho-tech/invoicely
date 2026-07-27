"use client";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ConfirmPasswordInput from "@/components/confirm-password";
import PasswordInput from "@/components/password-input";
import toast from "@/lib/toaster";
const formSchema = z
	.object({
		prev_password: z.string("invalid password"),

		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(32, "Password must be at most 32 characters."),
		confirm_password: z
			.string()
			.min(8, "Password must be at least 8 characters"),
	})
	.refine((data) => data.password === data.confirm_password, {
		path: ["confirm_password"],
		message: "Passwords must match",
	});

const ChangePassword = () => {
	const { handleSubmit, control, formState, reset } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
		// mode: "onBlur",
		defaultValues: {
			password: "",
			prev_password: "",
			confirm_password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const { data, error } = await authClient.changePassword({
			newPassword: values.password, // required
			currentPassword: values.prev_password, // required
			revokeOtherSessions: true,
		});
		if (error) {
			toast(error.message, "error");
		} else if (data.token) {
			toast("Password updated successfully", "success");
			reset();
		}
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldLabel className='mb-2'>Update your password</FieldLabel>
			<FieldGroup>
				<Controller
					name='prev_password'
					control={control}
					rules={{ required: true }}
					render={({ field, fieldState }) => (
						<PasswordInput
							disabled={formState.isSubmitting}
							htmlFor='prev_password'
							id='prev_password'
							required={true}
							label='Previous Password'
							data-invalid={fieldState.invalid}
							aria-invalid={fieldState.invalid}
							field={field}
							fieldState={fieldState}
						/>
					)}
				/>
				<Controller
					name='password'
					control={control}
					rules={{ required: true }}
					render={({ field, fieldState }) => (
						<PasswordInput
							disabled={formState.isSubmitting}
							htmlFor='password'
							id='password'
							required={true}
							label='New Password'
							data-invalid={fieldState.invalid}
							aria-invalid={fieldState.invalid}
							field={field}
							fieldState={fieldState}
						/>
					)}
				/>
				<Controller
					name='confirm_password'
					control={control}
					rules={{
						required: true,
					}}
					render={({ field, fieldState }) => (
						<ConfirmPasswordInput
							disabled={formState.isSubmitting}
							htmlFor='confirm-password'
							id='confirm-password'
							description='Please confirm your password.'
							required={true}
							label='Confirm new password'
							data-invalid={fieldState.invalid}
							aria-invalid={fieldState.invalid}
							field={field}
							fieldState={fieldState}
						/>
					)}
				/>
				<Field className='flex justify-end '>
					<Button
						type='submit'
						className='cursor-pointer'
						disabled={!formState.isValid || formState.isSubmitting}
					>
						Update password
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
};

export default ChangePassword;
