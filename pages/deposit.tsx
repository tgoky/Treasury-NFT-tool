import	React, {ReactElement, useState}				from	'react';
import	{useRouter}									from	'next/router';
import	Link										from	'next/link';
import	Image										from	'next/image';
import	{ethers}									from	'ethers';
import	{Card, Button}								from	'@yearn-finance/web-lib/components';
import	{format, performBatchedUpdates,
	defaultTxStatus, toAddress, Transaction}		from	'@yearn-finance/web-lib/utils';
import	{useWeb3}									from	'@yearn-finance/web-lib/contexts';
import	WithShadow									from	'components/WithShadow';
import	useYearn									from	'contexts/useYearn';
import	useWallet									from	'contexts/useWallet';
import	{ZapEth}									from	'utils/actions/zapEth';
import	{toInputOrBalance}							from	'utils';

function	EstimateGasRow(): ReactElement {
	const	{currentGasPrice} = useWallet();
	const	[currentEstimate, set_currentEstimate] = React.useState(0);

	React.useEffect((): void => {
		const	gas = Number(format.units(currentGasPrice, 'ether'));
		set_currentEstimate(gas * 88600);
	}, [currentGasPrice]);

	return (
		<p className={'flex flex-col justify-between md:flex-row'}>
			<span>{'Est. gas cost for deposit'}</span>
			<span className={'font-bold'}>
				{`${format.amount(Number(currentEstimate.toFixed(8)), 8, 8)} ETH`}
			</span>
		</p>
	);
}

function	DepositEthPage(): ReactElement {
	const	router = useRouter();
	const	{provider, isActive} = useWeb3();
	const	{balances, updateWallet, useWalletNonce} = useWallet();
	const	[isShowingArrow, set_isShowingArrow] = useState(false);
	const	{yvEthData} = useYearn();
	const	[keptEth, set_keptEth] = useState(ethers.constants.Zero);
	const	[balance, set_balance] = useState({raw: ethers.constants.Zero, normalized: 0});
	const	[percentage, set_percentage] = useState(0);
	const	[inputValue, set_inputValue] = useState('0');
	const	[txStatusWrapDeposit, set_txStatusWrapDeposit] = React.useState(defaultTxStatus);

	// Init the balance once available
	React.useEffect((): void => {
		set_balance({
			raw:  balances[toAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')]?.raw || ethers.constants.Zero,
			normalized:  balances[toAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')]?.normalized || 0
		});
	}, [balances, useWalletNonce]);

	// Check if value match a percentage. ValueN could be set as useMemo
	React.useEffect((): void => {
		const value20 = String((balance.normalized / 100) * 20);
		const value40 = String((balance.normalized / 100) * 40);
		const value60 = String((balance.normalized / 100) * 60);
		const value80 = String((balance.normalized / 100) * 80);
		if (inputValue === value20) {
			set_percentage(20);
		} else if  (inputValue === value40) {
			set_percentage(40);
		} else if  (inputValue === value60) {
			set_percentage(60);
		} else if  (inputValue === value80) {
			set_percentage(80);
		} else {
			set_percentage(0);
		}
	}, [balance, inputValue]);

	// Wrap and deposit inputValue Eth to the contract to get wETH
	async function	onZapEth(): Promise<void> {
		if (!isActive || txStatusWrapDeposit.pending)
			return;

		const	toDeposit = (balances[toAddress(process.env.ETH_TOKEN_ADDRESS)].raw).sub(keptEth);
		if (toDeposit.lte(ethers.constants.Zero)) {
			router.push('/swap-eth');
			return;
		}

		set_isShowingArrow(true);
		const	transaction = (
			new Transaction(provider, ZapEth, set_txStatusWrapDeposit).populate(
				toInputOrBalance(toDeposit, balances[toAddress(process.env.ETH_TOKEN_ADDRESS)].raw)
			).onSuccess(async (): Promise<void> => {
				await updateWallet();
			})
		);

		const	isSuccessful = await transaction.perform();
		if (isSuccessful) {
			router.push('/treasury');
		} else {
			performBatchedUpdates((): void => {
				set_isShowingArrow(false);
			});
		}
	}

	const onInputChange = (_newValue: string): void => {
		performBatchedUpdates((): void => {
			const	newValue = _newValue;
			const	newRawValue = ethers.utils.parseUnits(Number(_newValue).toFixed(18), 18);

			if ((balance.raw).sub(newRawValue).isNegative()) {
				set_inputValue(String(balance.normalized));
				set_keptEth(balance.raw);
				return;
			}
			set_inputValue(newValue);
			set_keptEth(newRawValue);
		});
	};

	const onPercentageChange = (_percentage: number): void => {
		const value = String((balance.normalized / 100) * _percentage);
		set_inputValue(value);
		set_keptEth(ethers.utils.parseUnits(Number(value).toFixed(18), 18));
	};
	
	return (
		<div className={'nftreasury--app-wrapper'}>
			<WithShadow role={'large'}>
				<Card className={'nftreasury--app-card'}>
					<div className={'w-full'}>
						<div className={'w-full pb-6'}>
							<h2 className={'font-bold'}>{'You have'}</h2>
							<h2 className={'font-bold'}>
								{`${(balance.normalized).toFixed(8)} ETH`}
							</h2>
						</div>
						<div className={'w-full text-justify'}>
							<p>{'How much ETH do you wanna keep in your wallet?'}</p>
							<p>{'The rest will be sent to Yearn vault.'}</p>
							<div className={'mt-2 mb-4 flex items-center'}>
								<input
									className={'h-10 w-6/12 border-2 border-primary-500 p-2 ring-0 focus:border-primary-500 focus:!outline-none focus:!ring-0'}
									type={'number'}
									min={0}
									max={Number(balance.normalized)}
									value={inputValue}
									onChange={(e): void => onInputChange(e.target.value)} />
								<button
									aria-selected={percentage === 20}
									className={'nftreasury--button-percentage'}
									onClick={(): void => onPercentageChange(20)}>
									{'20 %'}
								</button>
								<button
									aria-selected={percentage === 40}
									className={'nftreasury--button-percentage'}
									onClick={(): void => onPercentageChange(40)}>
									{'40 %'}
								</button>
								<button
									aria-selected={percentage === 60}
									className={'nftreasury--button-percentage'}
									onClick={(): void => onPercentageChange(60)}>
									{'60 %'}
								</button>
								<button
									aria-selected={percentage === 80}
									className={'nftreasury--button-percentage'}
									onClick={(): void => onPercentageChange(80)}>
									{'80 %'}
								</button>
							</div>
							<p>{'Next step we’ll swap some ETH to USDC.'}</p>
						</div>
					</div>
					<div className={'nftreasury--grey-box mt-4 mb-6 p-4'}>
						<p className={'mb-4 flex flex-col justify-between md:flex-row'}>
							<span>{'Deposit into Vault'}</span>
							<span className={'font-bold'}>
								{format.bigNumberAsAmount((balance.raw).sub(keptEth), 18, 8, 'ETH')}
							</span>
						</p>
						<p className={'mb-4 flex flex-col justify-between md:flex-row'}>
							<span>{'APY'}</span>
							<span className={'font-bold'}>
								{yvEthData ? `${format.amount((yvEthData?.apy?.net_apy || 0) * 100, 2, 2)} %` : '-'}
							</span>
						</p>
						<EstimateGasRow />
					</div>
					<div className={'mt-auto flex w-full justify-between md:justify-start md:space-x-6'}>
						<div onClick={onZapEth}>
							<WithShadow role={txStatusWrapDeposit.pending ? 'button-busy' : 'button'}>
								<Button isBusy={txStatusWrapDeposit.pending} className={'w-[176px]'}>
									{'Click-click'}
								</Button>
							</WithShadow>
						</div>
						<WithShadow role={'button'}>
							<Link href={'/treasury'}>
								<Button variant={'outlined'} className={'w-[176px]'}>
									{'Back'}
								</Button>
							</Link>
						</WithShadow>
					</div>
				</Card>
			</WithShadow>
			<div className={'hidden h-[544px] min-w-[500px] items-start justify-center md:flex'}>
				<Image
					width={322}
					height={258}
					quality={90}
					src={'/keep-eth.svg'}
					className={`transition duration-1000 ease-in-out ${isShowingArrow ? 'opacity-100' : 'opacity-0'}`} />
			</div>
		</div>
	);
}

export default DepositEthPage;