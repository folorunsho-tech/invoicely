"use client";
import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
export default function SetingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const nav = usePathname();
	const { slug } = useParams();
	return (
		<main className='space-y-2'>
			<NavigationMenu className='list-none gap-3 cursor-pointer'>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav == `/app/${slug}/settings`}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/${slug}/settings`}>Profile</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav == `/app/${slug}/settings/invitations`}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/${slug}/settings/invitations`}>Invitations</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav == `/app/${slug}/settings/members`}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/${slug}/settings/members`}>Members</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				{/* <NavigationMenuItem>
					<NavigationMenuLink
						asChild
						active={nav == `/app/${slug}/settings/email`}
						className='data-active:border-b-2 data-active:border-purple-500 rounded-none'
					>
						<Link href={`/app/${slug}/settings/email`}>Email</Link>
					</NavigationMenuLink>
				</NavigationMenuItem> */}
			</NavigationMenu>
			{children}
		</main>
	);
}
