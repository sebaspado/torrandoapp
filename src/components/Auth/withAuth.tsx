import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(WrappedComponent: React.ComponentType) {
  return function WithAuth(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;
      if (!session) {
        router.replace('/auth/signin');
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    if (!session) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 