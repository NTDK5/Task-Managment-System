'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const locales = [
	{ code: 'en', label: 'English', nativeLabel: 'English' },
	{ code: 'om', label: 'Afan Oromo', nativeLabel: 'Afan Oromoo' },
	{ code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ' }
];

export default function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const [currentLang, setCurrentLang] = useState('en');

	useEffect(() => {
		setCurrentLang(i18n.language || 'en');
	}, [i18n.language]);

	const changeLanguage = (langCode: string) => {
		i18n.changeLanguage(langCode);
		setCurrentLang(langCode);
		localStorage.setItem('i18nextLng', langCode);
	};

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-gray-600 mr-2">Language:</span>
			{locales.map((locale) => (
				<button
					key={locale.code}
					onClick={() => changeLanguage(locale.code)}
					className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
						currentLang === locale.code
							? 'bg-blue-500 text-white border-blue-500'
							: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
					}`}
					title={`${locale.label} (${locale.nativeLabel})`}
				>
					{locale.code.toUpperCase()}
				</button>
			))}
		</div>
	);
}
