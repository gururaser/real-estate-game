import pandas as pd
import os
import numpy as np

# Read CSV files
california_df = pd.read_csv('data/RealEstate_California.csv')
georgia_df = pd.read_csv('data/RealEstate_Georgia.csv')

# Merge
combined_df = pd.concat([california_df, georgia_df], ignore_index=True)

# Remove rows where description column is empty
combined_df = combined_df.dropna(subset=['description'])

# Remove rows with bad geocode (hasBadGeocode = 1)
if 'hasBadGeocode' in combined_df.columns:
    initial_count = len(combined_df)
    combined_df = combined_df[combined_df['hasBadGeocode'] != 1]
    removed_count = initial_count - len(combined_df)
    print(f"Removed {removed_count} rows with bad geocode")
    
    # Drop the hasBadGeocode column entirely
    combined_df = combined_df.drop(columns=['hasBadGeocode'])
    print("Dropped hasBadGeocode column")

# Drop 'Unnamed: 0' column if it exists
if 'Unnamed: 0' in combined_df.columns:
    combined_df = combined_df.drop(columns=['Unnamed: 0'])

# Drop 'livingAreaValue' column if it exists (since it's the same as livingArea)
if 'livingAreaValue' in combined_df.columns:
    combined_df = combined_df.drop(columns=['livingAreaValue'])
    print("Dropped livingAreaValue column as it's redundant with livingArea")

# Detect and convert float columns without decimal parts to integers (excluding longitude and latitude)
float_cols = combined_df.select_dtypes(include=['float64']).columns
for col in float_cols:
    if col not in ['longitude', 'latitude']:
        has_decimal = combined_df[col].dropna().apply(lambda x: x % 1 != 0).any()
        if not has_decimal:
            combined_df[col] = combined_df[col].astype('Int64')  # Nullable integer

# Additionally, convert zipcode to integer (as requested)
if 'zipcode' in combined_df.columns and combined_df['zipcode'].dtype == 'float64':
    combined_df['zipcode'] = combined_df['zipcode'].round().astype('Int64')

# Convert time column from milliseconds to seconds for timestamp
if 'time' in combined_df.columns:
    combined_df['time'] = combined_df['time'] // 1000  # Convert milliseconds to seconds

    # If time is null but datePostedString exists, convert datePostedString to timestamp
    if 'datePostedString' in combined_df.columns:
        # Create mask for null time values
        null_time_mask = combined_df['time'].isnull()

        # Convert datePostedString to datetime, then to timestamp
        combined_df.loc[null_time_mask, 'time'] = pd.to_datetime(
            combined_df.loc[null_time_mask, 'datePostedString'],
            errors='coerce'
        ).astype('int64') // 10**9  # Convert to Unix timestamp (seconds)

    # Fill any remaining null values with January 1, 2021 timestamp
    combined_df['time'] = combined_df['time'].fillna(1609459200).astype(int)

# If datePostedString is null but time exists, convert time to date string
if 'datePostedString' in combined_df.columns and 'time' in combined_df.columns:
    null_date_mask = combined_df['datePostedString'].isnull()
    combined_df.loc[null_date_mask, 'datePostedString'] = pd.to_datetime(
        combined_df.loc[null_date_mask, 'time'], unit='s', errors='coerce'
    ).dt.strftime('%Y-%m-%d')

    # Remove any new null values after filling
    combined_df = combined_df.dropna()

# Normalize text-based columns to lowercase
text_cols = combined_df.select_dtypes(include=['object']).columns
for col in text_cols:
    combined_df[col] = combined_df[col].astype(str).str.lower()
    if col == 'county':
        combined_df[col] = combined_df[col].str.replace(' county', '', regex=False)

# Normalize 'levels' column
def normalize_levels(level):
    if pd.isna(level):
        return 'unknown'
    level = str(level).lower().strip()
    
    # Mapping for single levels
    single_mapping = {
        '0': '0',
        'one story': '1',
        'one': '1',
        '1': '1',
        'two story': '2',
        'two': '2',
        '2': '2',
        'three or more': '3+',
        'three': '3+',
        '3': '3+',
        'four': '4',
        '4+': '4',
        'five or more': '5+',
        'over 2 stories': '3+',
        '2 story or more': '2+',
        '3 story': '3+',
        '2.5 story': '2.5',
        'one and one half': '1.5',
        'two and one-half': '2.5',
        'manufactured home 1 story': '1',
        'one-manufactured home 1 story': '1',
        'one-mobile home 1 story': '1',
        'one story-one': '1',
        'two story-two': '2',
        'two story-one': '2',
        'one story-two': 'multi',
        'two-one': '2',
        'one and one half-two': '2.5',
        'one-one and one half': '1.5',
        'one-other': 'other',
        'one-one and one half-two': 'multi'
    }
    
    if level in single_mapping:
        return single_mapping[level]
    
    # Check for multi-level or complex
    if any(keyword in level for keyword in ['multi', 'split', 'tri', 'foyer', 'one-two', 'two-three', 'three or more', 'one-three']):
        return 'multi'
    
    # Other cases
    if level in ['other', 'other-see remarks', 'other-one']:
        return 'other'
    
    # Default to original if not matched
    return level

if 'levels' in combined_df.columns:
    combined_df['levels'] = combined_df['levels'].apply(normalize_levels)

# Fill missing numerical values with city median
numeric_cols = combined_df.select_dtypes(include=[np.number]).columns
exclude_cols = ['longitude', 'latitude', 'time', 'price']  # Exclude columns that shouldn't use median
for col in numeric_cols:
    if col not in exclude_cols:
        combined_df[col] = combined_df.groupby('city')[col].transform(lambda x: x.fillna(x.median()))

# Drop rows where price is 0 or null
if 'price' in combined_df.columns:
    initial_count = len(combined_df)
    combined_df = combined_df[(combined_df['price'] != 0) & (combined_df['price'].notnull())]
    removed_count = initial_count - len(combined_df)
    print(f"Removed {removed_count} rows with price 0 or null")

# Remove duplicate rows based on id column
combined_df = combined_df.drop_duplicates(subset=['id'])

# Save the new CSV file to data folder
combined_df.to_csv('data/processed_real_estate.csv', index=False)

print("Preprocessing completed. New file: data/processed_real_estate.csv")
