import pandas as pd
import os

# Read CSV files
california_df = pd.read_csv('data/RealEstate_California.csv')
georgia_df = pd.read_csv('data/RealEstate_Georgia.csv')

# Merge
combined_df = pd.concat([california_df, georgia_df], ignore_index=True)

# Remove rows where description column is empty
combined_df = combined_df.dropna(subset=['description'])

# Drop 'Unnamed: 0' column if it exists
if 'Unnamed: 0' in combined_df.columns:
    combined_df = combined_df.drop(columns=['Unnamed: 0'])

# Detect and convert float columns without decimal parts to integers (excluding longitude and latitude)
float_cols = combined_df.select_dtypes(include=['float64']).columns
for col in float_cols:
    if col not in ['longitude', 'latitude']:
        has_decimal = combined_df[col].dropna().apply(lambda x: x % 1 != 0).any()
        if not has_decimal:
            combined_df[col] = combined_df[col].astype('Int64')  # Nullable integer

# Additionally, convert livingAreaValue to integer (as requested)
if 'livingAreaValue' in combined_df.columns and combined_df['livingAreaValue'].dtype == 'float64':
    combined_df['livingAreaValue'] = combined_df['livingAreaValue'].fillna(0).round().astype('Int64')

# Normalize text-based columns to lowercase
text_cols = combined_df.select_dtypes(include=['object']).columns
for col in text_cols:
    combined_df[col] = combined_df[col].astype(str).str.lower()

# Save the new CSV file to data folder
combined_df.to_csv('data/processed_real_estate.csv', index=False)

print("Preprocessing completed. New file: data/processed_real_estate.csv")
