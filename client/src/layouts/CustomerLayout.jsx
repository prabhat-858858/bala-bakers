import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton';

export default function CustomerLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FFFBF4] text-[#082B59]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingWhatsAppButton />
      <Footer />
    </div>
  );
}
