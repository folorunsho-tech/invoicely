import React from "react";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
export default function SetingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className='space-y-2'>
			<NavigationMenu className='list'>
				<NavigationMenuItem>
					<NavigationMenuLink active={true}>Link</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink active={true}>Link</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink active={true}>Link</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenu>
			{children}
		</main>
	);
}
