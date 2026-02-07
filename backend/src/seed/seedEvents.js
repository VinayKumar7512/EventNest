import "dotenv/config";
import mongoose from "mongoose";
import Event from "../models/Event.js";
import { connectDB } from "../config/db.js";
const seedEvents = async () => {
  try {
    await connectDB();
    await Event.deleteMany()
    const now = new Date();
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const createISTDate = (daysFromNow, hours = 18, minutes = 0) => {
      const date = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
      date.setHours(hours, minutes, 0, 0);
      return date;
    };
    const events = [
      {
        title: "Rock Concert Night - Hyderabad",
        description: "Experience an electrifying night of rock music featuring top Indian rock bands. Get ready for an unforgettable musical journey.",
        category: "concert",
        venue: "Hitex Exhibition Center",
        location: "Hyderabad, Telangana, India",
        startDate: createISTDate(10, 19, 0),
        endDate: createISTDate(10, 23, 0),
        price: 25000,
        totalSeats: 5000,
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Classical Music Evening - Bangalore",
        description: "An evening of classical Indian music featuring renowned artists. Experience the rich heritage of Indian classical music.",
        category: "concert",
        venue: "Bangalore Palace Grounds",
        location: "Bangalore, Karnataka, India",
        startDate: createISTDate(15, 18, 30),
        endDate: createISTDate(15, 22, 0),
        price: 18000,
        totalSeats: 3000,
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Bollywood Night - Chennai",
        description: "Dance to the beats of your favorite Bollywood hits. A night filled with energy, music, and celebration.",
        category: "concert",
        venue: "YMCA Grounds",
        location: "Chennai, Tamil Nadu, India",
        startDate: createISTDate(20, 19, 30),
        endDate: createISTDate(20, 23, 30),
        price: 22000,
        totalSeats: 4000,
        imageUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=640&h=360&fit=crop&q=80"
      },

      // CONFERENCES (3 events)
      {
        title: "Tech Summit 2026 - Bangalore",
        description: "Join industry leaders discussing AI, Cloud Computing, and Digital Transformation. Network with tech professionals and innovators.",
        category: "conference",
        venue: "Bangalore International Exhibition Centre",
        location: "Bangalore, Karnataka, India",
        startDate: createISTDate(12, 9, 0),
        endDate: createISTDate(13, 18, 0),
        price: 35000,
        totalSeats: 2000,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Startup Conclave - Hyderabad",
        description: "Connect with investors, mentors, and fellow entrepreneurs. Learn from successful startup founders and scale your business.",
        category: "conference",
        venue: "HICC Novotel",
        location: "Hyderabad, Telangana, India",
        startDate: createISTDate(18, 10, 0),
        endDate: createISTDate(18, 17, 0),
        price: 28000,
        totalSeats: 1500,
        imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Digital Marketing Conference - Chennai",
        description: "Master the latest digital marketing strategies, SEO, social media marketing, and content creation. Learn from experts.",
        category: "conference",
        venue: "Chennai Trade Centre",
        location: "Chennai, Tamil Nadu, India",
        startDate: createISTDate(25, 9, 30),
        endDate: createISTDate(25, 17, 30),
        price: 32000,
        totalSeats: 1800,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop&q=80"
      },

      // WORKSHOPS (3 events)
      {
        title: "Full Stack Development Workshop - Bangalore",
        description: "Hands-on workshop covering React, Node.js, MongoDB, and deployment. Build a complete MERN stack application.",
        category: "workshop",
        venue: "Tech Hub Bangalore",
        location: "Bangalore, Karnataka, India",
        startDate: createISTDate(8, 10, 0),
        endDate: createISTDate(9, 18, 0),
        price: 15000,
        totalSeats: 100,
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Data Science & ML Workshop - Hyderabad",
        description: "Learn Python, Pandas, Scikit-learn, and TensorFlow. Work on real-world projects and build your portfolio.",
        category: "workshop",
        venue: "Data Science Academy",
        location: "Hyderabad, Telangana, India",
        startDate: createISTDate(14, 9, 0),
        endDate: createISTDate(15, 17, 0),
        price: 18000,
        totalSeats: 80,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "UI/UX Design Masterclass - Chennai",
        description: "Master Figma, design systems, user research, and prototyping. Create stunning interfaces and improve user experience.",
        category: "workshop",
        venue: "Design Studio Chennai",
        location: "Chennai, Tamil Nadu, India",
        startDate: createISTDate(22, 10, 0),
        endDate: createISTDate(22, 18, 0),
        price: 12000,
        totalSeats: 60,
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640&h=360&fit=crop&q=80"
      },

      // FESTIVALS (3 events)
      {
        title: "Music & Food Festival - Bangalore",
        description: "A three-day festival featuring live music, food stalls, art installations, and cultural performances. Fun for the whole family.",
        category: "festival",
        venue: "Lalbagh Botanical Gardens",
        location: "Bangalore, Karnataka, India",
        startDate: createISTDate(30, 16, 0),
        endDate: createISTDate(32, 22, 0),
        price: 40000,
        totalSeats: 10000,
        imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Cultural Heritage Festival - Hyderabad",
        description: "Celebrate the rich culture and heritage of South India. Traditional dance, music, crafts, and authentic cuisine.",
        category: "festival",
        venue: "Shilparamam",
        location: "Hyderabad, Telangana, India",
        startDate: createISTDate(28, 15, 0),
        endDate: createISTDate(30, 21, 0),
        price: 35000,
        totalSeats: 8000,
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Tech & Innovation Festival - Chennai",
        description: "Explore cutting-edge technology, startups, robotics, and innovation. Interactive exhibits and tech talks.",
        category: "festival",
        venue: "Chennai Trade Centre",
        location: "Chennai, Tamil Nadu, India",
        startDate: createISTDate(35, 10, 0),
        endDate: createISTDate(37, 20, 0),
        price: 45000,
        totalSeats: 12000,
        imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=640&h=360&fit=crop&q=80"
      },

      // OTHER (3 events)
      {
        title: "Photography Expedition - Bangalore",
        description: "Join professional photographers for a day-long expedition. Learn landscape, portrait, and street photography techniques.",
        category: "other",
        venue: "Cubbon Park",
        location: "Bangalore, Karnataka, India",
        startDate: createISTDate(11, 6, 0),
        endDate: createISTDate(11, 18, 0),
        price: 15000,
        totalSeats: 50,
        imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Yoga & Wellness Retreat - Hyderabad",
        description: "A rejuvenating weekend retreat with yoga sessions, meditation, healthy meals, and wellness workshops.",
        category: "other",
        venue: "Wellness Resort",
        location: "Hyderabad, Telangana, India",
        startDate: createISTDate(16, 7, 0),
        endDate: createISTDate(17, 19, 0),
        price: 20000,
        totalSeats: 100,
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&h=360&fit=crop&q=80"
      },
      {
        title: "Cooking Masterclass - Chennai",
        description: "Learn authentic South Indian cuisine from master chefs. Hands-on cooking experience with traditional recipes.",
        category: "other",
        venue: "Culinary Academy",
        location: "Chennai, Tamil Nadu, India",
        startDate: createISTDate(19, 11, 0),
        endDate: createISTDate(19, 16, 0),
        price: 18000,
        totalSeats: 40,
        imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=640&h=360&fit=crop&q=80"
      }
    ];

    await Event.insertMany(events);
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} events`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};
seedEvents();