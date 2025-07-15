// Add a custom Google font as a primary font for the application

// Import Inter font from Google Fonts
import {Inter,Lusitana} from 'next/font/google';

// Specify what subset you want to load
export const inter = Inter({ subsets: ['latin'] });

// Import a secondary font
export const lusitana = Lusitana({
    weight: ['400','700'],
    subsets: ['latin']
});