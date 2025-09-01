'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../../public/locales/en/common.json';
import omCommon from '../../public/locales/om/common.json';
import amCommon from '../../public/locales/am/common.json';

const resources = {
	en: {
		common: enCommon
	},
	om: {
		common: omCommon
	},
	am: {
		common: amCommon
	}
};

i18next
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en',
		debug: process.env.NODE_ENV === 'development',
		interpolation: {
			escapeValue: false
		},
		detection: {
			order: ['localStorage', 'navigator', 'htmlTag'],
			caches: ['localStorage']
		}
	});

export default i18next;
