import	React, {ReactElement}		from	'react';
import	Link						from	'next/link';
import	{useRouter}					from	'next/router';

const disclaimerPathnames: string[] = [
	'/what-are-the-risks',
	'/what-are-yearn-vaults',
	'/what-is-cowswap',
	'/what-is-mev'
];

function	Footer(): ReactElement {
	const router = useRouter();
	const isDisclaimerPage = disclaimerPathnames.includes(router.pathname);
	return (
		<footer className={'mx-auto mt-2 flex w-full flex-row items-center py-8 text-sm md:mt-0 md:text-base'}>
			<Link href={'/what-are-Kintsugi-vaults'}>
				<p className={`nftreasury--link-with-dot ${isDisclaimerPage ? 'active' : '' }`}>
					{'disclaimer'}
				</p>
			</Link>

			<div className={'ml-auto px-2'}>
				<a href={'https://twitter.com/KintsugiArbi'} target={'_blank'} rel={'noreferrer'} className={'cursor-pointer transition-colors hover:underline'}>
					{'twitter'}
				</a>
			</div>
			<div className={'px-2'}>
				<a href={'https://discord.yearn.finance/'} target={'_blank'} rel={'noreferrer'} className={'cursor-pointer transition-colors hover:underline'}>
					{'discord'}
				</a>
			</div>
		</footer>
	);
}

export default Footer;
