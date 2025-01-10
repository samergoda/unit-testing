import { useEffect, useState } from "react";

export default function useProducts() {
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(null);
  const [enabled, setEnabled] = useState(false);

  // Functions
  const startFetching = () => {
    setEnabled(true);
    setLoading(true);
    setError(null);
  };

  // Effect
  useEffect(() => {
    (async () => {
      if (!enabled) return;
      try {
        const response = await fetch("http://localhost:7700/v1/products");
        const payload = await response.json();

        // If fetching was not successful, throw the returned error to catch and save it in the error state
        if (!payload.data) throw new Error(payload.message);

        // Otherwise, save the products data in the state
        setProducts(payload);
      } catch (error) {
        // Save the error message in the state whenever an error occurs
        setError(error.message);
      } finally {
        // Stop the loading whenever the fetch ends
        setLoading(false);
        setEnabled(false);
      }
    })();
  }, [enabled]);

  return { loading, error, products, startFetching };
}
