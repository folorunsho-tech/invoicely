"use client";
import { Label } from "@/components/ui/label";
// import { Select } from "@mantine/core";
import { paymentGateways } from "@/lib/gateways";
import ProviderCard from "@/components/settings/providers/ProviderCard";

const Page = () => {
	// const [country, setCountry] = useState<string | null>("Nigeria");

	return (
		<main className='flex flex-col gap-6 px-2'>
			<section className='flex justify-between items-center'>
				<Label className='text-lg'>Payment Providers</Label>
				{/* <Select
					label='Business Location'
					placeholder={`Business Location`}
					data={["Global", "Nigeria"]}
					onChange={(value) => {
						setCountry(value);
					}}
					value={country}
				/> */}
			</section>
			<section className='flex flex-col gap-4'>
				{paymentGateways?.map((gateway) => (
					<ProviderCard
						key={gateway.provider}
						gateway={gateway}
						provider={gateway.provider}
					/>
				))}
			</section>
		</main>
	);
};

export default Page;
