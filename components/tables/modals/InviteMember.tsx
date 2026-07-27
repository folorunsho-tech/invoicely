"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { sendInvitation } from "@/lib/queries/invitations";
import { authClient } from "@/lib/auth-client";
import {
	FieldGroup,
	Field,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
	email: z.email("Email is not correct"),
	role: z.string("Role is not valid"),
});
const InviteMember = () => {
	const { handleSubmit, control, formState, reset, setValue } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
	});
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const queryClient = useQueryClient();
	const [open, setOpen] = React.useState(false);
	const mutation = useMutation({
		mutationFn: sendInvitation,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["invitations"] });
		},
	});
	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const data = {
			email: values.email,
			organizationId: String(activeOrganization?.id),
			role: values.role,
		};
		// console.log(data);
		await mutation.mutateAsync(data);
		setOpen(false);
		reset();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				setOpen(!open);
				reset();
			}}
		>
			<DialogTrigger className='cursor-pointer w-full' asChild>
				<Button className='flex justify-start'>
					<PlusIcon /> Invite Member
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<DialogHeader>
						<DialogTitle>Invite Member</DialogTitle>
						<DialogDescription>
							Invite a member to join your business
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						{/* <Controller
							name='name'
							control={control}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='name'>Full Name</FieldLabel>
									<Input
										{...field}
										id='name'
										type='text'
										placeholder='John Doe'
										disabled={formState.isSubmitting}
										required
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/> */}
						<Controller
							name='email'
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='email'>Email</FieldLabel>
									<Input
										disabled={formState.isSubmitting}
										id='email'
										type='email'
										placeholder='m@example.com'
										{...field}
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						{/* <Controller
							name='password'
							control={control}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<PasswordInput
									disabled={formState.isSubmitting}
									htmlFor='password'
									id='password'
									required={true}
									label='Password'
									data-invalid={fieldState.invalid}
									aria-invalid={fieldState.invalid}
									field={field}
									fieldState={fieldState}
								/>
							)}
						/> */}
						<Controller
							name='role'
							control={control}
							rules={{ required: true }}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='role'>Role</FieldLabel>
									<Select
										aria-invalid={fieldState.invalid}
										{...field}
										onValueChange={(v) => {
											setValue("role", v, {
												shouldTouch: true,
												shouldValidate: true,
											});
										}}
										disabled={formState.isSubmitting}
									>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Select role' />
										</SelectTrigger>
										<SelectContent id='role'>
											<SelectGroup>
												<SelectLabel>Roles</SelectLabel>
												{[
													{
														value: "owner",
														label: "Owner",
													},
													{
														value: "admin",
														label: "Admin",
													},
													{
														value: "editor",
														label: "Editor",
													},
													{
														value: "member",
														label: "Member",
													},
												]?.map((item: { value: string; label: string }) => (
													<SelectItem key={item.value} value={item.value}>
														{item.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>
							)}
						/>
					</FieldGroup>
					<DialogFooter className='sm:justify-end'>
						<Button
							variant='green'
							type='submit'
							disabled={!formState.isValid || formState.isSubmitting}
						>
							Send invitation
						</Button>
						<DialogClose asChild>
							<Button variant='outline' type='button'>
								Cancel
							</Button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default InviteMember;
