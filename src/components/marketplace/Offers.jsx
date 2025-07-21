"use client"
import { Link } from "react-router-dom"
import { FaShoppingCart, FaStar } from "react-icons/fa"
import { useCart } from "../cart/CartContext"
import plantea from "../../assets/marketplace/offers/plantea.jpg"

const products = [
  {
    id: 4,
    name: "Special Fertilizer Offer",
    details: "Limited-time offer on organic fertilizer blend.",
    price: 9.99,
    oldPrice: 12.99,
    discount: 23,
    category: "Offers",
    rating: 4.4,
    image: plantea,
    seller: "Green Growth",
    maxQuantity: 50,
  },
]

const Offers = () => {
  const { addToCart } = useCart()

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      seller: product.seller,
      category: product.category,
      price: product.price,
      maxQuantity: product.maxQuantity,
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition flex flex-col h-[370px] w-full max-w-xs mx-auto relative"
        >
          {/* Discount Badge */}
          {product.discount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
              -{product.discount}%
            </span>
          )}
          <Link to={`/product/${product.id}`} className="block">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t-2xl"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found"
              }}
            />
          </Link>
          <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-green-600 font-semibold text-sm">{product.category}</span>
              <span className="flex items-center text-yellow-500 text-sm font-semibold">
                <FaStar className="mr-1 text-base" />
                {product.rating}
              </span>
            </div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-green-700">
                {product.name}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.details}</p>
            <div className="flex items-end justify-between mt-auto">
              <div>
                <span className="text-green-700 font-bold text-lg">${product.price.toFixed(2)}</span>
                {product.oldPrice && (
                  <span className="text-gray-400 text-base line-through ml-2">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>
              <button
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition text-base"
                onClick={() => handleAddToCart(product)}
              >
                <FaShoppingCart className="text-lg" />
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Offers
