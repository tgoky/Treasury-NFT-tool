import	React, {ReactElement, useState}				from	'react';
import	{useRouter}									from	'next/router';
import	Image										from	'next/image';
import	{useWeb3}									from	'@yearn-finance/web-lib';
import	{Card, Button}								from	'@yearn-finance/web-lib/components';
import	{Transaction, toAddress, defaultTxStatus,
	format}											from	'@yearn-finance/web-lib/utils';
import	WithShadow									from	'components/WithShadow';
import	useWallet									from	'contexts/useWallet';
import	useCowSwap									from	'contexts/useCowSwap';
import	{approveERC20}								from	'utils/actions/approveToken';
import	{toInputOrBalance}							from	'utils';
import	type {TCowSwapQuote}						from	'types/types';

function	ApproveWEth(): ReactElement {
	const	router = useRouter();
	const	{provider, address, isActive} = useWeb3();
	const	{cowSwapQuote} = useCowSwap();
	const	{balances, updateWallet} = useWallet();
	const	[isShowingArrow, set_isShowingArrow] = useState(false);
	const	[txStatusApprove, set_txStatusApprove] = React.useState(defaultTxStatus);

	async function	onApproveWETH(): Promise<void> {
		set_isShowingArrow(true);

		const	_cowSwapQuote = (cowSwapQuote as TCowSwapQuote);
		const	transaction = (
			new Transaction(provider, approveERC20, set_txStatusApprove).populate(
				process.env.WETH_TOKEN_ADDRESS as string,
				process.env.COW_VAULT_RELAYER_ADDRESS as string,
				toInputOrBalance(
					format.BN(_cowSwapQuote.quote.sellAmount as string).add(format.BN(_cowSwapQuote.quote.feeAmount as string)),
					balances[toAddress(process.env.WETH_TOKEN_ADDRESS)].raw
				)
			).onSuccess(async (): Promise<void> => {
				await updateWallet();
			})
		);

		const	isSuccessful = await transaction.perform();
		if (isSuccessful) {
			router.push('/final-final-step');
		} else {
			set_isShowingArrow(false);
		}
	}

	return (
		<div className={'nftreasury--app-wrapper'}>
			<WithShadow role={'large'}>
				<Card className={'nftreasury--app-card'}>
					<div>
						<div className={'w-full pb-6'}>
							<h2 className={'font-bold'}>{'Final step'}</h2>
						</div>
						<div className={'w-10/12 space-y-6 text-justify'}>
							<p>{'For real this time. Let’s just swap your ETH (WETH) to USDC and then you’re done.'}</p>
							<p>{'Promise'}</p>
						</div>
					</div>
					<div className={'mt-auto flex justify-start'}>
						<WithShadow
							role={'button'}
							isDisabled={!isActive || !address || !provider || txStatusApprove.pending || !cowSwapQuote}
							onClick={onApproveWETH}>
							<Button
								isBusy={txStatusApprove.pending}
								isDisabled={!isActive || !address || !provider || txStatusApprove.pending || !cowSwapQuote}
								className={'w-[176px]'}>
								{'Slam'}
							</Button>
						</WithShadow>
					</div>
				</Card>
			</WithShadow>
			<div className={'hidden h-[544px] min-w-[500px] items-start justify-center md:flex'}>
				<Image
					width={320}
					height={285}
					quality={90}
					src={'/execute-swap.svg'}
					className={`transition duration-1000 ease-in-out ${isShowingArrow ? 'opacity-100' : 'opacity-0'}`} />
			</div>
		</div>
	);
}

export default ApproveWEth;