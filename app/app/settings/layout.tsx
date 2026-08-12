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
						active={nav == `/app/settings`}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/settings`}>Profile</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav == `/app/settings/invitations`}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/settings/invitations`}>Invitations</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav == `/app/settings/members`}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/settings/members`}>Members</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav.includes(`/app/settings/payments`)}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/settings/payments`}>Payments</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenu>
			{children}
		</main>
	);
}
