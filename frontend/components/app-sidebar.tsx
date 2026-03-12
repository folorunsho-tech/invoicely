"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	LayoutDashboardIcon,
	CommandIcon,
	UserCheck,
	ReceiptText,
	Group,
	LogOut,
	Settings,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const navMain = [
	{
		title: "Dashboard",
		url: `/${1}`,
		icon: <LayoutDashboardIcon />,
	},
	{
		title: "Clients",
		url: `/${1}/clients`,
		icon: <UserCheck />,
	},
	{
		title: "Invoices",
		url: `/${1}/invoices`,
		icon: <ReceiptText />,
	},
	{
		title: "Categories",
		url: `/${1}/categories`,
		icon: <Group />,
	},
	{
		title: "Settings",
		url: `/${1}/settings`,
		icon: <Settings />,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:p-1.5!'
						>
							<Link href='/1'>
								<CommandIcon className='size-5!' />
								<span className='text-base font-semibold'>Invoicely</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				{/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenuButton asChild tooltip='Logout'>
					<Button
						variant='destructive'
						className='flex justify-between gap-2 items-center cursor-pointer'
					>
						<LogOut className='size-5!' />
						<span className='text-base font-semibold'>Logout</span>
					</Button>
				</SidebarMenuButton>
			</SidebarFooter>
		</Sidebar>
	);
}
