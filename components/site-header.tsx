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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getNotifications,
	markNotification,
} from "@/lib/queries/notifications";
import { Notification } from "@/generated/prisma/client";
import { Label } from "./ui/label";
import { FieldDescription } from "./ui/field";
export function SiteHeader() {
	const router = useRouter();
	const queryClient = useQueryClient();

	const res = useQuery({
		queryKey: ["unread-notifications"],
		queryFn: async () => {
			return await getNotifications();
		},
	});
	const mutation = useMutation({
		mutationFn: markNotification,
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
		},
	});
	const { slug }: { slug: string } = useParams();
	const { data: session } = authClient.useSession();
	const { data: organizations } = authClient.useListOrganizations();
	const user = {
		name: session?.user.name,
		email: session?.user.email,
		avatar: session?.user.image,
		fallback: session?.user.name.substring(0, 2).toUpperCase(),
	};
	const notifications: Notification[] = res?.data;
	const getNotColor = (not: Notification) => {
		if (not.type == "error" || not.type == "cancelled")
			return "text-xs text-red-500";
		if (not.type == "success") return "text-xs text-green-500";
		if (not.type == "info") return "text-xs text-orange-500";
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
							<DropdownMenuContent className='w-max max-h-72'>
								<DropdownMenuGroup>
									<DropdownMenuLabel>
										<span className='truncate max-w-[40ch]'>{user.name}</span>
										&apos;s businesses
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
							<Button variant='outline' className='relative'>
								<Bell />
								{notifications?.length > 0 && (
									<span className='absolute border-2 -top-2 right-0 bg-red-500 px-1.5 py-0.5 z-50 text-xs rounded-full text-gray-50'>
										2
									</span>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-60' align='center'>
							<DropdownMenuLabel>Notifications</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								{notifications?.length > 0 &&
									notifications?.map((not) => (
										<DropdownMenuItem
											key={not.id}
											asChild
											className='cursor-pointer '
											onClick={async () => {
												mutation.mutate({ id: not.id });
											}}
										>
											<Link
												className='flex flex-col gap-1 '
												href={not.link ? `/app/${slug}/${not.link}` : "#"}
											>
												<Label className={getNotColor(not)}>{not.title}</Label>
												<FieldDescription className='text-xs'>
													{not.description}
												</FieldDescription>
											</Link>
										</DropdownMenuItem>
									))}
								{notifications?.length == 0 && (
									<DropdownMenuItem>
										<Label>No notification</Label>
									</DropdownMenuItem>
								)}
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							{notifications?.length > 0 && (
								<DropdownMenuGroup className='cursor-pointer justify-center flex'>
									<DropdownMenuItem className='cursor-pointer'>
										<Link href={`/app/${slug}/notifications`}>View All</Link>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
					<div className='flex gap-2 items-center'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='icon' className='rounded-full'>
									<Avatar className='h-8 w-8 rounded-lg grayscale'>
										<AvatarImage src={user.avatar || ""} alt={user.name} />
										<AvatarFallback>{user.fallback}</AvatarFallback>
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
