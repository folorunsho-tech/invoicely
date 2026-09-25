"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LogOut, UserCog } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useInbox } from "better-inbox/react";
import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
export function SiteHeader() {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const { data: curruser } = authClient.useActiveMember();

	const [filterVal, setFilterVal] = useState<"all" | "unread">("all");
	const { notifications, unreadCount, markRead, markAllRead } = useInbox(
		authClient,
		{
			organizationId: session?.session?.activeOrganizationId || "",
			pollInterval: 15000,
			pageSize: 20,
			filter: filterVal,
		},
	);
	const { data: organizations } = authClient.useListOrganizations();
	const user = {
		name: session?.user.name,
		username: session?.user.username || "avatar",
		email: session?.user.email,
		avatar: session?.user.image,
		fallback: session?.user.name.substring(0, 2).toUpperCase(),
		role: curruser?.role,
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
							{
								organizations?.find(
									(org) => org.id == session?.session.activeOrganizationId,
								)?.name
							}
						</h2>
					</div>
				</div>

				<div className='flex items-center gap-4'>
					<Separator
						orientation='vertical'
						className='mx-2 data-[orientation=vertical]:h-10'
					/>

					<DropdownMenu>
						<DropdownMenuTrigger className='relative' asChild>
							<div className='cursor-pointer'>
								<Button variant='ghost'>
									<Bell />
								</Button>
								{unreadCount > 0 && (
									<span className='bg-indigo-600 right-0 top-0 absolute rounded-full text-white px-1.5 py-0.5 text-xs'>
										{unreadCount}
									</span>
								)}
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-sm'>
							<DropdownMenuGroup className='flex gap-1 items-center justify-between'>
								<div className='flex gap-1 items-center'>
									<Button
										variant={"ghost"}
										size={"xs"}
										onClick={() => {
											setFilterVal("all");
										}}
									>
										<span className='text-sm'>All</span>
									</Button>
									<Separator orientation='vertical' />
									<Button
										variant={"ghost"}
										size={"xs"}
										onClick={() => {
											setFilterVal("unread");
										}}
									>
										<span className='text-sm'>Unread</span>
									</Button>
								</div>
								<Button
									variant={"ghost"}
									size={"xs"}
									onClick={async () => {
										await markAllRead();
									}}
								>
									<span className='text-sm'>Mark all as read</span>
								</Button>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup className='overflow-y-auto'>
								{unreadCount < 1 && (
									<DropdownMenuItem className='cursor-pointer flex justify-center'>
										<span>You are all caught up</span>
									</DropdownMenuItem>
								)}
								{unreadCount > 0 &&
									notifications?.map((not) => (
										<DropdownMenuItem
											className={
												not.read
													? "text-gray-400 cursor-pointer"
													: "text-gray-900 cursor-pointer"
											}
											key={not.id}
											onClick={async () => {
												await markRead(not.id);
												router.push(`/app/${not.href}`);
											}}
										>
											<h3>{not.title}</h3>
											<p className='mt-1 text-sm'>{not.body}</p>
											<p className='mt-1 text-sm'>
												{formatDistanceToNowStrict(new Date(not?.createdAt), {
													unit: "month",
													roundingMethod: "ceil",
												})}
											</p>
										</DropdownMenuItem>
									))}
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<div className='flex gap-2 items-center'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='ghost' size='icon' className='rounded-full'>
									<Avatar className='h-8 w-8 rounded-lg grayscale'>
										<AvatarImage src={user.avatar || ""} alt={user.username} />
										<AvatarFallback>{user.fallback}</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								{user.role !== "demo" && (
									<DropdownMenuGroup>
										<DropdownMenuItem asChild className='cursor-pointer'>
											<Link href='/app/accounts'>
												<UserCog />
												Account
											</Link>
										</DropdownMenuItem>
									</DropdownMenuGroup>
								)}
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
							<span className='truncate font-medium'>{user.username}</span>
							<span className='truncate text-xs text-muted-foreground'>
								{user.name}
							</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
