import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const handler = NextAuth({
	providers: [
		// Only add OAuth providers if credentials are configured
		...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
			Google({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			})
		] : []),
		...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
			GitHub({
				clientId: process.env.GITHUB_ID,
				clientSecret: process.env.GITHUB_SECRET,
			})
		] : []),
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;
				const res = await fetch(`${backendUrl}/api/auth/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email: credentials.email, password: credentials.password })
				});
				if (!res.ok) return null;
				const data = await res.json();
				return { id: data.user.id, email: data.user.email, name: data.user.name, role: data.user.role, token: data.token } as any;
			}
		})
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			// Handle OAuth sign in
			if (account?.provider === 'google' || account?.provider === 'github') {
				try {
					// Check if user exists in our database
					const res = await fetch(`${backendUrl}/api/auth/oauth`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							email: user.email,
							name: user.name,
							provider: account.provider,
							providerId: user.id,
							image: user.image
						})
					});
					
					if (res.ok) {
						const data = await res.json();
						user.id = data.user.id;
						user.role = data.user.role;
						(user as any).token = data.token;
						return true;
					}
					return false;
				} catch (error) {
					console.error('OAuth sign in error:', error);
					return false;
				}
			}
			return true;
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.user = user;
				(token as any).accessToken = (user as any).token;
			}
			return token;
		},
		async session({ session, token }) {
			(session as any).user = token.user;
			(session as any).accessToken = (token as any).accessToken;
			return session;
		}
	},
	pages: { signIn: '/login' },
	secret: process.env.NEXTAUTH_SECRET || 'dev_secret_change_me'
});

export { handler as GET, handler as POST };
