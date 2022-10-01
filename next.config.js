/* eslint-disable @typescript-eslint/explicit-function-return-type */
const withPWA = require('next-pwa');
const {PHASE_EXPORT} = require('next/constants');

module.exports = (phase) => withPWA({
	assetPrefix: process.env.IPFS_BUILD === 'true' || phase === PHASE_EXPORT ? './' : '/',
	experimental: {
		images: {
			unoptimized: process.env.IPFS_BUILD === 'true' || phase === PHASE_EXPORT //Exporting image does not support optimization
		}
	},
	images: {
		domains: [
			'rawcdn.githack.com',
			'raw.githubusercontent.com'
		]
	},
	pwa: {
		dest: 'public',
		disable: process.env.NODE_ENV !== 'production'
	},
	env: {
		/* 🔵 - Yearn Finance **************************************************
		** Config over the RPC
		**********************************************************************/
		WEB_SOCKET_URL: {
			1: process.env.WS_URL_MAINNET,
			10: process.env.WS_URL_OPTIMISM,
			250: process.env.WS_URL_FANTOM,
			42161: process.env.WS_URL_ARBITRUM
		},
		JSON_RPC_URL: {
			1: process.env.RPC_URL_MAINNET,
			10: process.env.RPC_URL_OPTIMISM,
			250: process.env.RPC_URL_FANTOM,
			42161: process.env.RPC_URL_ARBITRUM
		},
		ALCHEMY_KEY: process.env.ALCHEMY_KEY,
		INFURA_KEY: process.env.INFURA_KEY,

		/* 🔵 - Yearn Finance **************************************************
		** Project specific config
		**********************************************************************/
		COW_APP_DATA: '0x2B8694ED30082129598720860E8E972F07AA10D9B81CAE16CA0E2CFB24743E24',
		COW_APP_DATA_IPFS: 'https://bafybeiblq2ko2maieeuvtbzaqyhi5fzpa6vbbwnydsxbnsqoft5si5b6eq.ipfs.dweb.link',
		COW_VAULT_RELAYER_ADDRESS: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
		ZAP_ETH_WETH_CONTRACT: '0xd1791428c38e25d459d5b01fb25e942d4ad83a25',

		ETH_VAULT_ADDRESS: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
		ETH_TOKEN_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
		WETH_TOKEN_ADDRESS: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
		USDC_TOKEN_ADDRESS: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',

		DEFAULT_SLIPPAGE_COWSWAP: 0.5
	},
	webpack(config) {
		config.module.rules.push({
		  test: /\.svg$/,
		  issuer: { and: [/\.(js|ts|md)x?$/] },
		  use: [
			{
			  loader: "@svgr/webpack",
			  options: {
				svgoConfig: { plugins: [{    name: 'removeViewBox',
				active: false }] },
			  },
			},
		  ],
		});
	
	
		return config;
	  }
});
