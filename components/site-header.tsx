"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, ChevronsUpDown, UserCog } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
export function SiteHeader() {
	const router = useRouter();
	const { slug }: { slug: string } = useParams();
	const { data: session } = authClient.useSession();
	const { data: organizations } = authClient.useListOrganizations();
	const user = {
		name: session?.user.name,
		email: session?.user.email,
		avatar: session?.user.image,
		fallback: session?.user.name.substring(0, 2).toUpperCase(),
	};

	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6'>
				<div className='flex items-center gap-2 py-2'>
					<SidebarTrigger className='-ml-2' />
					<Separator
						orientation='vertical'
						className='mx-2 data-[orientation=vertical]:h-10'
					/>
					<div className='flex gap-3 p-1 items-center'>
						<h2 className='font-bold'>
							{organizations?.find((org) => org.slug == slug)?.name}
						</h2>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline'>
									<ChevronsUpDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='w-max'>
								<DropdownMenuGroup>
									<DropdownMenuLabel>
										{user.name}&apos;s businesses
									</DropdownMenuLabel>
									{organizations?.map((org) => (
										<DropdownMenuCheckboxItem
											className='cursor-pointer'
											checked={slug == org.slug}
											onClick={async () => {
												const { data } =
													await authClient.organization.setActive({
														organizationId: org.id,
													});
												router.push(`/app/${data?.slug}`);
											}}
											key={org.slug}
											disabled={slug == org.slug}
										>
											{org.name}
										</DropdownMenuCheckboxItem>
									))}
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem asChild className='cursor-pointer'>
										<Link href='/app'>All Businesess</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuGroup>
									<DropdownMenuItem asChild className='cursor-pointer'>
										<Link href='/app/new-business'>+ New Business</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
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
								<Button variant='ghost' size='icon' className='rounded-full'>
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
									<DropdownMenuItem asChild className='cursor-pointer'>
										<Link href='/app/accounts'>
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
