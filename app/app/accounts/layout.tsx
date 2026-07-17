import { HomeHeader } from "@/components/home-header";

export default function AccountsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<HomeHeader pageTitle='Account Settings' />
			<main className='p-2 px-4'>{children}</main>
		</>
	);
}
