from superlinked import framework as sl
from superlinked_app.config import settings
from superlinked.framework.common.nlq import open_ai as sl_openai
import json

# Load column statistics
with open('data/column_statistics.json', 'r') as f:
    column_stats = json.load(f)

# Extract unique values
available_cities = column_stats['city']['unique_values'][:10]  # First 10 cities as examples
available_counties = column_stats['county']['unique_values'][:10]  # First 10 counties
available_states = column_stats['state']['unique_values']
available_home_types = column_stats['homeType']['unique_values']
available_events = column_stats['event']['unique_values']
available_levels = column_stats['levels']['unique_values']

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
    f"City where the property is located. Extract the exact city name if mentioned. "
    f"Available cities include: {', '.join(available_cities)}, but extract any mentioned city name from the dataset. "
    f"Examples: 'properties in {available_cities[0]}' -> '{available_cities[0]}', "
    f"'homes in {available_cities[1]}' -> '{available_cities[1]}'. Use None if not specified."
)

state_description = (
    f"State where the property is located. Only {', '.join(available_states)} are supported, but extract the state abbreviation if mentioned. "
    f"Examples: 'california properties' -> 'ca', 'georgia homes' -> 'ga'. "
    "Use None if not specified."
)

county_description = (
    f"County where the property is located. Extract the exact county name if mentioned. "
    f"Available counties include: {', '.join(available_counties)}, but extract any mentioned county name from the dataset. "
    f"Examples: '{available_counties[0]} county properties' -> '{available_counties[0]}', "
    f"'{available_counties[1]} county homes' -> '{available_counties[1]}'. Use None if not specified."
)

price_description = (
    "Price of the property. Extract numeric values and convert to integers. "
    "Handle various formats: '1 million dollars' -> 1000000, '500k' -> 500000, "
    "'over 100000' -> 100000. Use None if not specified."
)

price_per_sqft_description = (
    "Price per square foot of the property. Extract numeric values and convert to floats. "
    "If mentioned per square meter, convert to per square foot (1 sqft ≈ 0.0929 m²). "
    "Examples: '200 per square foot' -> 200.0, '$150/sqft' -> 150.0, '1000 per square meter' -> 1076.4. "
    "Use None if not specified."
)

living_area_description = (
    "Living area of the property in square feet. Extract numeric values and convert to integers. "
    "If mentioned in square meters, convert to square feet (1 m² ≈ 10.764 sqft). "
    "Examples: '2000 square feet' -> 2000, '1500 sqft' -> 1500, '100 square meters' -> 1076. "
    "Use None if not specified."
)

home_type_description = (
    f"Type of the property from the predefined list. Must be exactly one of: {', '.join(available_home_types)}. "
    "Map user terms to these categories: 'house' -> 'single_family', 'apartment' -> 'apartment', "
    "'condominium' -> 'condo', 'townhome' -> 'townhouse', 'land' -> 'lot'. "
    "Do not use any other values. Use None if not specified or not matching."
)

event_description = (
    f"Current event/status of the property from the predefined list. Must be exactly one of: {', '.join(available_events)}. "
    "Map user terms to these categories: 'for sale' -> 'listed for sale', 'sold' -> 'sold', "
    "'pending' -> 'pending sale', 'rent' -> 'listed for rent'. "
    "Do not use any other values. Use None if not specified or not matching."
)

levels_description = (
    f"Number of levels/floors in the property from the predefined list. Must be exactly one of: {', '.join(available_levels)}. "
    "Map user terms to these categories: 'single level' -> '1', 'two story' -> '2', 'multi-level' -> 'multi', "
    "'split level' -> '1.5'. Do not use any other values. Use None if not specified or not matching."
)

system_prompt = (
    "You are an expert at extracting search parameters from natural language queries for real estate properties.\n"
    "\n"
    "DATASET CONTEXT:\n"
    f"This dataset contains real estate properties from {', '.join([s.upper() for s in available_states])} with various property types:\n"
    + "\n".join([f"- {ht}: {ht.replace('_', ' ').title()}" for ht in available_home_types]) +
    "\n\n"
    "Property statuses include:\n"
    + "\n".join([f"- {ev}: {ev.replace('_', ' ').title()}" for ev in available_events]) +
    "\n\n"
    "EXTRACTION RULES:\n"
    "1. Extract parameters based on the field descriptions provided.\n"
    f"2. Use exact property types: {', '.join(available_home_types)} only.\n"
    f"3. Use exact event types: {', '.join(available_events)} only.\n"
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
    "  \"event\": null,\n"
    "  \"levels\": null\n"
    "}\n"
    "\n"
    "EXAMPLES:\n"
    f"Query: 'single family homes in {available_cities[0]} under 1 million dollars'\n"
    f"Output: {{\"id\": null, \"description\": null, \"city\": \"{available_cities[0]}\", \"state\": null, \"county\": null, \"price\": 1000000, \"price_per_sqft\": null, \"living_area\": null, \"home_type\": \"single_family\", \"event\": null, \"levels\": null}}\n"
    "\n"
    f"Query: 'condos in {available_cities[1]} with pool'\n"
    f"Output: {{\"id\": null, \"description\": \"pool\", \"city\": \"{available_cities[1]}\", \"state\": null, \"county\": null, \"price\": null, \"price_per_sqft\": null, \"living_area\": null, \"home_type\": \"condo\", \"event\": null, \"levels\": null}}\n"
    "\n"
    f"Query: 'lots in {available_states[0].upper()} for under 500k'\n"
    f"Output: {{\"id\": null, \"description\": null, \"city\": null, \"state\": \"{available_states[0]}\", \"county\": null, \"price\": 500000, \"price_per_sqft\": null, \"living_area\": null, \"home_type\": \"lot\", \"event\": null, \"levels\": null}}\n"
    "\n"
    f"Query: 'apartments in {available_cities[2]}'\n"
    f"Output: {{\"id\": null, \"description\": null, \"city\": \"{available_cities[2]}\", \"state\": \"{available_states[1]}\", \"county\": null, \"price\": null, \"price_per_sqft\": null, \"living_area\": null, \"home_type\": \"apartment\", \"event\": null, \"levels\": null}}\n"
)
