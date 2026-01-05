import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin, FaTwitter, FaFileDownload } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { BsPersonLinesFill } from "react-icons/bs";
import { supabase } from "../config/supabaseClient";
// Default images (will be used as fallback)
import LiannFront from "../assets/LiannFront.png";
import LiannBack from "../assets/LiannBack.png";
import resume from "../assets/LiannGonzalesResume.pdf";
import BibleVerse from "../api/BibleVerse";
import CircularText from "../ui/CircularText";

function Home() {
  const [flipped, setFlipped] = useState(false);
  // Default to local images initially
  const [profilePictures, setProfilePictures] = useState({
    front: LiannFront,
    back: LiannBack
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  // More aggressive cache busting with versioning
  const cacheBustUrl = (url) => {
    if (!url) return url;
    // Remove any existing cache busting parameters
    const cleanUrl = url.split('?')[0];
    // Add a version parameter that changes with each call
    const version = `v=${Date.now()}`;
    const bustedUrl = `${cleanUrl}?${version}`;
    console.log(`🔄 Cache busted URL: ${bustedUrl}`);
    return bustedUrl;
  };

  // Manual refresh function with force reload
  const refreshPictures = async () => {
    console.log(' Manual refresh triggered');
    // Clear current images first to force reload
    setProfilePictures({
      front: LiannFront,
      back: LiannBack
    });
    
    // Add a small delay to ensure state updates
    setTimeout(() => {
      fetchProfilePictures();
    }, 100);
  };

  const fetchProfilePictures = async () => {
    try {
      console.log('🔄 Fetching profile pictures...');
      setLoading(true);
      
      // Force a fresh fetch by bypassing cache
      const { data, error } = await supabase
        .from('about')
        .select('profile_picture_front, profile_picture_back, updated_at')
        .eq('id', 1)
        .single();

      if (error) throw error;

      if (data) {
        console.log('✅ Fetched profile data:', data);
        
        // Create new image objects to force re-render
        const frontUrl = data.profile_picture_front 
          ? `${data.profile_picture_front}?t=${Date.now()}` 
          : LiannFront;
        
        const backUrl = data.profile_picture_back 
          ? `${data.profile_picture_back}?t=${Date.now()}` 
          : LiannBack;
        
        console.log('🖼️ Front URL:', frontUrl);
        console.log('🖼️ Back URL:', backUrl);
        
        // Force state update with new objects
        setProfilePictures(prev => ({
          front: frontUrl,
          back: backUrl
        }));
        
        setLastUpdated(Date.now());
        console.log('🕒 Profile pictures updated at:', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error fetching profile pictures:', error);
      // Fallback to default images on error
      setProfilePictures({
        front: LiannFront,
        back: LiannBack
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchProfilePictures();

    // Set up real-time subscription with more detailed logging
    const channel = supabase
      .channel('realtime-about')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'about',
          filter: 'id=eq.1'
        },
        (payload) => {
          console.log('🔔 Real-time update received:', payload);
          
          // Check if the update includes profile picture changes
          if (payload.new && (payload.new.profile_picture_front || payload.new.profile_picture_back)) {
            console.log('🖼️ Updating profile pictures from real-time event');
            
            // Force a complete refresh of the images
            const frontUrl = payload.new.profile_picture_front 
              ? `${payload.new.profile_picture_front}?t=${Date.now()}` 
              : LiannFront;
              
            const backUrl = payload.new.profile_picture_back 
              ? `${payload.new.profile_picture_back}?t=${Date.now()}` 
              : LiannBack;
            
            console.log('🔄 New image URLs:', { frontUrl, backUrl });
            
            // Update state with new URLs
            setProfilePictures({
              front: frontUrl,
              back: backUrl
            });
            
            // Force a re-render with a new timestamp
            setLastUpdated(Date.now());
          }
        }
      )
      .subscribe((status, err) => {
        console.log('🔔 Subscription status:', status);
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error:', err);
          // Try to resubscribe on error
          setTimeout(() => {
            console.log('🔄 Attempting to resubscribe...');
            channel.unsubscribe().then(() => {
              channel.subscribe();
            });
          }, 1000);
        } else if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates');
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <>
      <motion.section
        id="home"
        className="pt-24 sm:pt-28 pb-16 relative flex items-center justify-center min-h-screen
          bg-base-100 dark:bg-gray-950
          transition-colors duration-300"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >

        <div className="relative z-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 items-center justify-center gap-8">
          {/* Left Section - Image with CircularText Overlay */}
          <div className="flex justify-center md:justify-end">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
            >
              <motion.div
                onClick={handleFlip}
                className="w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 cursor-pointer relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Front Side */}
                <div
                  className="absolute w-full h-full rounded-2xl overflow-hidden flex justify-center items-center"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {profilePictures.front && profilePictures.back && (
                    <img
                      src={flipped ? profilePictures.back : profilePictures.front}
                      alt={flipped ? "Liann Gonzales Back" : "Liann Gonzales"}
                      className={`w-full h-full object-cover rounded-full transition-all duration-500 ${
                        flipped ? "rotate-y-180" : ""
                      }`}
                      onError={(e) => {
                        console.error(' Error loading image:', e.target.src);
                        // Fallback to default images if the loaded image fails
                        const fallback = flipped ? LiannBack : LiannFront;
                        console.log(' Falling back to default image');
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = fallback;
                        
                        // Update state to prevent future errors
                        setProfilePictures(prev => ({
                          ...prev,
                          [flipped ? 'back' : 'front']: fallback
                        }));
                      }}
                      key={`${flipped ? 'back' : 'front'}-${lastUpdated || 'initial'}`}
                    />
                  )}
                </div>

                {/* Back Side */}
                <div
                  className="absolute w-full h-full rounded-2xl overflow-hidden flex justify-center items-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {profilePictures.front && profilePictures.back && (
                    <img
                      src={flipped ? profilePictures.back : profilePictures.front}
                      alt={flipped ? "Liann Gonzales Back" : "Liann Gonzales"}
                      className={`w-full h-full object-cover rounded-full transition-all duration-500 ${
                        flipped ? "rotate-y-180" : ""
                      }`}
                      onError={(e) => {
                        console.error(' Error loading image:', e.target.src);
                        // Fallback to default images if the loaded image fails
                        const fallback = flipped ? LiannBack : LiannFront;
                        console.log(' Falling back to default image');
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = fallback;
                        
                        // Update state to prevent future errors
                        setProfilePictures(prev => ({
                          ...prev,
                          [flipped ? 'back' : 'front']: fallback
                        }));
                      }}
                      key={`${flipped ? 'back' : 'front'}-${lastUpdated || 'initial'}`}
                    />
                  )}
                </div>
              </motion.div>

              {/* CircularText Overlay - Lower Left Corner */}
              <motion.div 
                className="absolute bottom-0 left-0 pointer-events-none z-10"
                initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative -ml-16 sm:-ml-20 md:-ml-24 -mb-8 sm:-mb-10 md:-mb-12">
                  <CircularText
                    text="Information*Technology*"
                    onHover="speedUp"
                    spinDuration={20}
                    className="custom-class"
                  />
                  {/* Glow effect around circular text */}
                  <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 opacity-50 -z-10"></div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center text-center md:text-left">
            <motion.h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Liann Gonzales
            </motion.h1>

            <motion.div className="text-xl sm:text-2xl mt-3 font-semibold text-blue-400">
              <TypeAnimation
                sequence={[
                  "I am an IT Student 💻",
                  "I am a Graphic Designer 🎨",
                  "I am a Front-End Developer 🖥️",
                  "I am a Digital Artist ✏️",
                  "I am a Gymnastics Coach 🤸‍♀️",
                  "I am a UI/UX Designer 📱",
                ]}
                speed={60}
                deletionSpeed={40}
                deletionDelay={1500}
                loop={true}
              />
            </motion.div>

            <div className="mt-4">
              <BibleVerse />
            </div>
            
            <motion.div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
              <a
                href={resume}
                download="LiannGonzalesResume.pdf"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#3246ea] to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                📄 Download Resume
              </a>

              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-200 font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transform hover:-translate-y-1 transition-all duration-300"
              >
                ✉️ Contact Me
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Debug Info - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-4 bg-black bg-opacity-70 text-white text-xs rounded-lg max-w-xs z-50">
          <h3 className="font-bold mb-2">Profile Pictures Debug</h3>
          <div className="space-y-1">
            <p>Front: {String(profilePictures.front).substring(0, 50)}...</p>
            <p>Back: {String(profilePictures.back).substring(0, 50)}...</p>
            <p>Last Updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
            <button 
              onClick={refreshPictures}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Refresh Images
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;