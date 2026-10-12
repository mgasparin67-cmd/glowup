import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'glowup | Understand your face. Care for your skin.',description:'Private photo analysis preview with measured facial proportions and cautious cosmetic skincare guidance.',robots:{index:false,follow:false},icons:{icon:'/glowup-liquid-icon.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
