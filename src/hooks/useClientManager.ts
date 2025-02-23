import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Client } from '@/types/client';

export const useClientManager = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      try {
        const storedClients = localStorage.getItem(`clients_${session.user.email}`);
        if (storedClients) {
          const parsed = JSON.parse(storedClients);
          setClients(parsed.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt)
          })));
        }
      } catch (error) {
        console.error('Failed to load clients:', error);
      }
    }
  }, [session]);

  const addClient = (client: Client) => {
    setClients(prev => {
      const updated = [...prev, client];
      if (session?.user?.email) {
        localStorage.setItem(`clients_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients(prev => {
      const updated = prev.map(client =>
        client.id === clientId ? { ...client, ...updates } : client
      );
      if (session?.user?.email) {
        localStorage.setItem(`clients_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => {
      const updated = prev.filter(c => c.id !== clientId);
      if (session?.user?.email) {
        localStorage.setItem(`clients_${session.user.email}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient
  };
}; 