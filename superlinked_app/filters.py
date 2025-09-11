from collections import namedtuple

from superlinked import framework as sl

from superlinked_app.index import real_estate_schema

# Hard filters for fields without spaces
PropertyFilter = namedtuple(
    "PropertyFilter", ["operator", "param_name", "field_name", "description"]
)

# Hard filters for fields without spaces
filters = [
    # ID filters
    PropertyFilter(
        operator=real_estate_schema.id.in_,
        param_name="ids_include",
        field_name="id",
        description="Property IDs to include.",
    ),
    PropertyFilter(
        operator=real_estate_schema.id.not_in_,
        param_name="ids_exclude",
        field_name="id",
        description="Property IDs to exclude.",
    ),
    # State filters
    PropertyFilter(
        operator=real_estate_schema.state.__eq__,
        param_name="state_filter",
        field_name="state",
        description="Filter by state (e.g., 'ca', 'ga').",
    ),
    # City filters
    PropertyFilter(
        operator=real_estate_schema.city.__eq__,
        param_name="city_filter",
        field_name="city",
        description="Filter by city name.",
    ),
    # County filters
    PropertyFilter(
        operator=real_estate_schema.county.__eq__,
        param_name="county_filter",
        field_name="county",
        description="Filter by county name.",
    ),
    # Home type filters
    PropertyFilter(
        operator=real_estate_schema.homeType.__eq__,
        param_name="home_type_filter",
        field_name="homeType",
        description="Filter by home type (single_family, condo, townhouse, etc.).",
    ),
    # Event filters
    PropertyFilter(
        operator=real_estate_schema.event.__eq__,
        param_name="event_filter",
        field_name="event",
        description="Filter by event type (listed for sale, sold, etc.).",
    ),
    # Integer filters (0/1 values)
    PropertyFilter(
        operator=real_estate_schema.is_bankOwned.__eq__,
        param_name="is_bank_owned_filter",
        field_name="is_bankOwned",
        description="Filter by bank owned status (0/1).",
    ),
    PropertyFilter(
        operator=real_estate_schema.is_forAuction.__eq__,
        param_name="is_for_auction_filter",
        field_name="is_forAuction",
        description="Filter by auction status (0/1).",
    ),
    PropertyFilter(
        operator=real_estate_schema.parking.__eq__,
        param_name="parking_filter",
        field_name="parking",
        description="Filter by parking availability (0/1).",
    ),
    PropertyFilter(
        operator=real_estate_schema.hasGarage.__eq__,
        param_name="has_garage_filter",
        field_name="hasGarage",
        description="Filter by garage availability (0/1).",
    ),
    PropertyFilter(
        operator=real_estate_schema.pool.__eq__,
        param_name="pool_filter",
        field_name="pool",
        description="Filter by pool availability (0/1).",
    ),
    PropertyFilter(
        operator=real_estate_schema.spa.__eq__,
        param_name="spa_filter",
        field_name="spa",
        description="Filter by spa availability (0/1).",
    ),
    PropertyFilter(
        operator=real_estate_schema.isNewConstruction.__eq__,
        param_name="is_new_construction_filter",
        field_name="isNewConstruction",
        description="Filter by new construction status (0/1).",
    ),
    PropertyFilter(
        operator=real_estate_schema.hasPetsAllowed.__eq__,
        param_name="has_pets_allowed_filter",
        field_name="hasPetsAllowed",
        description="Filter by pet policy (0/1).",
    ),
    # Numeric range filters
    PropertyFilter(
        operator=real_estate_schema.price.__le__,
        param_name="max_price",
        field_name="price",
        description="Maximum price filter.",
    ),
    PropertyFilter(
        operator=real_estate_schema.price.__ge__,
        param_name="min_price",
        field_name="price",
        description="Minimum price filter.",
    ),
    PropertyFilter(
        operator=real_estate_schema.bedrooms.__le__,
        param_name="max_bedrooms",
        field_name="bedrooms",
        description="Maximum bedrooms filter.",
    ),
    PropertyFilter(
        operator=real_estate_schema.bedrooms.__ge__,
        param_name="min_bedrooms",
        field_name="bedrooms",
        description="Minimum bedrooms filter.",
    ),
    PropertyFilter(
        operator=real_estate_schema.bathrooms.__le__,
        param_name="max_bathrooms",
        field_name="bathrooms",
        description="Maximum bathrooms filter.",
    ),
    PropertyFilter(
        operator=real_estate_schema.bathrooms.__ge__,
        param_name="min_bathrooms",
        field_name="bathrooms",
        description="Minimum bathrooms filter.",
    ),
    PropertyFilter(
        operator=real_estate_schema.livingArea.__le__,
        param_name="max_living_area",
        field_name="livingArea",
        description="Maximum living area filter.",
    ),
    PropertyFilter(
        operator=real_estate_schema.livingArea.__ge__,
        param_name="min_living_area",
        field_name="livingArea",
        description="Minimum living area filter.",
    ),
]


def apply_filters(query):
    """Applies hard filters for fields without spaces."""
    for filter_item in filters:
        param = sl.Param(
            filter_item.param_name,
            description=filter_item.description,
        )
        query = query.filter(filter_item.operator(param))

    return query
