'use client';

import { Button } from "@/components/ui/button"; 
import { Camera, Heart, Share2 } from "lucide-react";
import { motion, Easing } from "framer-motion"; // Impor Easing

export default function HeroSection() {
  // Definisikan easing sebagai variabel dengan tipe Easing
  const easeOutCubicBezier: Easing = [0, 0, 0.58, 1];

  // Varian animasi untuk teks dan tombol
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutCubicBezier } }, // Gunakan variabel easing
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOutCubicBezier, delay: 0.4 } }, // Gunakan variabel easing
  };

  const iconCardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: 90 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: easeOutCubicBezier, // Gunakan variabel easing
        delay: 0.6 + i * 0.2, // Delay berurutan untuk setiap kartu
      },
    }),
  };

  return (
    <section className="bg-gradient-dynamic-hero py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/camera-pattern.svg')] bg-repeat"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl font-bold text-dynamic-primary mb-6"
          >
            Abadikan Momen
            <span className="text-dynamic-accent block bg-gradient-to-r from-dynamic-accent to-dynamic-accent bg-clip-text">Terindah Anda</span>
          </motion.h1>
          
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ ...textVariants.visible.transition, delay: 0.2 }}
            className="text-xl text-dynamic-secondary mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Platform berbagi foto untuk event spesial Anda. Biarkan tamu 
            mengabadikan setiap momen berharga dan berbagi kebahagiaan bersama.
            <span className="block mt-2 font-medium text-dynamic-accent">
              📸 Real-time sharing • 🏷️ Professional watermark • ⚡ Instant upload
            </span>
          </motion.p>

          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          >
            <Button 
              asChild
              size="lg" 
              className="btn-dynamic-primary mobile-button text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              <a href="#contact">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                📞 Hubungi Kami
              </a>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="btn-dynamic-secondary mobile-button text-base sm:text-lg py-4 sm:py-6 px-6 sm:px-8 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              <a href="#gallery">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                💫 Lihat Portfolio
              </a>
            </Button>
          </motion.div>

          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            {[
              { 
                icon: Camera, 
                title: "Upload Mudah", 
                description: "Tamu dapat langsung upload foto melalui smartphone",
                emoji: "📱"
              },
              { 
                icon: Share2, 
                title: "Berbagi Instan", 
                description: "Bagikan momen spesial secara real-time dengan watermark otomatis",
                emoji: "⚡"
              },
              { 
                icon: Heart, 
                title: "Kenangan Abadi", 
                description: "Simpan semua foto dalam kualitas tinggi untuk kenangan",
                emoji: "💝"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={iconCardVariants}
                initial="hidden"
                animate="visible"
                custom={i}
                className="card-dynamic rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-dynamic"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-dynamic-button flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                  {item.emoji}
                </div>
                <h3 className="text-xl font-bold mb-3 text-dynamic-primary">{item.title}</h3>
                <p className="text-dynamic-secondary leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}