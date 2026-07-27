"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";

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
	ChartColumn,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { slug } = useParams();
	const { data: curruser } = authClient.useActiveMember();
	const navMain: {
		title: string;
		url: string;
		icon: React.ReactNode;
		visible: boolean;
	}[] = [
		{
			title: "Dashboard",
			url: `/app/${slug}`,
			icon: <LayoutDashboardIcon />,
			visible: true,
		},
		{
			title: "Clients",
			url: `/app/${slug}/clients`,
			icon: <UserCheck />,
			visible: true,
		},
		{
			title: "Invoices",
			url: `/app/${slug}/invoices`,
			icon: <ReceiptText />,
			visible: true,
		},
		{
			title: "Payments",
			url: `/app/${slug}/payments`,
			visible: true,
			icon: <BanknoteArrowDown />,
		},
		{
			title: "Analytics",
			url: `/app/${slug}/analytics`,
			icon: <ChartColumn />,
			visible: true,
		},
		{
			title: "Categories",
			url: `/app/${slug}/categories`,
			icon: <Group />,
			visible: curruser?.role !== "member",
		},
		{
			title: "Settings",
			url: `/app/${slug}/settings`,
			icon: <Settings />,
			visible: curruser?.role !== "member",
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
							<Link href={`/app/${slug}`}>
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
		</Sidebar>
	);
}
