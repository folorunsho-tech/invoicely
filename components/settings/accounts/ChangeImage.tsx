"use client";
import { AvatarImage, Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
const ChangeImage = () => {
	const { data } = authClient.useSession();

	return (
		<form>
			<FieldLabel className='mb-2'>Upload Profile picture</FieldLabel>
			<FieldGroup className='flex-row justify-between flex-wrap'>
				<Avatar className='h-32 w-32 rounded-lg grayscale'>
					<AvatarImage src={data?.user.image || ""} alt={data?.user.name} />
					<AvatarFallback>
						{data?.user.name.substring(0, 1).toUpperCase()}
					</AvatarFallback>
				</Avatar>
			</FieldGroup>
		</form>
	);
};

export default ChangeImage;
