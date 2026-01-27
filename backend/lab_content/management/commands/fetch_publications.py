from django.core.management.base import BaseCommand
from django.conf import settings
from lab_content.models import LabMember, Publication
import datetime
try:
    from serpapi import GoogleSearch
except ImportError:
    GoogleSearch = None

class Command(BaseCommand):
    help = 'Fetches publications from Google Scholar for lab members'

    def handle(self, *args, **options):
        if not settings.SERPAPI_KEY:
            self.stdout.write(self.style.ERROR('SERPAPI_KEY not found in settings'))
            return
        
        if not GoogleSearch:
            self.stdout.write(self.style.ERROR('google-search-results library not installed. Please install it first.'))
            return

        members = LabMember.objects.exclude(google_scholar_id__exact='').exclude(google_scholar_id__isnull=True)
        
        if not members.exists():
            self.stdout.write(self.style.WARNING('No members with google_scholar_id found. Please add IDs to lab members in the admin.'))
            return

        self.stdout.write(f'Found {members.count()} members to process.')

        for member in members:
            self.stdout.write(f'Fetching publications for: {member.name} ({member.google_scholar_id})')
            
            try:
                params = {
                    "engine": "google_scholar_author",
                    "author_id": member.google_scholar_id,
                    "api_key": settings.SERPAPI_KEY,
                    "num": 100,
                    "sort": "pubdate"
                }
                
                search = GoogleSearch(params)
                results = search.get_dict()
                
                if "error" in results:
                    self.stdout.write(self.style.ERROR(f'Error from SerpApi: {results["error"]}'))
                    continue
                    
                articles = results.get("articles", [])
                
                added_count = 0
                updated_count = 0
                
                for art in articles:
                    title = art.get("title")
                    link = art.get("link")
                    citation_id = art.get("citation_id")
                    pub_year = art.get("year")
                    authors_txt = art.get("authors")
                    publication_txt = art.get("publication")
                    
                    if not title:
                        continue
                        
                    # Handle Year Parsing
                    try:
                        year_val = int(pub_year) if pub_year and str(pub_year).isdigit() else 2024 # Default or skip?
                    except ValueError:
                        year_val = 0

                    if year_val == 0 and not pub_year:
                         # Try to extract from citation string if year is missing?
                         pass
                    
                    # Check if exists by external_id or title
                    pub = None
                    if citation_id:
                        pub = Publication.objects.filter(external_id=citation_id).first()
                    
                    if not pub:
                        pub = Publication.objects.filter(title__iexact=title).first()

                    if pub:
                        # Update logic if needed, e.g. update external_id if missing
                        if not pub.external_id and citation_id:
                            pub.external_id = citation_id
                            pub.save()
                        updated_count += 1
                    else:
                        # Create new
                        pub = Publication.objects.create(
                            title=title,
                            year=year_val if year_val else datetime.date.today().year,
                            external_id=citation_id or '',
                            doi='', # SerpApi doesn't give DOI easily in list view
                            url=link or '',
                            publication_type='JOURNAL', # Defaulting to Journal as most GS items are
                            journal=publication_txt or '',
                            external_authors=authors_txt or '',
                            citation=f"{authors_txt} ({pub_year}). {title}. {publication_txt}"
                        )
                        added_count += 1
                    
                    # Link to member
                    pub.authors.add(member)
                
                self.stdout.write(self.style.SUCCESS(f'  - Added: {added_count}, Updated/Linked: {updated_count}'))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  - Failed to fetch: {str(e)}'))
