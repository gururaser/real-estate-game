import os

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_ENV_FILENAME = ".env"


class Settings(BaseSettings):
    """Configuration settings for the Superlinked application."""

    # Embedding settings
    text_embedder_name: str = "ibm-granite/granite-embedding-small-english-r2"
    chunk_size: int = 512

    # Path to the dataset
    path_dataset: str = "data/processed_real_estate.csv"
    path_schema: str = "data/column_statistics.json"

    # OpenAI for Natural Language Query
    openai_model: str = "mistral-medium"
    openai_api_key: SecretStr = SecretStr("")
    openai_base_url: str = "https://api.mistral.ai/v1/"
    
    # Qdrant vector database
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str = ""
    
    model_config = SettingsConfigDict(
        env_file=DEFAULT_ENV_FILENAME, env_file_encoding="utf-8"
    )


def get_env_file_path() -> str:
    dirname = os.path.dirname(__file__)
    rel_path = os.path.join(dirname, DEFAULT_ENV_FILENAME)
    abs_path = os.path.abspath(rel_path)
    return abs_path


settings = Settings()
