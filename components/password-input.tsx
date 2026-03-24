"use client";
import { Field, FieldDescription, FieldLabel } from "./ui/field";
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
	...props
}: React.ComponentProps<typeof Input> & {
	label?: string;
	description?: string;
	htmlFor?: string;
	id: string;
	required?: boolean;
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
		</Field>
	);
}

export default PasswordInput;
