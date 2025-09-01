import path from 'path';

const isServer = typeof window === 'undefined';

const config = {
	localePath: isServer ? path.resolve('./public/locales') : '/locales',
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'om', 'am'],
		localeDetection: true
	},
	reloadOnPrerender: process.env.NODE_ENV === 'development',
	fallbackLng: 'en',
	debug: process.env.NODE_ENV === 'development'
};

export default config;
