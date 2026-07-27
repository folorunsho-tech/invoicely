"use client";
import { HomeHeader } from "@/components/home-header";
import { SearchIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
const Page = () => {
	const { data: organizations } = authClient.useListOrganizations();
	const router = useRouter();
	return (
		<>
			<HomeHeader />
			<main className='space-y-6 p-4'>
				<h2 className='text-xl font-bold'>Your Businesses</h2>
				<section className='flex items-center justify-between text-sm'>
					<InputGroup className='max-w-xs h-8'>
						<InputGroupInput placeholder='Search for a business...' />
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
					</InputGroup>
					<Button size='sm' asChild className='cursor-pointer'>
						<Link href='/app/new-business'>+ New Business</Link>
					</Button>
				</section>
				<section>
					{organizations?.map((org) => {
						return (
							<Card
								key={org.id}
								onClick={async () => {
									const { data } = await authClient.organization.setActive({
										organizationId: org?.id,
									});
									router.push(`/app/${data?.slug}`);
								}}
								size='sm'
								className='w-full max-w-sm cursor-pointer'
							>
								<CardHeader className='flex items-center space-x-4'>
									<Avatar size='lg'>
										<AvatarImage src={org.slug} />
										<AvatarFallback>{org.name.substring(0, 2)}</AvatarFallback>
									</Avatar>
									<div>
										<CardTitle>{org.name}</CardTitle>
										<CardDescription>
											Created at: {new Date(org.createdAt).toLocaleString()}
										</CardDescription>
									</div>
								</CardHeader>
							</Card>
						);
					})}
				</section>
			</main>
		</>
	);
};

export default Page;
