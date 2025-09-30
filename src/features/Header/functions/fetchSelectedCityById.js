import { getLocationById } from "../../../redux/services/locations.api";

export const fetchSelectedCityById = async ({ selectedLanguage, selectedCity, setSelectedCityName }) => {
  try {
    // Ensure selectedLanguage and selectedCity are available
    if (selectedLanguage && selectedCity) {
      const payload = {
        LanguageId: selectedLanguage,
        LocationId: selectedCity,
      };

      // Fetch city data
      const response = await getLocationById(payload);

      if (response?.success) {
        setSelectedCityName(response.data[0].name); // Update city name on successful response
      }
    }
  } catch (error) {
    console.error("Error fetching selected city:", error);
    // Handle errors as needed
  }
}; 