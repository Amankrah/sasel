# SASEL Lab Data Templates

This directory contains CSV templates for importing data into the SASEL Lab website's database. These templates help standardize data collection and make it easier to import information about lab members, projects, publications, and more.

## CSV Templates Overview

The following CSV templates are available:

1. **lab_members.csv** - For lab member information (professors, students, staff)
2. **projects.csv** - For research project details
3. **collaborations.csv** - For collaborations with other institutions
4. **grants.csv** - For research grants and funding
5. **awards.csv** - For awards received by lab members or projects
6. **publications.csv** - For academic publications
7. **partnerships.csv** - For industry and academic partnerships

## How to Use These Templates

1. **Fill in the CSV files** with your data, following the provided examples and format
2. **Be consistent with names** across files (e.g., use the same name format for lab members)
3. **Dates** should be in YYYY-MM-DD format
4. **Boolean values** should be "true" or "false"
5. **For multi-value fields** (e.g., members in a project), separate values with commas
6. **Image paths** should be relative to the media directory (e.g., "images/members/john_doe.jpg")

## Special Notes on Relationships

Some fields reference other entities. For example:

- In **projects.csv**, the "members" field should contain comma-separated lab member names that match exactly with entries in lab_members.csv
- In **publications.csv**, the "authors" field should reference existing lab members, while "external_authors" can be any text
- In **grants.csv**, "principal_investigators" and "co_investigators" should reference existing lab members

## Importing the Data

After filling out the templates, you can import the data using the provided import script:

```bash
cd backend
python data_import.py
```

This script will process all CSV files in the proper order to maintain relationships between entities.

## Image Handling

For production use, you should place image files in the appropriate directories within your media folder:

- Lab member images: `/media/images/members/`
- Project images: `/media/images/projects/`
- And so on for other entity types

The import script assumes these images are already in place.

## Troubleshooting

- If you encounter errors during import, check that all referenced entities exist
- Verify that date formats are correct (YYYY-MM-DD)
- Make sure there are no extra spaces in CSV fields
- Validate that all required fields have values 