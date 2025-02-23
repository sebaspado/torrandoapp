import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Temporary user for testing
const testUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Attempting login with:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        if (credentials.email === testUser.email && credentials.password === testUser.password) {
          console.log('Login successful');
          return {
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
          };
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: true, // Enable debug logs
  logger: {
    error: (code, metadata) => {
      console.error(code, metadata);
    },
    warn: (code) => {
      console.warn(code);
    },
    debug: (code, metadata) => {
      console.log(code, metadata);
    },
  },
};

export default NextAuth(authOptions); 