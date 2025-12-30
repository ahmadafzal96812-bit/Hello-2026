import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const events = [
    {
        title: "Grand Midnight Gala",
        time: "Dec 31, 22:00",
        location: "Central Plaza, NYC",
        image: "https://picsum.photos/800/600?random=1",
        description: "Live music, gourmet dining, and the best view of the fireworks."
    },
    {
        title: "Virtual Global Party",
        time: "Dec 31, 20:00",
        location: "Online / Twitch",
        image: "https://picsum.photos/800/600?random=2",
        description: "Connect with thousands around the world for a digital rave."
    },
    {
        title: "Sunrise Yoga",
        time: "Jan 1, 06:00",
        location: "Golden Beach",
        image: "https://picsum.photos/800/600?random=3",
        description: "Start the year with mindfulness, peace, and the first sunrise."
    }
];

const Events: React.FC = () => {
    return (
        <section id="events" className="py-24 bg-gradient-to-b from-black to-[#0a0a1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">Upcoming Events</h2>
                    <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800"
                        >
                            <div className="aspect-w-16 aspect-h-9 h-48 overflow-hidden">
                                <img 
                                    src={event.image} 
                                    alt={event.title} 
                                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{event.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                                
                                <div className="space-y-2 text-sm text-gray-300">
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-2 text-yellow-500" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin size={16} className="mr-2 text-yellow-500" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;