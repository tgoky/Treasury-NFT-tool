import	React, {ReactElement}	from	'react';
import	{Button}				from	'@yearn-finance/web-lib/components';
import	WithShadow				from	'components/WithShadow';
import	Link					from	'next/link';

function	Index(): ReactElement {
	return (
		<section className={'flex h-full w-full items-center'}>
			<div className={'w-full'}>
				<div className={'w-full'}>
					<h2>{'We don’t have a discord'}</h2>
					<h2>{'with 10,000 KOOZY kangaroos in.'}</h2>
					<h2 className={'mt-8 text-right'}>{'Just The world’s best DeFi developers.'}</h2>
					<h2 className={'text-right'}>{'Wanna TEAM UP?'}</h2>
				</div>
				<p className={'mt-8 w-full md:w-7/12'}>
					{'Kintsugi Treasury is a simple yet powerful treasury management tool, powered by Kintsugi Finance. We’ll give you a mix of stables and ETH for your short term project needs, and put your long term assets in a vault to earn yield until you need them. Ready to roll?'}
				</p>
				<div className={'mt-10 flex justify-between space-x-6 md:justify-start'}>
					<div>
						<Link href={'/connect-wallet'}>
							<div>
								<WithShadow role={'button'}>
									<Button className={'w-[176px]'}>
										{'Create Treasury'}
									</Button>
								</WithShadow>
							</div>
						</Link>
					</div>

					<Link href={'/how-it-works'}>
						<div>
							<WithShadow role={'button'}>
								<Button variant={'outlined'} className={'w-[176px]'}>
									{'Learn More'}
								</Button>
							</WithShadow>
						</div>
					</Link>
				</div>
			</div>
		</section>
	);
}

export default Index;
