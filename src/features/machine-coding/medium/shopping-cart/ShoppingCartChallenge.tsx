import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 99 },
  { id: 2, name: "Mechanical Keyboard", price: 149 },
  { id: 3, name: "Ergonomic Gaming Mouse", price: 49 },
];

export const ShoppingCartChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: "Wireless Headphones", price: 99, quantity: 1 },
  ]);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Product Catalog */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm">🛍️ Available Catalog</h3>
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.id}
              className={`p-3 rounded border flex justify-between items-center text-xs sm:text-sm ${
                theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
              }`}>
              <div>
                <strong className="block">{p.name}</strong>
                <span className="text-gray-500 font-mono">${p.price}</span>
              </div>
              <button
                onClick={() => addToCart(p)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">
                + Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm flex justify-between items-center">
          <span>🛒 Your Shopping Cart</span>
          <span className="text-xs text-gray-500 font-normal">({cart.length} unique items)</span>
        </h3>

        {cart.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 border border-dashed rounded">
            Your cart is empty.
          </div>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded border flex justify-between items-center text-xs sm:text-sm ${
                  theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                }`}>
                <div>
                  <strong className="block">{item.name}</strong>
                  <span className="text-gray-500 font-mono">
                    ${item.price} × {item.quantity} = ${item.price * item.quantity}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded flex items-center justify-center">
                    -
                  </button>
                  <span className="font-bold font-mono px-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded flex items-center justify-center">
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 rounded border border-emerald-300 flex justify-between items-center font-bold text-sm">
              <span>Total Price:</span>
              <span className="font-mono text-base">${totalPrice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartChallenge;
