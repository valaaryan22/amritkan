import Image from 'next/image';
import Link from 'next/link';
import { Globe, Instagram, Smartphone, Facebook, Youtube, MessageCircle, MapPin } from 'lucide-react';

export const metadata = {
  title: 'AMRITKAN | Social Links',
  description: 'Kan Kan Me Amrit - Connect with AMRITKAN across all our platforms',
};

export default function SocialLinksPage() {
  const links = [
    {
      title: 'Official Website',
      url: 'https://amritkan.in',
      icon: <Globe className="w-5 h-5" />,
      color: 'text-blue-600',
    },
    {
      title: 'Instagram',
      url: 'https://www.instagram.com/amritkan.in',
      icon: <Instagram className="w-5 h-5" />,
      color: 'text-pink-600',
    },
    {
      title: 'Download AMRITKAN App',
      url: 'https://amritkan.in/app',
      icon: <Smartphone className="w-5 h-5" />,
      color: 'text-emerald-600',
    },
    {
      title: 'Facebook',
      url: 'https://www.facebook.com/share/1B38UbMwg6/',
      icon: <Facebook className="w-5 h-5" />,
      color: 'text-blue-700',
    },
    {
      title: 'YouTube',
      url: 'https://youtube.com/@amritkan',
      icon: <Youtube className="w-5 h-5" />,
      color: 'text-red-600',
    },
    {
      title: 'Order on WhatsApp',
      url: 'https://wa.me/919898146462',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'text-green-500',
    },
    {
      title: 'Our Location',
      url: 'https://maps.google.com/?q=Amritkan',
      icon: <MapPin className="w-5 h-5" />,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-500 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-[20px] p-8 text-center shadow-[0_20px_40px_rgba(0,0,0,0.25)] border border-white/20">
        
        {/* Logo container */}
        <div className="mx-auto w-[110px] h-[110px] mb-4 relative bg-white rounded-full p-2 shadow-lg">
          <Image 
            src="/images/logo.png" 
            alt="AMRITKAN Logo" 
            fill
            className="object-contain p-2"
            priority
          />
        </div>

        {/* Brand details */}
        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">AMRITKAN</h1>
        <p className="text-green-50 mb-8 text-sm font-medium">Kan Kan Me Amrit</p>

        {/* Link Tree */}
        <div className="flex flex-col gap-4">
          {links.map((link, index) => (
            <Link 
              key={index} 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 p-4 bg-white rounded-[14px] text-gray-800 font-semibold no-underline transition-all duration-300 shadow-[0_8px_18px_rgba(0,0,0,0.15)] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,0,0,0.25)] hover:bg-green-50 group"
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${link.color}`}>
                {link.icon}
              </span>
              <span>{link.title}</span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-green-100 text-sm opacity-80 font-medium">
          &copy; {new Date().getFullYear()} AMRITKAN
        </div>
      </div>
    </div>
  );
}
