import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { SectionCards } from "@/components/section-cards";
const page = async ({ params }: { params: Promise<{ userId: string }> }) => {
	const { userId } = await params;
	return (
		<div className='flex flex-1 flex-col'>
			<div className='@container/main flex flex-1 flex-col gap-2'>
				<div className='flex flex-col gap-4 py-2 md:gap-6 md:py-4'>
					<SectionCards />
					<div className='px-4 lg:px-6'>
						<ChartAreaInteractive />
					</div>
				</div>
			</div>
		</div>
	);
};

export default page;
