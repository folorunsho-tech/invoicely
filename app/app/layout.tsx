"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

import "@mantine/dates/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const setActiveOrg = async () => {
		await authClient.organization.list({
			fetchOptions: {
				async onSuccess(context) {
					const orgs = context.data;

					if (orgs && orgs.length > 0) {
						await authClient.organization.setActive({
							organizationId: orgs[0].id,
						});
						router.push(`/app`);
					}
				},
			},
		});
	};
	useEffect(() => {
		setActiveOrg();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			<SidebarInset>
				<SiteHeader />
				<main className='p-2 px-4 bg-gray-50 h-full'>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
