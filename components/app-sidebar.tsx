"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";

import {
	Sidebar,
	SidebarContent,
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
	Settings,
	BanknoteArrowDown,

	// ChartColumn,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: curruser } = authClient.useActiveMember();
	const navMain: {
		title: string;
		url: string;
		icon: React.ReactNode;
		visible: boolean;
		exact?: boolean;
	}[] = [
		{
			title: "Dashboard",
			url: `/app`,
			icon: <LayoutDashboardIcon />,
			visible: true,
			exact: true,
		},
		{
			title: "Clients",
			url: `/app/clients`,
			icon: <UserCheck />,
			visible: true,
		},
		{
			title: "Invoices",
			url: `/app/invoices`,
			icon: <ReceiptText />,
			visible: true,
		},
		{
			title: "Payments",
			url: `/app/payments`,
			visible: true,
			icon: <BanknoteArrowDown />,
		},

		{
			title: "Categories",
			url: `/app/categories`,
			icon: <Group />,
			visible: !(curruser?.role == "member" || curruser?.role == "demo"),
		},
		{
			title: "Settings",
			url: `/app/settings`,
			icon: <Settings />,
			visible: !(curruser?.role == "member" || curruser?.role == "demo"),
		},
	];
	return (
		<Sidebar variant='sidebar' collapsible='icon' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:p-1.5!'
						>
							<Link href={`/app`}>
								<CommandIcon className='size-5!' />
								<span className='text-base font-semibold'>Invoicely</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
			</SidebarContent>
		</Sidebar>
	);
}
