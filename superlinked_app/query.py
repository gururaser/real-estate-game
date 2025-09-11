from superlinked import framework as sl

from superlinked_app.filters import apply_filters
from superlinked_app.index import (
    city_space,
    county_space,
    description_space,
    event_space,
    home_type_space,
    index,
    levels_space,
    living_area_space,
    price_space,
    price_per_sqft_space,
    real_estate_schema,
    street_address_space,
)
from superlinked_app.nlq import (
    city_description,
    county_description,
    description_description,
    event_description,
    home_type_description,
    levels_description,
    living_area_description,
    openai_config,
    price_description,
    price_per_sqft_description,
    system_prompt,
)

# Similar real estate search with natural language numerical/categorical parameters
query = (
    sl.Query(
        index,
        weights={
            description_space: sl.Param("description_weight", default=1.0, description=description_description),  # High priority for description matches
            city_space: sl.Param("city_weight", default=0.8, description=city_description),  # High priority for city matches
            street_address_space: sl.Param("street_address_weight", default=0.6),  # Medium priority for street address
            county_space: sl.Param("county_weight", default=0.6, description=county_description),  # Medium priority for county
            price_space: sl.Param("price_weight", default=0.5, description=price_description),  # Medium priority for price similarity
            price_per_sqft_space: sl.Param("price_per_sqft_weight", default=0.4, description=price_per_sqft_description),  # Medium-low priority for price per sqft
            living_area_space: sl.Param("living_area_weight", default=0.3, description=living_area_description),  # Low priority for living area similarity
            home_type_space: sl.Param("home_type_weight", default=0.7, description=home_type_description),  # Medium-high for home type matching
            event_space: sl.Param("event_weight", default=0.2, description=event_description),  # Low priority for event type
            levels_space: sl.Param("levels_weight", default=0.1, description=levels_description),  # Very low priority for levels
        },
    )
    .find(real_estate_schema)
    .similar(description_space, sl.Param("description", description=description_description))
    .similar(city_space, sl.Param("city", description=city_description))
    .similar(street_address_space, sl.Param("street_address"))
    .similar(county_space, sl.Param("county", description=county_description))
    .similar(home_type_space, sl.Param("home_type", description=home_type_description))
    .similar(event_space, sl.Param("event", description=event_description))
)

query = query.limit(sl.Param("limit", default=10)).select_all().include_metadata()

query = apply_filters(query)

query = query.with_natural_query(
    natural_query=sl.Param("natural_query"),
    client_config=openai_config,
    system_prompt=system_prompt,
)

# Similar query for finding similar points based on a given point's vector
similar_query = (
    sl.Query(
        index,
        weights={
            description_space: sl.Param("description_weight", default=1.0, description=description_description),  # High priority for description matches
            city_space: sl.Param("city_weight", default=0.8, description=city_description),  # High priority for city matches
            street_address_space: sl.Param("street_address_weight", default=0.6),  # Medium priority for street address
            county_space: sl.Param("county_weight", default=0.6, description=county_description),  # Medium priority for county
            price_space: sl.Param("price_weight", default=0.5, description=price_description),  # Medium priority for price similarity
            price_per_sqft_space: sl.Param("price_per_sqft_weight", default=0.4, description=price_per_sqft_description),  # Medium-low priority for price per sqft
            living_area_space: sl.Param("living_area_weight", default=0.3, description=living_area_description),  # Low priority for living area similarity
            home_type_space: sl.Param("home_type_weight", default=0.7, description=home_type_description),  # Medium-high for home type matching
            event_space: sl.Param("event_weight", default=0.2, description=event_description),  # Low priority for event type
            levels_space: sl.Param("levels_weight", default=0.1, description=levels_description),  # Very low priority for levels
        },
    )
    .find(real_estate_schema)
    .with_vector(real_estate_schema, sl.Param("id"))
    .limit(sl.Param("limit", default=10))
    .select_all()
    .include_metadata()
)

similar_query = apply_filters(similar_query)


# query_debug is a simple way to check if server has some data ingested:
debug_query = sl.Query(index).find(real_estate_schema).limit(10).select_all()