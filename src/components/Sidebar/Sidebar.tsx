import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { taskStore } from '@/utils/taskStore';
import styles from './Sidebar.module.scss';
import { 
  faHome, 
  faTasks, 
  faCalendar, 
  faMoneyBill, 
  faUsers, 
  faChartLine,
  faBoxes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return router.pathname.startsWith(path);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const navigationLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: faHome },
    { href: '/tasks', label: 'Tareas', icon: faTasks },
    { href: '/calendar', label: 'Calendario', icon: faCalendar },
    { href: '/stock', label: 'Stock', icon: faBoxes },
    { href: '/finances', label: 'Finanzas', icon: faMoneyBill },
    { href: '/clients', label: 'Clientes', icon: faUsers },
    { href: '/goals', label: 'Metas', icon: faChartLine },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>
          <svg width="150" height="156" viewBox="0 0 253 156" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_1533_720)">
          <path d="M19.1006 81.8C17.8006 77.8 16.7006 73.7 15.8006 69.6C12.4006 54.3 10.3006 41.7 9.50062 31.9C9.40062 31.6 9.30062 31.5 9.20062 31.4C9.10062 31.4 8.90062 31.4 8.70062 31.4L6.90062 32C6.00062 32.3 5.10062 32.6 4.20062 32.8C1.70062 33.2 0.300624 33 0.000623649 31.9C-0.0993764 31.3 0.200624 30.7 1.20062 30.1C2.10062 29.6 3.60062 29 5.60062 28.3C7.30062 27.7 9.10062 27.2 10.9006 26.8L19.9006 25.5C21.0006 25.4 22.1006 25.2 23.3006 25.1C24.5006 24.9 25.6006 25.1 26.5006 25.6C26.7006 25.7 26.8006 25.9 26.9006 26.2C27.0006 26.7 26.8006 27.1 26.2006 27.5C25.6006 27.9 25.1006 28.2 24.7006 28.4C24.3006 28.6 23.8006 28.7 23.2006 28.8L22.4006 29C21.6006 29.2 20.2006 29.4 18.1006 29.8C17.7006 29.9 17.6006 30.2 17.7006 30.7C18.3006 36.6 19.0006 41.9 19.8006 46.6C20.6006 51.2 21.6006 56.2 22.7006 61.5L24.2006 68.8C24.9006 71.8 25.6006 74.3 26.1006 76.3L27.2006 80.1C27.6006 81.8 26.4006 83 23.8006 83.6C21.2006 84.1 19.7006 83.5 19.1006 81.8Z" fill="white"/>
          <path d="M36.1997 77.1C31.3997 72.3 28.4997 65.7 27.4997 57.1C26.6997 50.3 27.3997 43.6 29.4997 36.8C30.5997 33.2 32.4997 31 35.1997 30.1C35.5997 29.9 35.8997 29.7 36.0997 29.4C36.7997 28.1 37.8997 27 39.1997 26.2C40.4997 25.4 41.9997 24.9 43.5997 24.7C49.3997 24 53.6997 27.2 56.5997 34.3C57.5997 36.8 58.2997 39.4 58.5997 42C59.0997 47 59.2997 51.5 59.0997 55.4C59.0997 55.8 59.1997 56 59.3997 56.1C59.5997 56.2 59.7997 56.3 60.1997 56.3L62.1997 56.2L64.3997 55.8C65.1997 55.7 66.0997 55.8 66.9997 56C67.6997 56.1 68.1997 56.5 68.3997 57.1C68.4997 57.6 68.1997 58.1 67.4997 58.5C66.1997 59.3 64.7997 59.8 63.2997 60L59.7997 60.2C59.3997 60.2 59.0997 60.4 58.9997 60.7C58.8997 61 58.7997 61.5 58.6997 62.3C58.2997 65.3 57.4997 68 56.4997 70.5C55.3997 73 53.9997 75 52.0997 76.7C50.1997 78.3 47.7997 79.3 44.8997 79.7C41.1997 80 38.2997 79.2 36.1997 77.1ZM45.4997 74.8C48.4997 71.3 50.2997 66.4 50.6997 60.2V59.8C50.6997 59.4 50.1997 59.2 49.1997 59.1C48.6997 59 48.2997 58.9 47.7997 58.8C42.1997 57.6 38.1997 54.4 35.7997 49.1C35.7997 48.9 35.6997 48.8 35.4997 48.9C35.2997 51.5 35.3997 54.1 35.6997 56.7C36.5997 64.2 39.2997 70.2 43.7997 74.8C44.0997 75.1 44.3997 75.3 44.6997 75.2C44.8997 75.3 45.1997 75.1 45.4997 74.8ZM50.9997 53.7C50.9997 53.2 50.8997 52.6 50.8997 52C50.9997 49.5 50.7997 47 50.5997 44.6C50.3997 42.9 50.0997 41.3 49.6997 39.7C49.2997 38.1 48.7997 36.6 48.0997 35.1C47.3997 33.6 46.6997 32.3 45.9997 31.2C45.2997 30.2 44.7997 29.6 44.2997 29.7C43.9997 29.7 43.6997 30.2 43.3997 31.2C42.1997 34.4 41.7997 37.7 42.0997 40.9C42.3997 43.4 43.1997 46 44.3997 48.5C45.5997 51.1 47.4997 53 50.0997 54.3C50.2997 54.4 50.4997 54.4 50.6997 54.4C50.8997 54.5 50.9997 54.2 50.9997 53.7Z" fill="white"/>
          <path d="M67.9 73.5C66.9 68.6 66.1 63.6 65.5 58.6C64.6 49.7 64 44.5 63.9 42.9C63.6 40 63.4 36.1 63.1 31.3C63 29.6 63 28.1 63 26.5C63 25.6 63 24.7 63 23.8C63 22.9 63.6 22.1 64.7 21.3C65.4 20.8 66.2 20.5 67.1 20.3C68.3 20 69.5 19.8 70.8 19.7C72.7 19.5 74.7 19.5 76.6 19.7C80.8 20.6 83.9 22.7 85.9 25.9C87.9 29.1 89.1 32.6 89.6 36.3C90.2 41.7 89.8 46.9 88.3 51.8C86.8 56.8 84.2 60.9001 80.5 64.4001C80.1 64.6001 79.7 64.9001 79.4 65.3001C81.2 66.3001 83 66.7001 85 66.4001C85.6 66.3001 86 66.2 86.3 66.1C86.6 66 86.8 65.9001 87.1 65.9001C87.3 65.9001 87.7 65.8001 88.1 65.8001C88.9 65.7001 89.7 65.7001 90.5 65.8001C90.6 65.9001 90.8 66 91.1 66C91.4 66 91.7 66.1001 91.9 66.3001C92.1 66.5001 92.4 66.7 92.5 67C92.6 67.6 92.2 68.2 91.4 68.7C89.5 69.5 87.5 70.1001 85.5 70.3001C83.7 70.5001 82.1 70.6 80.6 70.5C79.2 70.4 77.6 70.1 75.7 69.6L76.3 73.1C76.5 74.8 75.3 75.8 72.6 76.1C70 76.4 68.4 75.5 67.9 73.5ZM78.4 56.4001C81.1 50.4001 82 44.2 81.3 37.8C80.2 29 76.9 24.2 71.3 23.3C71.1 23.3 71 23.7 71.1 24.5L71.3 28.8C71.8 37.6 72.8 48.7 74.4 62C76.1 60.4 77.4 58.5001 78.4 56.4001Z" fill="white"/>
          <path d="M91.5013 69.4C91.2013 64.4 91.1013 59.3 91.3013 54.3C91.6013 45.4 91.9013 40.1 92.0013 38.5C92.1013 35.6 92.4013 31.7 92.9013 26.9C93.0013 25.3 93.2013 23.7 93.5013 22.2C93.6013 21.3 93.8013 20.4 93.9013 19.5C94.0013 18.6 94.7013 17.9 96.0013 17.2C96.8013 16.8 97.6013 16.6 98.5013 16.6C99.7013 16.5 101.001 16.5 102.201 16.5C104.201 16.6 106.101 16.8 108.001 17.4C112.001 18.9 114.801 21.4 116.301 24.9C117.801 28.3 118.501 32 118.401 35.7C118.301 41.1 117.101 46.2 114.901 50.9C112.701 55.6 109.501 59.3 105.401 62.2C105.001 62.4 104.601 62.6 104.101 63C105.701 64.2 107.501 64.9 109.501 64.9C110.101 64.9 110.501 64.8 110.801 64.8C111.101 64.7 111.401 64.7 111.601 64.7C111.801 64.7 112.201 64.7 112.601 64.7C113.401 64.7 114.201 64.8 115.001 65C115.101 65.1 115.301 65.2 115.601 65.3C115.901 65.4 116.101 65.5 116.401 65.7C116.701 65.9 116.801 66.2 116.901 66.5C116.901 67.2 116.401 67.6 115.501 68C113.501 68.5 111.501 68.8 109.401 68.7C107.601 68.7 106.001 68.5 104.601 68.2C103.201 67.9 101.601 67.4 99.9013 66.6L100.001 70.2C100.001 71.9 98.6013 72.7 95.9013 72.7C93.1013 72.6 91.7013 71.5 91.5013 69.4ZM104.401 54C107.901 48.4 109.801 42.4 109.901 36C110.101 27.1 107.501 21.9 102.101 20.3C101.901 20.3 101.701 20.7 101.701 21.4L101.201 25.7C100.401 34.5 99.8013 45.6 99.5013 59C101.501 57.6 103.101 56 104.401 54Z" fill="white"/>
          <path d="M140.901 68.8C139.901 68.6 139.401 67.9 139.401 66.8L138.501 58.3C138.401 58 138.301 57.8 138.201 57.8C138.101 57.8 137.801 57.8 137.301 57.8C134.301 57.9 131.601 58.3 129.101 59C128.901 59 128.701 59.1 128.601 59.2C128.501 59.3 128.401 59.5 128.501 60C128.501 60.7 128.501 61.3 128.501 61.9C128.401 62.4 128.401 63 128.401 63.5L128.601 64.5L128.501 65.1C128.501 65.8 128.701 66.4 128.901 67C128.901 67.8 128.601 68.4 127.801 68.8C127.001 69.2 126.201 69.5 125.201 69.5C122.001 69.6 120.301 68.4 120.201 65.8L120.001 63.5L120.101 60.9C120.101 60.6 119.701 60.4 119.001 60.3C118.301 60.2 117.901 59.8 117.701 59.2C117.701 58.4 118.101 57.9 119.101 57.7C119.601 57.5 119.901 57.2 120.001 56.9C120.101 56.6 120.201 56.2 120.301 55.8C120.701 42.1 122.901 28.4 126.901 14.8C127.601 12.5 129.001 11.3 131.201 11.2C133.701 11.1 135.001 11.6 135.101 12.8C135.101 13 135.201 13.2 135.401 13.3C136.801 14.2 138.001 15.9 138.801 18.3L138.901 18.5C140.501 22.6 141.701 26.7 142.501 31L142.601 31.4C144.901 42.9 146.601 54.7 147.701 66.6C147.801 68.3 146.401 69.2 143.601 69.3C142.701 69.1 141.801 69 140.901 68.8ZM135.401 54.1L136.701 54C137.501 54 137.801 53.7 137.801 53.1C137.801 52.8 137.701 52.4 137.601 52C137.501 51.6 137.401 51.1 137.401 50.6C136.601 42.8 135.001 34.1 132.501 24.7C130.301 34.9 129.001 44.7 128.601 54.2L128.501 54.4C128.501 54.7 128.701 54.8 129.001 54.8H129.401C131.301 54.5 133.301 54.2 135.401 54.1Z" fill="white"/>
          <path d="M173.701 66.4C170.801 66.3 167.101 61.9 162.601 53.1L155.701 40.6L155.901 43.7C156.101 47.8 156.401 51.9 156.901 55.9C157.101 58 157.701 61.1 158.501 65.2C158.701 66.6 157.401 67.4 154.801 67.7C152.001 68 150.501 67.4 150.301 65.8C149.701 63.6 149.401 61.9 149.201 60.7L148.701 57.4C147.901 50.9 147.401 44.9 147.201 39.3C146.601 30.7 146.801 26 147.801 25.2C148.401 24.8 149.301 24.5 150.601 24.3C152.001 24.1 153.401 24.3 154.901 24.9C156.701 25.7 158.001 26.9 158.601 28.6C161.301 34.3 164.201 39.9 167.401 45.3C169.301 48.8 170.301 50.7 170.401 50.9C170.501 51.1 170.701 51.3 170.901 51.5L170.701 47.5C170.001 39.2 169.601 31.2 169.501 23.5L169.201 14.5C169.101 12.3 169.101 10.7 169.501 9.80002C169.801 8.90002 171.001 8.40002 173.101 8.10002C175.701 7.80002 177.201 8.40002 177.301 9.90002C177.401 11.1 177.501 14.7 177.601 20.7C177.801 29.1 178.401 40.3 179.401 54.3L179.501 56.5C179.901 60.9 179.701 63.5 178.901 64.5C178.501 65 177.801 65.5 176.701 65.8L173.701 66.4Z" fill="white"/>
          <path d="M188.6 63.6C187.4 63.3 186.5 62.6 186.1 61.6C184.9 58.1 183.9 54.1 183.1 49.6C182.1 43.2 181.2 36.5 180.5 29.4L180 24.4C179.2 17.7 178.9 11.1 179.2 4.30002C179.2 3.20002 179.7 2.40002 180.6 2.00002C181.8 1.40002 182.5 1.10002 182.8 1.00002C183.1 0.900024 183.5 0.800024 183.8 0.800024C184.2 0.700024 184.7 0.600024 185.3 0.400024C190.5 -0.599976 195.4 -0.0999756 199.8 1.90002C203.3 3.70002 205.8 6.50003 207.2 10.1C208.8 14 210 17.9 210.7 21.8C211.9 28.3 211.8 35 210.6 41.7C209.3 47.3 206.7 52.3 202.8 56.6C199.4 60.6 195.9 63 192.3 63.7C191 64 189.8 63.9 188.6 63.6ZM193.8 57.6C193.8 57.5 193.9 57.5 193.9 57.5C199.2 52.2 202.3 45.8 203.1 38.3C203.5 33.2 203.3 28.1 202.4 23.1C201.6 18.9 200.3 14.7 198.4 10.5C196.1 6.20002 192.4 4.10002 187.6 4.10002C187.3 4.20002 187.1 4.40002 187.2 4.90002C187.2 9.30002 187.3 12.5 187.5 14.3L188.5 25.8C188.7 28.7 189 31.6 189.4 34.4C189.8 37.2 190.1 39.5 190.3 41.1L191.6 49.6C192.1 52.3 192.8 55.1 193.6 57.8H193.7C193.7 57.7 193.8 57.7 193.8 57.6Z" fill="white"/>
          <path d="M217.701 53.0001C213.701 47.5001 211.801 40.5001 212.101 31.9001C212.301 25.1001 214.001 18.5001 217.201 12.2001C218.801 8.80005 221.101 6.90005 223.901 6.50005C224.301 6.40005 224.601 6.20005 224.901 5.90005C225.801 4.70005 227.001 3.80005 228.501 3.20005C229.901 2.60005 231.501 2.30005 233.101 2.40005C238.901 2.60005 242.701 6.40005 244.501 13.9001C245.101 16.5001 245.401 19.2001 245.301 21.8001C245.101 26.8001 244.601 31.3001 243.801 35.1001C243.801 35.5001 243.901 35.7001 244.001 35.8001C244.101 35.9001 244.401 36.0001 244.701 36.1001L246.701 36.3001H248.901C249.701 36.3001 250.601 36.5001 251.501 36.9001C252.201 37.1001 252.601 37.5001 252.701 38.2001C252.701 38.7001 252.301 39.2001 251.601 39.5001C250.201 40.1001 248.701 40.4001 247.201 40.3001L243.701 40.0001C243.301 40.0001 243.001 40.1001 242.801 40.3001C242.601 40.5001 242.501 41.0001 242.301 41.8001C241.401 44.7001 240.301 47.3001 238.801 49.5001C237.401 51.8001 235.601 53.6001 233.501 54.9001C231.401 56.2001 228.901 56.8001 225.901 56.7001C222.201 56.6001 219.401 55.4001 217.701 53.0001ZM227.201 52.2001C230.701 49.2001 233.201 44.6001 234.601 38.6001V38.2001C234.601 37.8001 234.101 37.5001 233.201 37.3001C232.701 37.2001 232.301 37.0001 231.901 36.8001C226.501 34.8001 223.101 31.0001 221.501 25.4001C221.501 25.2001 221.401 25.1001 221.201 25.1001C220.601 27.6001 220.301 30.2001 220.201 32.8001C220.001 40.3001 221.701 46.7001 225.401 51.9001C225.601 52.3001 225.901 52.4001 226.201 52.5001C226.601 52.5001 226.901 52.4001 227.201 52.2001ZM235.801 32.1001C235.801 31.6001 235.901 31.0001 236.001 30.4001C236.401 27.9001 236.701 25.5001 236.801 23.1001C236.901 21.4001 236.801 19.7001 236.701 18.1001C236.501 16.5001 236.201 14.9001 235.801 13.3001C235.301 11.7001 234.901 10.3001 234.301 9.20005C233.801 8.10005 233.301 7.50005 232.901 7.50005C232.601 7.50005 232.201 8.00005 231.801 8.90005C230.101 11.9001 229.201 15.1001 229.101 18.3001C229.001 20.8001 229.401 23.5001 230.201 26.2001C231.001 28.9001 232.601 31.1001 235.001 32.8001C235.201 32.9001 235.401 33.0001 235.501 33.0001C235.601 32.9001 235.801 32.6001 235.801 32.1001Z" fill="white"/>
          <path d="M53.5998 154.3C54.2998 153.8 54.4998 153 54.1998 151.9L51.9998 143.7C51.9998 143.4 51.9998 143.2 52.0998 143.2C52.1998 143.1 52.3998 143 52.8998 142.9C55.4998 142 57.9998 141.5 60.3998 141.3C60.5998 141.2 60.7998 141.2 60.8998 141.3C60.9998 141.3 61.1998 141.6 61.2998 142C61.4998 142.7 61.7998 143.3 61.9998 143.7C62.1998 144.2 62.4998 144.7 62.5998 145.2L62.7998 146.2L63.0998 146.8C63.2998 147.4 63.3998 148.1 63.3998 148.8C63.5998 149.5 64.1998 150 64.9998 150.1C65.7998 150.2 66.5998 150.2 67.4998 149.9C70.2998 149 71.2998 147.3 70.4998 144.8L69.7998 142.6L68.7998 140.2C68.6998 139.9 68.8998 139.6 69.4998 139.3C70.0998 139 70.2998 138.5 70.1998 137.8C69.8998 137 69.3998 136.7 68.4998 136.9C67.9998 136.9 67.6998 136.7 67.3998 136.5C67.1998 136.2 66.9998 135.9 66.7998 135.5C61.4998 122.8 54.7998 110.8 46.4998 99.4C45.0998 97.5 43.4998 96.9 41.4998 97.5C39.2998 98.2 38.2998 99.2 38.6998 100.3C38.7998 100.5 38.7998 100.7 38.5998 100.9C37.6998 102.3 37.2998 104.2 37.3998 106.7V106.9C37.4998 111.2 37.9998 115.5 38.6998 119.7V120.1C40.8998 131.6 43.5998 143.2 46.8998 154.7C47.3998 156.3 48.8998 156.6 51.3998 155.8C52.0998 155.2 52.8998 154.9 53.5998 154.3ZM53.0998 138.7L51.8998 139.1C51.1998 139.3 50.7998 139.2 50.5998 138.6C50.4998 138.3 50.3998 138 50.3998 137.5C50.3998 137 50.2998 136.6 50.0998 136.1C47.9998 128.5 46.2998 119.9 44.9998 110.3C50.4998 119.1 55.1998 127.8 58.8998 136.5L58.9998 136.6C59.0998 136.9 58.9998 137.1 58.7998 137.2L58.3998 137.3C56.6998 137.7 54.8998 138.2 53.0998 138.7Z" fill="white"/>
          <path d="M98.1998 147.9C95.1998 148 90.8998 143.1 85.2998 133.3L76.5998 119.2L77.1998 122.8C77.9998 127.6 78.8998 132.3 79.9998 137C80.4998 139.4 81.4998 143 82.8998 147.8C83.2998 149.4 82.0998 150.5 79.4998 151C76.6998 151.6 75.0998 151 74.6998 149.2C73.7998 146.7 73.1998 144.7 72.8998 143.2L71.9998 139.4C70.2998 131.9 68.8998 124.9 67.8998 118.3C66.0998 108.2 65.5998 102.7 66.4998 101.7C66.9998 101.2 67.8998 100.8 69.0998 100.5C70.3998 100.2 71.8998 100.3 73.3998 100.8C75.2998 101.6 76.7998 102.9 77.6998 104.8C81.1998 111.3 84.8998 117.6 88.8998 123.7C91.2998 127.7 92.5998 129.8 92.6998 130C92.7998 130.2 92.9998 130.5 93.2998 130.7L92.4998 126C90.5998 116.4 89.0998 107 87.8998 97.9L86.2998 87.4C85.7998 84.8 85.6998 82.9 85.8998 81.9C86.0998 80.8 87.1998 80.1 89.2998 79.6C91.8998 79 93.3998 79.6 93.7998 81.4C94.0998 82.8 94.6998 87 95.5998 94C96.9998 103.9 99.1998 117 102.2 133.3L102.6 135.9C103.6 141 103.8 144.1 103.2 145.4C102.9 146.1 102.2 146.6 101.2 147.1L98.1998 147.9Z" fill="white"/>
          <path d="M108.301 145.8C107.101 145.4 106.301 144.7 105.901 143.6C104.901 140.1 104.201 136 103.601 131.4C103.001 125 102.501 118.2 102.201 111.1L102.001 106.1C101.601 99.4 101.801 92.7 102.501 86C102.601 84.9 103.101 84.2 104.001 83.8C105.201 83.3 105.901 83 106.301 82.9C106.601 82.8 107.001 82.8 107.401 82.7C107.801 82.7 108.301 82.6 108.901 82.4C114.201 81.8 119.001 82.6 123.301 84.8C126.701 86.8 129.001 89.7 130.101 93.5C131.501 97.5 132.401 101.4 132.901 105.4C133.701 112 133.201 118.6 131.501 125.2C129.801 130.7 126.901 135.5 122.801 139.6C119.201 143.4 115.601 145.6 111.901 146C110.701 146.3 109.501 146.2 108.301 145.8ZM113.901 140.1C113.901 140 114.001 140 114.001 140C119.601 135 123.101 128.8 124.401 121.4C125.201 116.3 125.201 111.2 124.601 106.2C124.101 102 123.001 97.7 121.401 93.4C119.301 89 115.901 86.6 111.001 86.3C110.601 86.3 110.501 86.6 110.601 87.1C110.401 91.5 110.301 94.7 110.301 96.5L110.601 108C110.601 110.9 110.701 113.8 110.901 116.7C111.101 119.6 111.301 121.8 111.301 123.4L112.101 132C112.401 134.8 112.901 137.5 113.601 140.3H113.701C113.801 140.2 113.901 140.2 113.901 140.1Z" fill="white"/>
          <path d="M137 140.8C132 135 129.2 127.3 128.6 117.5C128.2 109.8 129.4 102.2 132.2 94.6C133.7 90.6 135.9 88.2 139 87.4C139.5 87.2 139.8 87 140 86.6C140.9 85.1 142.1 84 143.7 83.2C145.2 82.4 146.9 81.9 148.7 81.8C155.1 81.4 159.7 85.4 162.4 93.6C163.4 96.5 163.9 99.5 164.1 102.5C164.4 108.2 164.3 113.3 163.8 117.7C163.8 118.1 163.9 118.4 164.1 118.5C164.3 118.6 164.6 118.7 165 118.8H167.2L169.7 118.6C170.6 118.5 171.6 118.7 172.6 119C173.4 119.2 173.9 119.6 174.1 120.3C174.1 120.9 173.8 121.4 173 121.9C171.5 122.7 169.9 123.2 168.2 123.3H164.3C163.8 123.3 163.5 123.5 163.4 123.8C163.3 124.1 163.1 124.7 163 125.5C162.3 128.8 161.3 131.9 160 134.6C158.6 137.3 156.9 139.6 154.7 141.3C152.5 143 149.8 144 146.5 144.2C142.3 144.4 139.2 143.3 137 140.8ZM147.5 138.9C151.1 135.1 153.4 129.7 154.3 122.7V122.3C154.3 121.9 153.7 121.6 152.7 121.4C152.2 121.3 151.7 121.2 151.2 121C145 119.3 140.8 115.3 138.6 109.2C138.6 109 138.5 108.9 138.3 108.9C137.9 111.8 137.8 114.8 138 117.7C138.5 126.2 141.1 133.3 145.7 138.8C146 139.2 146.3 139.4 146.6 139.4C146.8 139.3 147.1 139.2 147.5 138.9ZM154.9 115.3C154.9 114.7 154.9 114.1 154.9 113.4C155.1 110.6 155.2 107.8 155 105C154.9 103.1 154.7 101.2 154.3 99.4C154 97.6 153.5 95.8 152.8 94C152.1 92.2 151.5 90.7 150.8 89.5C150.1 88.3 149.5 87.7 149.1 87.7C148.8 87.7 148.4 88.3 148 89.4C146.4 93 145.8 96.6 146 100.3C146.2 103.2 146.8 106.1 148 109.1C149.2 112.1 151.1 114.4 153.9 116.1C154.2 116.2 154.4 116.3 154.5 116.3C154.8 116.2 154.9 115.9 154.9 115.3Z" fill="white"/>
          <path opacity="0.35" fill-rule="evenodd" clip-rule="evenodd" d="M202.401 121.4C204.401 123.1 207.001 125.7 207.101 127C207.101 129.1 200.701 129.8 200.701 129.8C200.701 129.8 203.001 133.5 201.601 134.2C200.201 134.9 191.201 128.8 192.701 127.1C194.201 125.4 199.501 125.3 199.501 125.3C194.701 120.2 197.801 117.4 202.401 121.4Z" fill="white"/>
          <path opacity="0.58" fill-rule="evenodd" clip-rule="evenodd" d="M220.7 106.9C224.2 108.8 229 111.7 229.5 113.7C230.3 116.9 221 120.1 221 120.1C221 120.1 225.7 124.8 223.8 126.3C222 127.8 206.5 121.8 208.1 118.8C209.7 115.7 217.5 113.8 217.5 113.8C208.9 107.6 212.5 102.5 220.7 106.9Z" fill="white"/>
          <path opacity="0.69" fill-rule="evenodd" clip-rule="evenodd" d="M191.901 84.1C196.801 83.8 203.801 83.6 205.601 85.4C208.501 88.2 200.901 97.7 200.901 97.7C200.901 97.7 208.901 99.5 208.001 102.3C207.101 105.1 187.001 109.1 186.601 104.8C186.201 100.5 193.101 93.3 193.101 93.3C180.001 92.7 180.401 84.9 191.901 84.1Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M233.3 78C237.1 81.5 242.2 86.8 242.1 89.5C242 93.7 229.3 94.7 229.3 94.7C229.3 94.7 233.6 102.2 230.8 103.5C228 104.8 210.6 92.1 213.6 88.8C216.6 85.5 227.2 85.6 227.2 85.6C218.1 75 224.4 69.7 233.3 78Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_1533_720">
          <rect width="252.5" height="155.9" fill="white"/>
          </clipPath>
          </defs>
          </svg>
          </h1>
      </div>
      
      <nav className={styles.navigation}>
        {navigationLinks.map((link) => (
          <Link 
            key={link.href}
            href={link.href} 
            className={`${styles.navItem} ${isActive(link.href) ? styles.active : ''}`}
            onClick={onItemClick}
          >
            <FontAwesomeIcon icon={link.icon} /> {link.label}
          </Link>
        ))}
      </nav>

      {session?.user && (
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{session.user.name}</span>
            <span className={styles.userEmail}>{session.user.email}</span>
          </div>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            Salir
          </button>
        </div>
      )}
    </aside>
  );
};

export default React.memo(Sidebar); 