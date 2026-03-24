import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
export function SiteHeader() {
	const user = {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
		fallback: "SC",
	};
	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6'>
				<div className='flex items-center gap-2'>
					<SidebarTrigger className='-ml-2' />
					<Separator
						orientation='vertical'
						className='mx-2 data-[orientation=vertical]:h-10'
					/>
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
						<Avatar className='h-8 w-8 rounded-lg grayscale'>
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className='rounded-lg'>
								{user.fallback}
							</AvatarFallback>
						</Avatar>
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
