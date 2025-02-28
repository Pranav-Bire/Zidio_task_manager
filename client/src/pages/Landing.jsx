import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gridPattern from '../assets/grid.svg';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Smart Task Organization",
      description: "Intelligent task categorization and priority management powered by AI",
      icon: "🎯"
    },
    {
      title: "Real-time Collaboration",
      description: "Work seamlessly with your team in real-time with instant updates",
      icon: "👥"
    },
    {
      title: "Advanced Analytics",
      description: "Get detailed insights into task completion and team productivity",
      icon: "📊"
    },
    {
      title: "Automated Workflows",
      description: "Streamline your processes with automated task assignments and reminders",
      icon: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Patterns */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${gridPattern})`,
            opacity: 0.2
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black to-black" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold tracking-tight"
        >
          Zidio
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-16 max-w-7xl mx-auto">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500"
          >
            Zidio Task Manager
            <br />
            for the AI Era
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Experience the next generation of task management. Powered by AI to help you organize, 
            collaborate, and achieve more than ever before.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <button
              onClick={() => navigate('/log-in')}
              className="px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Try Zidio
            </button>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-200 border border-white/10"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Animated Gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(50,50,50,0.2),_rgba(0,0,0,0))]" />
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(50,50,50,0.2),_rgba(0,0,0,0))]"
        />
      </div>
    </div>
  );
};

export default Landing;
