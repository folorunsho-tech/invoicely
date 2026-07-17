"use client";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCog, Bell, CommandIcon, LogOut } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HomeHeader({ pageTitle }: { pageTitle?: string }) {
	const { data: session } = authClient.useSession();
	const router = useRouter();

	const user = {
		name: session?.user.name,
		email: session?.user.email,
		avatar: session?.user.image,
		fallback: session?.user.name.substring(0, 2).toUpperCase(),
	};
	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-4'>
				<div className='flex items-center gap-2'>
					<Link href='/app' className='flex items-center gap-2'>
						<CommandIcon className='size-5!' />
						<span className='text-base font-semibold hidden md:block'>
							Invoicely
						</span>
					</Link>
					<Separator
						orientation='vertical'
						className='mx-2 data-[orientation=vertical]:h-10'
					/>
					<h2 className='text-lg font-semibold hidden md:flex'>
						{pageTitle || "Businesses"}
					</h2>
				</div>

				<div className='flex items-center gap-4'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline'>
								<Bell />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-60' align='center'>
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						</DropdownMenuContent>
					</DropdownMenu>
					<div className='flex gap-2 items-center'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant='secondary'
									size='icon'
									className='cursor-pointer'
								>
									<Avatar className='h-8 w-8 rounded-lg grayscale'>
										<AvatarImage src={user.avatar || ""} alt={user.name} />
										<AvatarFallback className='rounded-lg'>
											{user.fallback}
										</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuGroup>
									<DropdownMenuItem asChild>
										<Link href='/app/accounts' className='cursor-pointer'>
											<UserCog />
											Account
										</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant='destructive'
									className='cursor-pointer'
									onClick={async () => {
										await authClient.signOut({
											fetchOptions: {
												onSuccess: () => {
													router.push("/auth/signin"); // redirect to login page
												},
											},
										});
									}}
								>
									<LogOut />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate font-medium'>{user.name}</span>
							<span className='truncate text-xs text-muted-foreground'>
								{user.email}
							</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
