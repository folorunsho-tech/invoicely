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
import React, { useEffect } from "react";
import { Pencil } from "lucide-react";
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
import toast from "@/lib/toaster";

const formSchema = z.object({
	email: z.email("Email is not correct"),
	role: z.string("Role is not valid"),
});
const UpdateRole = ({
	id,
	email,
	role,
}: {
	id: string;
	email: string;
	role: string;
}) => {
	const { data: activeOrganization } = authClient.useActiveOrganization();
	const { handleSubmit, control, formState, reset, setValue } = useForm<
		z.infer<typeof formSchema>
	>({
		resolver: zodResolver(formSchema),
	});
	const [open, setOpen] = React.useState(false);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await authClient.organization.updateMemberRole({
			role: values.role,
			memberId: id,
			organizationId: activeOrganization?.id,
			fetchOptions: {
				onSuccess(context) {
					toast(
						`Role of ${email} changed from ${role} to ${context?.data?.role}`,
						"success",
					);
				},
			},
		});
		setOpen(false);
		reset();
	};
	useEffect(() => {
		if (open) {
			setValue("email", email);
			setValue("role", role);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);
	return (
		<Dialog
			open={open}
			onOpenChange={() => {
				setOpen(!open);
				reset();
			}}
		>
			<DialogTrigger className='cursor-pointer w-full mb-1' asChild>
				<Button variant={"green"} className='flex justify-start ' size={"sm"}>
					<Pencil /> <span className='text-sm'>Change role</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<DialogHeader>
						<DialogTitle>Change member role</DialogTitle>
						<DialogDescription>Change this member role</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Controller
							name='email'
							control={control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor='email'>Email</FieldLabel>
									<Input
										disabled={true}
										id='email'
										type='email'
										placeholder='m@example.com'
										{...field}
										aria-invalid={fieldState.invalid}
										aria-disabled
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

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
													{
														value: "demo",
														label: "Demo",
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
							Change role
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

export default UpdateRole;
