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
# # Superlinked sets temperature to 0.0 by default; set it to 1.0 to avoid 400 errors.
# sl_openai.TEMPERATURE_VALUE = 0.1  # Low temperature for more consistent NLQ results

openai_config = sl.OpenAIClientConfig(
    api_key=settings.openai_api_key.get_secret_value(),
    model=settings.openai_model,
    base_url=settings.openai_base_url,
)


# ---- FIELD DESCRIPTIONS ----

id_description = (
    "Unique property identifier, ONLY if explicitly present (e.g., 'ID abc123', 'MLS# 59021'). "
    "Do NOT infer. If absent, use null."
)

description_description = (
    "Short, keyword-like highlights of explicit features/amenities (e.g., 'pool', 'cathedral ceilings', "
    "'ocean view', 'guest house'). No city/state/type/price here. If nothing meaningful, use null."
)

city_description = (
    f"List of exact cities explicitly mentioned, order as in query. "
    f"Examples include: {', '.join(available_cities)}. "
    "If none or ambiguous, use an empty list []. Do NOT infer from neighborhoods."
)

state_description = (
    f"List of two-letter lowercase state codes explicitly mentioned (allowed: {', '.join(available_states)}). "
    "Map names to codes (e.g., 'California'->'ca'). If none, use []."
)

county_description = (
    f"List of exact counties explicitly mentioned (e.g., {', '.join(available_counties)}). "
    "Do NOT infer from city/state. If none, use []."
)

price_description = (
    "Numeric price constraint in USD. For exact amounts (e.g., '500k'), set min_price and max_price to same value. "
    "For 'under/below X', set only max_price=X. For 'over/above X', set only min_price=X. "
    "For ranges 'X-Y', set min_price=X, max_price=Y. For 'around X', use 10% tolerance. "
    "Normalize magnitudes: '1M'->1000000, '800k'->800000."
)

price_per_sqft_description = (
    "USD per square foot (float). Convert m² to sqft by dividing by 10.7639, round to 2 decimals. "
    "Accept forms like '$200/sqft', '200 per square foot', '€1200/m²'. If absent/unclear, use null."
)

living_area_description = (
    "Living area in square feet (integer). Convert m² to sqft: 1 m² = 10.7639 sqft, round to nearest int. "
    "Accept 'square meters', 'sqm', 'm²', 'square feet', 'sqft', 'sq ft'. If absent/unclear, use null."
)

home_type_description = (
    f"List of property types from EXACT enums: {', '.join(available_home_types)}. "
    "Synonyms: house/single family -> single_family; condominium/condo -> condo; "
    "townhome/townhouse -> townhouse; land/lot -> lot; duplex/triplex/quadplex -> multi_family; "
    "apartment stays apartment. Use [] if none."
)

event_description = (
    f"List of property status enums (EXACT): {', '.join(available_events)}. "
    "Normalize: for sale/listed -> listed for sale; sold/closed -> sold; pending/under contract -> pending sale; "
    "for rent/rent/lease -> listed for rent. Use [] if none."
)

levels_description = (
    f"List of level/floor enums (EXACT): {', '.join(available_levels)}. "
    "Normalize: single level/single story/one story -> '1'; two story/2-story -> '2'; three story/3-story -> '3'; "
    "tri-level -> 'tri-level'; split level -> 'split level'; multi-level/multi/split -> 'multi/split'. "
    "If both a number and a style appear (e.g., 'tri-level two'), prefer the CLEAR enum that exists in the list; "
    "if unclear, include only the allowed style. Use [] if none."
)

system_prompt = (
    "You extract canonical search parameters for real-estate queries.\n"
    "Return ONLY a valid JSON object with ALL keys shown below. No markdown, no comments, no extra keys.\n\n"

    "DATASET CONTEXT:\n"
    f"- States: {', '.join([s.upper() for s in available_states])}\n"
    "- Home types (exact enums): " + ", ".join(available_home_types) + "\n"
    "- Events/status (exact enums): " + ", ".join(available_events) + "\n"
    "- Levels (exact enums): " + ", ".join(available_levels) + "\n\n"

    "NORMALIZATION RULES:\n"
    "• Numbers: parse magnitudes (k, M). 'under/below X' => X; 'over/above X' => X; ranges 'A–B' => use upper bound B.\n"
    "• Approximate values: 'around X', 'approximately X', 'about X', 'roughly X', 'circa X' => create a 10% tolerance range (min = X * 0.9, max = X * 1.1, rounded appropriately).\n"
    "• Ranges: 'between X and Y', 'from X to Y', 'X-Y' => set min=X, max=Y.\n"
    "• Areas: 1 m² = 10.7639 sqft; round living_area to nearest integer. Accept 'square meters', 'sqm', 'm²', 'square feet', 'sqft', 'sq ft'.\n"
    "• Price-per-sqft: per m² -> per sqft by dividing by 10.7639; round to 2 decimals.\n"
    "• States: two-letter lowercase codes.\n"
    "• Enums: MUST be from the allowed sets (home_type, event, levels). If no match, leave the list empty [].\n"
    "• Ambiguity: If multiple cities/counties/states are mentioned, include them all in order of appearance (deduplicate). "
    "If none are explicit, use []. Do NOT infer city from county or vice versa.\n"
    "• 'id' ONLY if an explicit ID/MLS is present. Otherwise null.\n"
    "• 'description' is terse keywords for notable amenities/features only.\n"
    "• Bedrooms/Bathrooms: If exact number (e.g., '2 bedrooms'), set min and max to same value. If 'at least 2', set only min_bedrooms=2, max_bedrooms=null. If 'up to 3', set only max_bedrooms=3, min_bedrooms=null. If 'around 2' or 'approximately 2', set min_bedrooms=2, max_bedrooms=2 (no tolerance for discrete values).\n"
    "• Price: If exact amount (e.g., '500k'), set min_price and max_price to same value. If 'under/below 500k', set only max_price=500000. If 'over/above 500k', set only min_price=500000. If range '400k-600k', set min_price=400000, max_price=600000. If 'around 500k' or 'approximately 500k', set min_price=450000, max_price=550000 (10% tolerance).\n"
    "• Living Area: If exact size (e.g., '2000 sqft'), set min_living_area and max_living_area to same value. If 'at least 2000 sqft', set only min_living_area=2000. If 'up to 3000 sqft', set only max_living_area=3000. If 'around 2000 sqft' or 'approximately 2000 sqft', set min_living_area=1800, max_living_area=2200 (10% tolerance).\n\n"

    "OUTPUT FORMAT (ALWAYS include all keys):\n"
    "{\n"
    "  \"id\": null,\n"
    "  \"description\": null,\n"
    "  \"city\": [],\n"
    "  \"state\": [],\n"
    "  \"county\": [],\n"
    "  \"min_price\": null,\n"
    "  \"max_price\": null,\n"
    "  \"price_per_sqft\": null,\n"
    "  \"min_living_area\": null,\n"
    "  \"max_living_area\": null,\n"
    "  \"min_bedrooms\": null,\n"
    "  \"max_bedrooms\": null,\n"
    "  \"min_bathrooms\": null,\n"
    "  \"max_bathrooms\": null,\n"
    "  \"home_type\": [],\n"
    "  \"event\": [],\n"
    "  \"levels\": []\n"
    "}\n\n"

    "EXAMPLES:\n"
    "Query: '3 bedroom houses in " + available_cities[0] + " between 500k and 800k with pool'\n"
    "Output: {\"id\": null, \"description\": \"pool\", \"city\": [\"" + available_cities[0] + "\"], \"state\": [], "
    "\"county\": [], \"min_price\": 500000, \"max_price\": 800000, \"price_per_sqft\": null, \"min_living_area\": null, \"max_living_area\": null, "
    "\"min_bedrooms\": 3, \"max_bedrooms\": 3, \"min_bathrooms\": null, \"max_bathrooms\": null, "
    "\"home_type\": [\"single_family\"], \"event\": [], \"levels\": []}\n\n"

    "Query: 'apartments around 100 square meters in " + available_cities[1] + " under $1500/m², at least 2 bedrooms'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [\"" + available_cities[1] + "\"], \"state\": [], \"county\": [], "
    "\"min_price\": null, \"max_price\": null, \"price_per_sqft\": 138.6, \"min_living_area\": 968, \"max_living_area\": 1184, "
    "\"min_bedrooms\": 2, \"max_bedrooms\": null, \"min_bathrooms\": null, \"max_bathrooms\": null, "
    "\"home_type\": [\"apartment\"], \"event\": [], \"levels\": []}\n\n"

    "Query: 'luxury condos in " + available_states[0] + " over 2000 sqft, multi-level preferred'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [], \"state\": [\"" + available_states[0] + "\"], \"county\": [], "
    "\"min_price\": null, \"max_price\": null, \"price_per_sqft\": null, \"min_living_area\": 2000, \"max_living_area\": null, "
    "\"min_bedrooms\": null, \"max_bedrooms\": null, \"min_bathrooms\": null, \"max_bathrooms\": null, "
    "\"home_type\": [\"condo\"], \"event\": [], \"levels\": [\"multi/split\"]}\n\n"

    "Query: '2-3 bedroom townhouses around 1500 sqft in Orange County CA between 600k-900k'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [], \"state\": [\"ca\"], \"county\": [\"Orange County\"], "
    "\"min_price\": 600000, \"max_price\": 900000, \"price_per_sqft\": null, \"min_living_area\": 1350, \"max_living_area\": 1650, "
    "\"min_bedrooms\": 2, \"max_bedrooms\": 3, \"min_bathrooms\": null, \"max_bathrooms\": null, "
    "\"home_type\": [\"townhouse\"], \"event\": [], \"levels\": []}\n\n"

    "Query: 'single family homes under 1M in " + available_cities[2] + " or " + available_cities[3] + ", at most 2 bathrooms'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [\"" + available_cities[2] + "\", \"" + available_cities[3] + "\"], \"state\": [], "
    "\"county\": [], \"min_price\": null, \"max_price\": 1000000, \"price_per_sqft\": null, \"min_living_area\": null, \"max_living_area\": null, "
    "\"min_bedrooms\": null, \"max_bedrooms\": null, \"min_bathrooms\": null, \"max_bathrooms\": 2, "
    "\"home_type\": [\"single_family\"], \"event\": [], \"levels\": []}\n\n"

    "NEGATIVE/AMBIGUITY:\n"
    "• If only neighborhoods are mentioned (no clear city), keep city=[].\n"
    "• If user says 'cheap but no number', set min_price and max_price to null.\n"
    "• Deduplicate lists; keep order of first mention.\n"
)

