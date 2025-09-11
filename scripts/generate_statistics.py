import pandas as pd
import json
import os

# Read the CSV file
csv_file = 'data/processed_real_estate.csv'
df = pd.read_csv(csv_file)

# Dict to store statistics
stats = {}

# Min and max for numeric columns
numeric_cols = df.select_dtypes(include=['int64', 'float64', 'Int64']).columns
for col in numeric_cols:
    stats[col] = {
        'type': 'numeric',
        'min': int(df[col].min()),
        'max': int(df[col].max())
    }

# Unique values for categorical columns
categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    if col in ['id', 'datePostedString', 'streetAddress', 'description']:
        # Skip saving unique values for 'id', 'datePostedString', 'streetAddress', and 'description' columns to avoid large JSON
        stats[col] = {
            'type': 'categorical',
            'unique_values': []
        }
    else:
        unique_values = df[col].dropna().unique().tolist()
        stats[col] = {
            'type': 'categorical',
            'unique_values': unique_values
        }

# Save to JSON file
output_file = 'data/column_statistics.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(stats, f, indent=4, ensure_ascii=False)

print(f"Statistics saved to {output_file}.")
