from superlinked import framework as sl
import pandas as pd

from superlinked_app.index import index, real_estate_schema
from superlinked_app.query import query, similar_query, debug_query
from superlinked_app.config import settings

# Setup the executor
rest_source = sl.RestSource(real_estate_schema)

vector_database = sl.QdrantVectorDatabase(
    url=settings.qdrant_url, 
    api_key=settings.qdrant_api_key,
    search_algorithm=sl.SearchAlgorithm.HNSW,
    prefer_grpc=True
)

config = sl.DataLoaderConfig(
    path=settings.path_dataset,
    format=sl.DataFormat.CSV,
    name="properties",
    pandas_read_kwargs={
        "chunksize": settings.chunk_size,
    },
)
loader_source = sl.DataLoaderSource(real_estate_schema, config)

executor = sl.RestExecutor(
    sources=[
        rest_source,
        loader_source,
    ],
    indices=[index],
    queries=[
        sl.RestQuery(sl.RestDescriptor("property"), query),
        sl.RestQuery(sl.RestDescriptor("similar_property"), similar_query),
        sl.RestQuery(sl.RestDescriptor("debug"), debug_query)
    ],
    vector_database=vector_database,
)

sl.SuperlinkedRegistry.register(executor)
