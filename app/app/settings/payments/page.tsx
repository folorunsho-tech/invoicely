"use client";
import ProviderCard from "@/components/settings/ProviderCard";
import { Gateway } from "@/generated/prisma/client";
import { plugins } from "@/lib/plugins";
import { getProviders } from "@/lib/queries/providers";
import { useQuery } from "@tanstack/react-query";

const Page = () => {
	const gateways = useQuery({
		queryKey: [`providers`],
		queryFn: async () => {
			return await getProviders();
		},
	});
	const providers = plugins.map((plugin) => {
		const gateway: Gateway = gateways.data?.find(
			(g: Gateway) => g?.provider == plugin.name,
		);
		return {
			key: plugin.name,
			gateway,
			provider: plugin.name,
			meta: plugin,
		};
	});
	return (
		<main className='space-y-4'>
			<h2 className='text-lg font-semibold'>
				Install / Configure payments plugins
			</h2>

			<section className='flex flex-col gap-4'>
				{providers?.map((plugin) => (
					<ProviderCard
						key={plugin.key}
						gateway={plugin.gateway}
						meta={plugin.meta}
					/>
				))}
			</section>
		</main>
	);
};

export default Page;
