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


# ---- FIELD DESCRIPTIONS (MULTI + WEIGHT) ----

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
    "Numeric price CEILING in USD as integer when a numeric constraint is present. "
    "Normalize magnitudes: '1M'->1000000, 'under 800k'->800000, 'below $1.2M'->1200000. "
    "If a RANGE appears (e.g., '700k-900k'), use the UPPER bound (900000). "
    "If ONLY qualitative language (e.g., 'cheap', 'affordable') is used and NO number exists, set price to null."
)

price_weight_description = (
    "Price preference WEIGHT derived from adjectives/nouns about cost. "
    "Higher => user seeks more expensive; lower => cheaper. "
    "Use a discrete scale: -2 (very cheap) | -1 (cheap) | 0 (no preference) | 1 (expensive) | 2 (very expensive). "
    "Map examples: "
    "very cheap/cheapest/lowest price -> -2; cheap/affordable/low price/not expensive -> -1; "
    "no mention -> 0; "
    "expensive/high price/luxurious/not cheap -> 1; very expensive/most expensive/highest price -> 2."
)

price_per_sqft_description = (
    "USD per square foot (float). If given per m², convert: value_per_sqft = value_per_m2 / 10.7639, round to 2 decimals. "
    "Accept forms like '$200/sqft', '200 per square foot', '€1200/m²' (ignore currency sign, keep numeric). "
    "If absent/unclear, use null."
)

living_area_description = (
    "Living area in square feet (integer). Convert if metric given (1 m² = 10.7639 sqft; round to nearest int). "
    "If absent/unclear, use null."
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
    "• Areas: 1 m² = 10.7639 sqft; round living_area to nearest integer.\n"
    "• Price-per-sqft: per m² -> per sqft by dividing by 10.7639; round to 2 decimals.\n"
    "• States: two-letter lowercase codes.\n"
    "• Enums: MUST be from the allowed sets (home_type, event, levels). If no match, leave the list empty [].\n"
    "• Ambiguity: If multiple cities/counties/states are mentioned, include them all in order of appearance (deduplicate). "
    "If none are explicit, use []. Do NOT infer city from county or vice versa.\n"
    "• 'id' ONLY if an explicit ID/MLS is present. Otherwise null.\n"
    "• 'description' is terse keywords for notable amenities/features only.\n"
    "• Price preference uses TWO signals:\n"
    "  - 'price': numeric ceiling if any numeric constraint exists; otherwise null.\n"
    "  - 'price_weight': a discrete preference from -2..+2 derived from adjectives (see mapping below).\n\n"

    "PRICE WEIGHT MAPPING:\n"
    "very cheap/cheapest/lowest price -> -2; cheap/affordable/low price/not expensive -> -1; "
    "no relevant price words -> 0; "
    "expensive/high price/luxurious/not cheap -> 1; very expensive/most expensive/highest price -> 2.\n\n"

    "OUTPUT FORMAT (ALWAYS include all keys):\n"
    "{\n"
    "  \"id\": null,\n"
    "  \"description\": null,\n"
    "  \"city\": [],\n"
    "  \"state\": [],\n"
    "  \"county\": [],\n"
    "  \"price\": null,\n"
    "  \"price_weight\": 0,\n"
    "  \"price_per_sqft\": null,\n"
    "  \"living_area\": null,\n"
    "  \"home_type\": [],\n"
    "  \"event\": [],\n"
    "  \"levels\": []\n"
    "}\n\n"

    "EXAMPLES:\n"
    "Query: 'single family homes in " + available_cities[0] + " or " + available_cities[1] + " under 1 million dollars'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [\"" + available_cities[0] + "\", \"" + available_cities[1] + "\"], \"state\": [], "
    "\"county\": [], \"price\": 1000000, \"price_weight\": 0, \"price_per_sqft\": null, \"living_area\": null, "
    "\"home_type\": [\"single_family\"], \"event\": [], \"levels\": []}\n\n"

    "Query: 'affordable condos with pool in " + available_cities[2] + " and " + available_cities[3] + "'\n"
    "Output: {\"id\": null, \"description\": \"pool\", \"city\": [\"" + available_cities[2] + "\", \"" + available_cities[3] + "\"] , \"state\": [], "
    "\"county\": [], \"price\": null, \"price_weight\": -1, \"price_per_sqft\": null, \"living_area\": null, "
    "\"home_type\": [\"condo\"], \"event\": [], \"levels\": []}\n\n"

    "Query: 'lots in " + available_states[0] + " below 500k, multi/split or tri-level ok'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [], \"state\": [\"" + available_states[0] + "\"] , \"county\": [], "
    "\"price\": 500000, \"price_weight\": 0, \"price_per_sqft\": null, \"living_area\": null, "
    "\"home_type\": [\"lot\"], \"event\": [], \"levels\": [\"multi/split\", \"tri-level\"]}\n\n"

    "Query: 'apartments in " + available_cities[4] + " 100 m², around $1000/m², pending sales'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [\"" + available_cities[4] + "\"] , \"state\": [], \"county\": [], "
    "\"price\": null, \"price_weight\": 0, \"price_per_sqft\": 92.9, \"living_area\": 1076, "
    "\"home_type\": [\"apartment\"], \"event\": [\"pending sale\"], \"levels\": []}\n\n"

    "HARD EXAMPLE:\n"
    "Query: 'tri-level townhouse in Orange County CA around 700k-900k, not cheap'\n"
    "Output: {\"id\": null, \"description\": null, \"city\": [], \"state\": [\"ca\"], \"county\": [\"Orange County\"], "
    "\"price\": 900000, \"price_weight\": 1, \"price_per_sqft\": null, \"living_area\": null, "
    "\"home_type\": [\"townhouse\"], \"event\": [], \"levels\": [\"tri-level\"]}\n\n"

    "NEGATIVE/AMBIGUITY:\n"
    "• If only neighborhoods are mentioned (no clear city), keep city=[].\n"
    "• If user says 'cheap but no number', price=null and rely on price_weight.\n"
    "• Deduplicate lists; keep order of first mention.\n"
)

