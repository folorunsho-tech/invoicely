"use client";
import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function SetingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const nav = usePathname();
	return (
		<main className='space-y-2'>
			<NavigationMenu className='list-none gap-3 cursor-pointer'>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav == "/app/settings"}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href='/app/settings'>Accounts</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav.includes("settings/payments")}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href='/app/settings/payments'>Payments</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav.includes("settings/email")}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href='/app/settings/email'>Email</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav.includes("settings/security")}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href='/app/settings/security'>Security</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenu>
			{children}
		</main>
	);
}
