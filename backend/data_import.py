#!/usr/bin/env python
import csv
import os
import sys
import django
from datetime import datetime
from django.core.files import File
from django.utils.text import slugify

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sasel_lab_site.settings')
django.setup()

# Import models after Django setup
from lab_content.models import (
    LabMember, Project, Collaboration, Grant, 
    Award, Publication, Partnership
)

# Path to data templates directory
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), 'data_templates')

def str_to_bool(value):
    return value.lower() in ('true', 'yes', '1')

def parse_date(date_str):
    if not date_str:
        return None
    return datetime.strptime(date_str, '%Y-%m-%d').date()

def parse_integer(value):
    if not value or value.strip() == '':
        return None
    return int(value)

def parse_decimal(value):
    if not value or value.strip() == '':
        return None
    return float(value)

def get_file_path(path):
    if not path or path.strip() == '':
        return None
    return path

def get_members_dict():
    """Create a dictionary of member names to member objects"""
    return {member.name: member for member in LabMember.objects.all()}

def get_projects_dict():
    """Create a dictionary of project titles to project objects"""
    return {project.title: project for project in Project.objects.all()}

def import_lab_members():
    """Import lab members from CSV"""
    print("Importing lab members...")
    filepath = os.path.join(DATA_DIR, 'lab_members.csv')
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                member, created = LabMember.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'member_type': row['member_type'],
                        'position': row['position'],
                        'bio': row['bio'],
                        'email': row['email'],
                        'website': row['website'],
                        'joined_date': parse_date(row['joined_date']),
                        'left_date': parse_date(row['left_date']),
                        'is_active': str_to_bool(row['is_active']),
                        'order': parse_integer(row['order']),
                        'slug': slugify(row['name'])
                    }
                )
                
                # Handle image separately
                if row.get('image') and row['image'].strip():
                    # This assumes images are already in the media directory
                    # For production, you'd want to handle file uploads properly
                    member.image = row['image']
                    member.save()
                
                print(f"{'Created' if created else 'Updated'} member: {member.name}")
            except Exception as e:
                print(f"Error importing member {row.get('name', 'unknown')}: {e}")

def import_projects():
    """Import projects from CSV"""
    print("Importing projects...")
    filepath = os.path.join(DATA_DIR, 'projects.csv')
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    members_dict = get_members_dict()
    
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                project, created = Project.objects.get_or_create(
                    title=row['title'],
                    defaults={
                        'description': row['description'],
                        'start_date': parse_date(row['start_date']),
                        'end_date': parse_date(row['end_date']),
                        'is_active': str_to_bool(row['is_active']),
                        'website': row['website'],
                        'github_repo': row['github_repo'],
                        'slug': slugify(row['title'])
                    }
                )
                
                # Handle image
                if row.get('image') and row['image'].strip():
                    project.image = row['image']
                
                # Save before adding many-to-many relations
                project.save()
                
                # Add members
                if row.get('members'):
                    member_names = [name.strip() for name in row['members'].split(',')]
                    for name in member_names:
                        if name in members_dict:
                            project.members.add(members_dict[name])
                        else:
                            print(f"Warning: Member {name} not found for project {project.title}")
                
                print(f"{'Created' if created else 'Updated'} project: {project.title}")
            except Exception as e:
                print(f"Error importing project {row.get('title', 'unknown')}: {e}")

def import_collaborations():
    """Import collaborations from CSV"""
    print("Importing collaborations...")
    filepath = os.path.join(DATA_DIR, 'collaborations.csv')
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    projects_dict = get_projects_dict()
    
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                collab, created = Collaboration.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'collaboration_type': row['collaboration_type'],
                        'institution': row['institution'],
                        'description': row['description'],
                        'start_date': parse_date(row['start_date']),
                        'end_date': parse_date(row['end_date']),
                        'is_active': str_to_bool(row['is_active']),
                        'website': row['website'],
                        'slug': slugify(row['name'])
                    }
                )
                
                # Handle image
                if row.get('image') and row['image'].strip():
                    collab.image = row['image']
                
                # Save before adding many-to-many relations
                collab.save()
                
                # Add projects
                if row.get('projects'):
                    project_titles = [title.strip() for title in row['projects'].split(',')]
                    for title in project_titles:
                        if title in projects_dict:
                            collab.projects.add(projects_dict[title])
                        else:
                            print(f"Warning: Project {title} not found for collaboration {collab.name}")
                
                print(f"{'Created' if created else 'Updated'} collaboration: {collab.name}")
            except Exception as e:
                print(f"Error importing collaboration {row.get('name', 'unknown')}: {e}")

def import_grants():
    """Import grants from CSV"""
    print("Importing grants...")
    filepath = os.path.join(DATA_DIR, 'grants.csv')
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    members_dict = get_members_dict()
    projects_dict = get_projects_dict()
    
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                grant, created = Grant.objects.get_or_create(
                    title=row['title'],
                    defaults={
                        'funding_agency': row['funding_agency'],
                        'description': row['description'],
                        'amount': parse_decimal(row['amount']),
                        'currency': row['currency'],
                        'start_date': parse_date(row['start_date']),
                        'end_date': parse_date(row['end_date']),
                        'is_active': str_to_bool(row['is_active']),
                        'slug': slugify(row['title'])
                    }
                )
                
                # Handle image
                if row.get('image') and row['image'].strip():
                    grant.image = row['image']
                
                # Save before adding many-to-many relations
                grant.save()
                
                # Add principal investigators
                if row.get('principal_investigators'):
                    pi_names = [name.strip() for name in row['principal_investigators'].split(',')]
                    for name in pi_names:
                        if name in members_dict:
                            grant.principal_investigators.add(members_dict[name])
                        else:
                            print(f"Warning: PI {name} not found for grant {grant.title}")
                
                # Add co-investigators
                if row.get('co_investigators'):
                    ci_names = [name.strip() for name in row['co_investigators'].split(',')]
                    for name in ci_names:
                        if name in members_dict:
                            grant.co_investigators.add(members_dict[name])
                        else:
                            print(f"Warning: Co-I {name} not found for grant {grant.title}")
                
                # Add projects
                if row.get('projects'):
                    project_titles = [title.strip() for title in row['projects'].split(',')]
                    for title in project_titles:
                        if title in projects_dict:
                            grant.projects.add(projects_dict[title])
                        else:
                            print(f"Warning: Project {title} not found for grant {grant.title}")
                
                print(f"{'Created' if created else 'Updated'} grant: {grant.title}")
            except Exception as e:
                print(f"Error importing grant {row.get('title', 'unknown')}: {e}")

def import_awards():
    """Import awards from CSV"""
    print("Importing awards...")
    filepath = os.path.join(DATA_DIR, 'awards.csv')
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    members_dict = get_members_dict()
    projects_dict = get_projects_dict()
    
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                award, created = Award.objects.get_or_create(
                    title=row['title'],
                    defaults={
                        'awarding_body': row['awarding_body'],
                        'description': row['description'],
                        'date_received': parse_date(row['date_received']),
                        'slug': slugify(row['title'])
                    }
                )
                
                # Handle image
                if row.get('image') and row['image'].strip():
                    award.image = row['image']
                
                # Save before adding many-to-many relations
                award.save()
                
                # Add recipients
                if row.get('recipients'):
                    recipient_names = [name.strip() for name in row['recipients'].split(',')]
                    for name in recipient_names:
                        if name in members_dict:
                            award.recipients.add(members_dict[name])
                        else:
                            print(f"Warning: Recipient {name} not found for award {award.title}")
                
                # Add projects
                if row.get('projects'):
                    project_titles = [title.strip() for title in row['projects'].split(',')]
                    for title in project_titles:
                        if title in projects_dict:
                            award.projects.add(projects_dict[title])
                        else:
                            print(f"Warning: Project {title} not found for award {award.title}")
                
                print(f"{'Created' if created else 'Updated'} award: {award.title}")
            except Exception as e:
                print(f"Error importing award {row.get('title', 'unknown')}: {e}")

def import_publications():
    """Import publications from CSV"""
    print("Importing publications...")
    filepath = os.path.join(DATA_DIR, 'publications.csv')
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    members_dict = get_members_dict()
    projects_dict = get_projects_dict()
    
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                pub, created = Publication.objects.get_or_create(
                    title=row['title'],
                    defaults={
                        'publication_type': row['publication_type'],
                        'external_authors': row['external_authors'],
                        'abstract': row['abstract'],
                        'journal': row['journal'],
                        'conference': row['conference'],
                        'volume': row['volume'],
                        'issue': row['issue'],
                        'pages': row['pages'],
                        'year': parse_integer(row['year']),
                        'month': parse_integer(row['month']),
                        'publisher': row['publisher'],
                        'doi': row['doi'],
                        'url': row['url'],
                        'citation': row['citation'],
                        'slug': slugify(row['title'])
                    }
                )
                
                # Handle image
                if row.get('image') and row['image'].strip():
                    pub.image = row['image']
                
                # Save before adding many-to-many relations
                pub.save()
                
                # Add authors
                if row.get('authors'):
                    author_names = [name.strip() for name in row['authors'].split(',')]
                    for name in author_names:
                        if name in members_dict:
                            pub.authors.add(members_dict[name])
                        else:
                            print(f"Warning: Author {name} not found for publication {pub.title}")
                
                # Add projects
                if row.get('projects'):
                    project_titles = [title.strip() for title in row['projects'].split(',')]
                    for title in project_titles:
                        if title in projects_dict:
                            pub.projects.add(projects_dict[title])
                        else:
                            print(f"Warning: Project {title} not found for publication {pub.title}")
                
                print(f"{'Created' if created else 'Updated'} publication: {pub.title}")
            except Exception as e:
                print(f"Error importing publication {row.get('title', 'unknown')}: {e}")

def import_partnerships():
    """Import partnerships from CSV"""
    print("Importing partnerships...")
    filepath = os.path.join(DATA_DIR, 'partnerships.csv')
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    projects_dict = get_projects_dict()
    
    with open(filepath, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                partnership, created = Partnership.objects.get_or_create(
                    name=row['name'],
                    defaults={
                        'organization': row['organization'],
                        'description': row['description'],
                        'start_date': parse_date(row['start_date']),
                        'end_date': parse_date(row['end_date']),
                        'is_active': str_to_bool(row['is_active']),
                        'website': row['website'],
                        'contact_name': row['contact_name'],
                        'contact_email': row['contact_email'],
                        'slug': slugify(row['name'])
                    }
                )
                
                # Handle image
                if row.get('image') and row['image'].strip():
                    partnership.image = row['image']
                
                # Save before adding many-to-many relations
                partnership.save()
                
                # Add projects
                if row.get('projects'):
                    project_titles = [title.strip() for title in row['projects'].split(',')]
                    for title in project_titles:
                        if title in projects_dict:
                            partnership.projects.add(projects_dict[title])
                        else:
                            print(f"Warning: Project {title} not found for partnership {partnership.name}")
                
                print(f"{'Created' if created else 'Updated'} partnership: {partnership.name}")
            except Exception as e:
                print(f"Error importing partnership {row.get('name', 'unknown')}: {e}")

def main():
    """Main function to import all data"""
    print("Starting data import...")
    
    # Verify that the data directory exists
    if not os.path.exists(DATA_DIR):
        print(f"Error: Data directory not found at {DATA_DIR}")
        print("Please check the path and make sure the data_templates folder exists.")
        return
    
    # Check that all required CSV files exist
    required_files = [
        'lab_members.csv', 
        'projects.csv', 
        'collaborations.csv', 
        'grants.csv', 
        'awards.csv', 
        'publications.csv', 
        'partnerships.csv'
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(os.path.join(DATA_DIR, file)):
            missing_files.append(file)
    
    if missing_files:
        print("Warning: The following template files were not found:")
        for file in missing_files:
            print(f"  - {file}")
        print("Only the available templates will be processed.")
        print()
    
    # Order is important due to relations between models
    try:
        import_lab_members()
        import_projects()
        import_collaborations()
        import_grants()
        import_awards()
        import_publications()
        import_partnerships()
        print("Data import completed successfully!")
    except Exception as e:
        print(f"Error during import process: {e}")
        print("Import process did not complete successfully.")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 