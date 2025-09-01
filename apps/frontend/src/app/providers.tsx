'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import '../i18n/client';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<ThemeProvider>
				{children}
			</ThemeProvider>
		</SessionProvider>
	);
}
