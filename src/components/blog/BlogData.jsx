// Import images using Vite's new URL syntax
import cinamonImg from "../../assets/blog/cinnamonImg.png";
import teaImg from "../../assets/blog/teaImg.png";
import cinnamonteaImg from "../../assets/blog/cinnamonteaImg.png";
import cinnaImg from "../../assets/blog/cinnaImg.png";
import fertilizer1 from "../../assets/blog/fertilizer1.png";
import cofee2 from "../../assets/blog/cofee2.png";
import spice1 from "../../assets/blog/spice1.png";
import sus1 from "../../assets/blog/sus1.png";
import tom1 from "../../assets/blog/tom1.png";

// Debug logging for image imports
console.log("=== BLOG DATA IMAGE IMPORTS ===");
console.log("cinamonImg:", cinamonImg);
console.log("teaImg:", teaImg);
console.log("cinnamonteaImg:", cinnamonteaImg);
console.log("cinnaImg:", cinnaImg);
console.log("fertilizer1:", fertilizer1);
console.log("cofee2:", cofee2);
console.log("spice1:", spice1);
console.log("sus1:", sus1);
console.log("tom1:", tom1);
console.log("=== END BLOG DATA IMPORTS ===");

const BlogData = [
  {
    id: "1",
    title: "Maximizing Yields with Precision Farming Techniques",
    excerpt: "Explore new precision farming techniques that revolutionize your crop production, leading to higher yields and reduced costs.",
    category: "Technology",
    date: "March 20, 2024",
    readTime: "4 min read",
    image: cinamonImg,
  },
  {
    id: "2",
    title: "Sustainable Farming Practices for a Greener Future",
    excerpt: "Learn about eco-friendly farming methods that promote environmental sustainability and long-term product quality.",
    category: "Sustainability",
    date: "March 15, 2024",
    readTime: "2 min read",
    image: teaImg,
  },
  {
    id: "3",
    title: "Effective Crop Management Strategies for Optimal Growth",
    excerpt: "Discover proven techniques for managing your crops, minimizing pest damage, and ensuring healthy growth and maximum yields.",
    category: "Management",
    date: "March 10, 2024",
    readTime: "4 min read",
    image: cofee2,
  },
  {
    id: "4",
    title: "The Role of Technology in Modern Agriculture",
    excerpt: "Explore how technology is transforming agriculture, from automated systems to data-driven decision-making.",
    category: "Innovation",
    date: "March 8, 2024",
    readTime: "3 min read",
    image: fertilizer1,
  },
  {
    id: "5",
    title: "Water Conservation Techniques for Farmers",
    excerpt: "Discover innovative water management strategies that help farmers optimize irrigation and reduce water waste.",
    category: "Tips",
    date: "March 6, 2024",
    readTime: "5 min read",
    image: spice1,
  },
  {
    id: "6",
    title: "Organic Pest Control Methods",
    excerpt: "Learn about natural pest control techniques that protect your crops without harming the environment.",
    category: "Sustainability",
    date: "March 4, 2024",
    readTime: "2 min read",
    image: sus1,
  },
  {
    id: "7",
    title: "Soil Health and Crop Nutrition",
    excerpt: "Understand the importance of soil health and how proper nutrition management leads to better crop yields.",
    category: "Management",
    date: "March 1, 2024",
    readTime: "1 min read",
    image: tom1,
  },
];

export default BlogData; 