import cinamonImg from "../../assets/blog/cinamonImg.png"
import teaImg from "../../assets/blog/teaImg.png"
import fertilizer1 from "../../assets/blog/fertilizer1.png"
import cofee1 from "../../assets/blog/cofee1.png"
import spice1 from "../../assets/blog/spice1.png"
import sus1 from "../../assets/blog/sus1.png"
import tom1 from "../../assets/blog/tom1.png"

import CinnamonTea from "./BlogContents/CinnamonTea"
import OrganicTeaFarming from "./BlogContents/OrganicTeaFarming"
import Farming from "./BlogContents/Farming"
import FertilizerArticle from "./BlogContents/Fertilizer"
import Spice from "./BlogContents/Spice"
import Sustainability from "./BlogContents/Sustainability"
import Tomato from "./BlogContents/Tomato"

const SamplePosts = [
  {
    id: "1",
    title: "Cinnamon Tea",
    excerpt:
      "Cinnamon, perhaps one of the most popular and tastiest of spices used for sweet & savory recipes. What many do not know is that cinnamon is actually the bark of a tree...",
    content: <CinnamonTea />,
    category: "Wellness",
    date: "March 15, 2024",
    readTime: "7 min read",
    image: cinamonImg,
  },
  {
    id: "2",
    title: "Organic Tea Farming Practices",
    excerpt:
      "This blog is your guide to the fascinating world of organic tea farming and its environmental, health, and flavor benefits...",
    content: <OrganicTeaFarming />,
    category: "Sustainability",
    date: "March 12, 2024",
    readTime: "7 min read",
    image: teaImg,
  },
  {
    id: "3",
    title: "7 Sustainable Coffee Farming Practices You Need to Know",
    excerpt:
      "Explore proven strategies for managing your crops throughout the growing season to ensure optimal health, productivity, and disease prevention.",
    content: <Farming />,
    category: "Management",
    date: "March 10, 2024",
    readTime: "6 min read",
    image: cofee1,
  },
  {
    id: "4",
    title: "Fertilizers and Crop Medicines: The Power Duo Behind Every Successful Farm",
    excerpt:
      "How fertilizers and crop protection medicines are lifelines that protect your investment and maximize your harvest.",
    content: <FertilizerArticle />,
    category: "Tips",
    date: "March 8, 2024",
    readTime: "8 min read",
    image: fertilizer1,
  },
  {
    id: "5",
    title: "The World of Spices: Flavor, Health, and Trade",
    excerpt:
      "Explore the fascinating world of spices, from their culinary uses to their role in global trade and cultural significance.",
    content: <Spice />,
    category: "Culinary",
    date: "March 6, 2024",
    readTime: "10 min read",
    image: spice1,
  },
  {
    id: "6",
    title: "Farming & Sustainability: How Ceylon Spices Support the Earth and Farmers",
    excerpt:
      "Discover how Sri Lanka's traditional spice farming practices promote environmental sustainability and empower rural communities.",
    content: <Sustainability />,
    category: "Sustainability",
    date: "March 4, 2024",
    readTime: "12 min read",
    image: sus1,
  },
  {
    id: "7",
    title: "The Power of Organic Tomatoes: A Healthier Harvest for You and the Planet",
    excerpt:
      "Discover how organic tomato farming benefits your health, supports farmers, and protects the environment through sustainable practices.",
    content: <Tomato />,
    category: "Sustainability",
    date: "March 2, 2024",
    readTime: "15 min read",
    image: tom1,
  },
]

export default SamplePosts
