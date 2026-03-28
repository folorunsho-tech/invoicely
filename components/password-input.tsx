"use client";
import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Button } from "./ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
function PasswordInput({
	label,
	description,
	htmlFor,
	id,
	required = false,
	field,
	fieldState,
	disabled,
	...props
}: React.ComponentProps<typeof Input> & {
	label?: string;
	description?: string;
	htmlFor?: string;
	id: string;
	required?: boolean;
	field?: any;
	fieldState: any;
}) {
	const [inputRef, setInputRef] = useState("password");
	return (
		<Field className='w-full' {...props}>
			{label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
			<InputGroup>
				<InputGroupInput
					id={id}
					placeholder='password'
					type={inputRef}
					required={required}
					aria-invalid={props["aria-invalid"]}
					{...field}
					disabled={disabled}
				/>
				<InputGroupAddon align='inline-end'>
					<Button
						variant='outline'
						type='button'
						onClick={() =>
							inputRef === "password"
								? setInputRef("text")
								: setInputRef("password")
						}
					>
						{inputRef === "password" ? (
							<EyeIcon className='h-4 w-4' />
						) : (
							<EyeOffIcon className='h-4 w-4' />
						)}
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<FieldDescription>{description}</FieldDescription>
			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	);
}

export default PasswordInput;
