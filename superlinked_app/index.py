from superlinked import framework as sl
from typing import Optional
from superlinked_app.config import settings
import json


class RealEstate(sl.Schema):
    # Mandatory unique field
    id: sl.IdField

    # Text fields
    description: Optional[sl.String]
    streetAddress: Optional[sl.String]
    city: Optional[sl.String]
    state: Optional[sl.String]
    county: Optional[sl.String]

    # Numerical fields
    stateId: Optional[sl.Integer]
    countyId: Optional[sl.Integer]
    cityId: Optional[sl.Integer]
    price: Optional[sl.Float]
    pricePerSquareFoot: Optional[sl.Float]
    yearBuilt: Optional[sl.Integer]
    zipcode: Optional[sl.Integer]
    longitude: Optional[sl.Float]
    latitude: Optional[sl.Float]
    livingArea: Optional[sl.Integer]
    bathrooms: Optional[sl.Integer]
    bedrooms: Optional[sl.Integer]
    buildingArea: Optional[sl.Integer]
    garageSpaces: Optional[sl.Integer]
    levels: Optional[sl.String]

    # Categorical fields
    country: Optional[sl.String]
    datePostedString: Optional[sl.String]
    event: Optional[sl.String]
    currency: Optional[sl.String]
    lotAreaUnits: Optional[sl.String]
    homeType: Optional[sl.String]

    # Boolean fields (stored as integers 0/1)
    is_bankOwned: Optional[sl.Integer]
    is_forAuction: Optional[sl.Integer]
    parking: Optional[sl.Integer]
    hasGarage: Optional[sl.Integer]
    pool: Optional[sl.Integer]
    spa: Optional[sl.Integer]
    isNewConstruction: Optional[sl.Integer]
    hasPetsAllowed: Optional[sl.Integer]

    # Timestamp (Unix timestamp as datetime)
    time: Optional[sl.Timestamp]


real_estate_schema = RealEstate()

# Load schema from JSON file
with open(settings.path_schema, 'r') as f:
    schema_data = json.load(f)

# Text similarity spaces
description_space = sl.TextSimilaritySpace(text=real_estate_schema.description, model=settings.text_embedder_name)
city_space = sl.TextSimilaritySpace(text=real_estate_schema.city, model=settings.text_embedder_name)
street_address_space = sl.TextSimilaritySpace(text=real_estate_schema.streetAddress, model=settings.text_embedder_name)
county_space = sl.TextSimilaritySpace(text=real_estate_schema.county, model=settings.text_embedder_name)

# Number spaces
# price is embedded using logarithmic scale because its distribution spans multiple orders of magnitude
price_space = sl.NumberSpace(
    number=real_estate_schema.price,
    min_value=schema_data.get('price', {}).get('min', 0),
    max_value=schema_data.get('price', {}).get('max', 95000000),
    mode=sl.Mode.MAXIMUM,
    scale=sl.LogarithmicScale(),
)

# price_per_sqft is embedded using logarithmic scale because its distribution spans multiple orders of magnitude
price_per_sqft_space = sl.NumberSpace(
    number=real_estate_schema.pricePerSquareFoot,
    min_value=schema_data.get('pricePerSquareFoot', {}).get('min', 0),
    max_value=schema_data.get('pricePerSquareFoot', {}).get('max', 2100000),
    mode=sl.Mode.MAXIMUM,
    scale=sl.LogarithmicScale(),
)

# bedrooms and bathrooms are embedded using linear scale (default)
bedrooms_space = sl.NumberSpace(
    number=real_estate_schema.bedrooms,
    min_value=schema_data.get('bedrooms', {}).get('min', 0),
    max_value=schema_data.get('bedrooms', {}).get('max', 99),
    mode=sl.Mode.SIMILAR,
)

bathrooms_space = sl.NumberSpace(
    number=real_estate_schema.bathrooms,
    min_value=schema_data.get('bathrooms', {}).get('min', 0),
    max_value=schema_data.get('bathrooms', {}).get('max', 89),
    mode=sl.Mode.SIMILAR,
)

# living_area is embedded using logarithmic scale because its distribution spans multiple orders of magnitude
living_area_space = sl.NumberSpace(
    number=real_estate_schema.livingArea,
    min_value=schema_data.get('livingArea', {}).get('min', 0),
    max_value=schema_data.get('livingArea', {}).get('max', 9061351),
    mode=sl.Mode.MAXIMUM,
    scale=sl.LogarithmicScale(),
)

# Categorical spaces
home_type_space = sl.CategoricalSimilaritySpace(
    category_input=real_estate_schema.homeType,
    categories=schema_data.get('homeType', {}).get('unique_values', ["lot", "single_family", "condo", "multi_family", "townhouse", "apartment"]),
)

event_space = sl.CategoricalSimilaritySpace(
    category_input=real_estate_schema.event,
    categories=schema_data.get('event', {}).get('unique_values', ["listed for sale", "price change", "listing removed", "sold", "listed for rent", "pending sale"]),
)

levels_space = sl.CategoricalSimilaritySpace(
    category_input=real_estate_schema.levels,
    categories=schema_data.get('levels', {}).get('unique_values', ["0", "1", "2", "3+", "multi", "4", "other", "5+", "1.5", "2+", "2.5"]),
)

# Index
index = sl.Index(
    spaces=[
        description_space,
        city_space,
        street_address_space,
        county_space,
        price_space,
        price_per_sqft_space,
        bedrooms_space,
        bathrooms_space,
        living_area_space,
        home_type_space,
        event_space,
        levels_space,
    ],
    fields=[
        real_estate_schema.id,
        real_estate_schema.description,
        real_estate_schema.streetAddress,
        real_estate_schema.city,
        real_estate_schema.state,
        real_estate_schema.county,
        real_estate_schema.stateId,
        real_estate_schema.countyId,
        real_estate_schema.cityId,
        real_estate_schema.price,
        real_estate_schema.pricePerSquareFoot,
        real_estate_schema.yearBuilt,
        real_estate_schema.zipcode,
        real_estate_schema.longitude,
        real_estate_schema.latitude,
        real_estate_schema.livingArea,
        real_estate_schema.bathrooms,
        real_estate_schema.bedrooms,
        real_estate_schema.buildingArea,
        real_estate_schema.garageSpaces,
        real_estate_schema.levels,
        real_estate_schema.country,
        real_estate_schema.datePostedString,
        real_estate_schema.event,
        real_estate_schema.currency,
        real_estate_schema.lotAreaUnits,
        real_estate_schema.homeType,
        real_estate_schema.is_bankOwned,
        real_estate_schema.is_forAuction,
        real_estate_schema.parking,
        real_estate_schema.hasGarage,
        real_estate_schema.pool,
        real_estate_schema.spa,
        real_estate_schema.isNewConstruction,
        real_estate_schema.hasPetsAllowed,
        real_estate_schema.time,
    ],
)