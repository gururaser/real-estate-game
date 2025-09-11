from superlinked import framework as sl
from superlinked_app.config import settings
from superlinked.framework.common.nlq import open_ai as sl_openai

# Some OpenAI models (e.g., certain nano variants) reject non-default temperature values.
# Superlinked sets temperature to 0.0 by default; set it to 1.0 to avoid 400 errors.
sl_openai.TEMPERATURE_VALUE = 0.1  # Low temperature for more consistent NLQ results

openai_config = sl.OpenAIClientConfig(
    api_key=settings.openai_api_key.get_secret_value(),
    model=settings.openai_model,
    base_url=settings.openai_base_url,
)


# ---- FIELD DESCRIPTIONS ----
id_description = (
    "Unique identifier for the real estate property. Extract the property ID if explicitly mentioned in the query "
    "(e.g., 'property with ID abc123' -> 'abc123'). Use None if not specified."
)

description_description = (
    "Description of the property. Extract key features, amenities, or property details mentioned. "
    "Focus on what makes the property special, not just basic facts. "
    "Examples: 'property with pool and garden' -> 'pool garden amenities', "
    "'modern kitchen with granite countertops' -> 'modern kitchen granite countertops'. Use None if not specified."
)

city_description = (
    "City where the property is located. Extract the exact city name if mentioned. "
    "Examples: 'properties in los angeles' -> 'los angeles', "
    "'homes in san francisco' -> 'san francisco'. Use None if not specified."
)

state_description = (
    "State where the property is located. Extract the exact state name or abbreviation if mentioned. "
    "Examples: 'california properties' -> 'california', 'ca homes' -> 'ca'. "
    "Use None if not specified."
)

county_description = (
    "County where the property is located. Extract the exact county name if mentioned. "
    "Examples: 'los angeles county properties' -> 'los angeles', "
    "'orange county homes' -> 'orange'. Use None if not specified."
)

price_description = (
    "Price of the property. Extract numeric values and convert to integers. "
    "Handle various formats: '1 million dollars' -> 1000000, '500k' -> 500000, "
    "'over 100000' -> 100000. Use None if not specified."
)

price_per_sqft_description = (
    "Price per square foot of the property. Extract numeric values and convert to floats. "
    "Examples: '200 per square foot' -> 200.0, '$150/sqft' -> 150.0. "
    "Use None if not specified."
)

living_area_description = (
    "Living area of the property in square feet. Extract numeric values and convert to integers. "
    "Examples: '2000 square feet' -> 2000, '1500 sqft' -> 1500. "
    "Use None if not specified."
)

home_type_description = (
    "Type of the property from the predefined list. Must be exactly one of: lot, single_family, condo, multi_family, townhouse, apartment. "
    "Map user terms to these categories: 'house' -> 'single_family', 'apartment' -> 'apartment', "
    "'condominium' -> 'condo', 'townhome' -> 'townhouse', 'land' -> 'lot'. "
    "Do not use any other values. Use None if not specified or not matching."
)

event_description = (
    "Current event/status of the property from the predefined list. Must be exactly one of: listed for sale, price change, listing removed, sold, listed for rent, pending sale. "
    "Map user terms to these categories: 'for sale' -> 'listed for sale', 'sold' -> 'sold', "
    "'pending' -> 'pending sale', 'rent' -> 'listed for rent'. "
    "Do not use any other values. Use None if not specified or not matching."
)

system_prompt = (
    "You are an expert at extracting search parameters from natural language queries for real estate properties.\n"
    "\n"
    "DATASET CONTEXT:\n"
    "This dataset contains real estate properties from california and georgia with various property types:\n"
    "- lot: Vacant land or lots\n"
    "- single_family: Single family homes\n"
    "- condo: Condominiums\n"
    "- multi_family: Multi-family properties\n"
    "- townhouse: Townhouses\n"
    "- apartment: Apartments\n"
    "\n"
    "Property statuses include:\n"
    "- listed for sale: Properties currently for sale\n"
    "- price change: Properties with recent price changes\n"
    "- listing removed: Properties with removed listings\n"
    "- sold: Properties that have been sold\n"
    "- listed for rent: Properties for rent\n"
    "- pending sale: Properties under contract\n"
    "\n"
    "EXTRACTION RULES:\n"
    "1. Extract parameters based on the field descriptions provided.\n"
    "2. Use exact property types: lot, single_family, condo, multi_family, townhouse, apartment only.\n"
    "3. Use exact event types: listed for sale, price change, listing removed, sold, listed for rent, pending sale only.\n"
    "4. Convert all numeric values to appropriate formats (prices to integers, areas to integers).\n"
    "5. Set fields to None if not mentioned or cannot be determined.\n"
    "6. Focus on semantic meaning, not just keywords.\n"
    "\n"
    "OUTPUT FORMAT:\n"
    "Return ONLY a valid JSON object with ALL the following fields:\n"
    "{\n"
    "  \"id\": null,\n"
    "  \"description\": null,\n"
    "  \"city\": null,\n"
    "  \"state\": null,\n"
    "  \"county\": null,\n"
    "  \"price\": null,\n"
    "  \"price_per_sqft\": null,\n"
    "  \"living_area\": null,\n"
    "  \"home_type\": null,\n"
    "  \"event\": null\n"
    "}\n"
    "\n"
    "EXAMPLES:\n"
    "Query: 'single family homes in los angeles under 1 million dollars'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": \"los angeles\", \"state\": null, \"county\": null, \"price\": 1000000, \"price_per_sqft\": null, \"living_area\": null, \"home_type\": \"single_family\", \"event\": null}\n"
    "\n"
    "Query: 'condos in san francisco with pool'\n"
    "Output: {\"id\": null, \"description\": \"pool\", \"city\": \"san francisco\", \"state\": null, \"county\": null, \"price\": null, \"price_per_sqft\": null, \"living_area\": null, \"home_type\": \"condo\", \"event\": null}\n"
    "\n"
    "Query: 'lots in california for under 500k'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": null, \"state\": \"california\", \"county\": null, \"price\": 500000, \"price_per_sqft\": null, \"living_area\": null, \"home_type\": \"lot\", \"event\": null}\n"
)
