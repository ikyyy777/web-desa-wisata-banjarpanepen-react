import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price?: number;
  slug: string;
}

export default function Card({ title, description, imageUrl, price, slug }: CardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform transition hover:scale-105"
      onClick={() => navigate(`/wisata/${slug}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={`${imageUrl}?auto=format&fit=crop&w=800&q=80`}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          {price && (
            <span className="text-green-600 font-bold">
              {price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}