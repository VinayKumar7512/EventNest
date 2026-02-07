import { useState, useEffect } from "react";
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          const cityName = data.city || data.locality || data.principalSubdivision || "Unknown";

          setLocation({
            latitude,
            longitude,
            city: cityName,
            country: data.countryName || "Unknown"
          });
        } catch (err) {
          // Handle fetch or json parsing error
          console.error("Error fetching or parsing geocoding data:", err);
          setLocation({
            latitude,
            longitude,
            city: "Unknown",
            country: "Unknown"
          });
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  return { location, error, loading };
};