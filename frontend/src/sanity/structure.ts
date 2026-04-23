import type { StructureResolver } from 'sanity/structure'
import { CogIcon, UserIcon, DocumentTextIcon, RocketIcon, BellIcon, CodeBlockIcon, UsersIcon, TrolleyIcon, StarIcon, CaseIcon } from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Members Section
      S.listItem()
        .title('Lab Members')
        .icon(UserIcon)
        .child(
          S.list()
            .title('Lab Members')
            .items([
              S.listItem()
                .title('All Members')
                .child(
                  S.documentTypeList('member')
                    .title('All Members')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.divider(),
              S.listItem()
                .title('Principal Investigators')
                .child(
                  S.documentList()
                    .title('Principal Investigators')
                    .filter('_type == "member" && memberType == "PI"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Current Members')
                .child(
                  S.documentList()
                    .title('Current Members')
                    .filter('_type == "member" && isActive == true')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Alumni')
                .child(
                  S.documentList()
                    .title('Alumni')
                    .filter('_type == "member" && isActive == false')
                    .apiVersion('2024-01-01')
                ),
            ])
        ),

      // Publications Section
      S.listItem()
        .title('Publications')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Publications')
            .items([
              S.listItem()
                .title('All Publications')
                .child(
                  S.documentTypeList('publication')
                    .title('All Publications')
                    .defaultOrdering([
                      { field: 'year', direction: 'desc' },
                      { field: 'month', direction: 'desc' },
                    ])
                ),
              S.divider(),
              S.listItem()
                .title('Journal Articles')
                .child(
                  S.documentList()
                    .title('Journal Articles')
                    .filter('_type == "publication" && publicationType == "JOURNAL"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Conference Papers')
                .child(
                  S.documentList()
                    .title('Conference Papers')
                    .filter('_type == "publication" && publicationType == "CONF"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Books & Chapters')
                .child(
                  S.documentList()
                    .title('Books & Chapters')
                    .filter('_type == "publication" && publicationType in ["BOOK", "CHAPTER"]')
                    .apiVersion('2024-01-01')
                ),
            ])
        ),

      // Projects Section
      S.listItem()
        .title('Projects')
        .icon(RocketIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('All Projects')
                .child(S.documentTypeList('project').title('All Projects')),
              S.divider(),
              S.listItem()
                .title('Active Projects')
                .child(
                  S.documentList()
                    .title('Active Projects')
                    .filter('_type == "project" && status == "ACTIVE"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Completed Projects')
                .child(
                  S.documentList()
                    .title('Completed Projects')
                    .filter('_type == "project" && status == "COMPLETED"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Featured Projects')
                .child(
                  S.documentList()
                    .title('Featured Projects')
                    .filter('_type == "project" && isFeatured == true')
                    .apiVersion('2024-01-01')
                ),
            ])
        ),

      // Technologies Section
      S.listItem()
        .title('Technologies')
        .icon(CodeBlockIcon)
        .child(
          S.list()
            .title('Technologies')
            .items([
              S.listItem()
                .title('All Technologies')
                .child(
                  S.documentTypeList('technology')
                    .title('All Technologies')
                    .defaultOrdering([{ field: 'featuredOrder', direction: 'asc' }])
                ),
              S.divider(),
              S.listItem()
                .title('Live')
                .child(
                  S.documentList()
                    .title('Live')
                    .filter('_type == "technology" && status == "LIVE"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Beta')
                .child(
                  S.documentList()
                    .title('Beta')
                    .filter('_type == "technology" && status == "BETA"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('In Development')
                .child(
                  S.documentList()
                    .title('In Development')
                    .filter('_type == "technology" && status == "IN_DEVELOPMENT"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Featured')
                .child(
                  S.documentList()
                    .title('Featured Technologies')
                    .filter('_type == "technology" && isFeatured == true')
                    .apiVersion('2024-01-01')
                ),
            ])
        ),

      // Grants, Awards, Collaborations, Partnerships
      S.listItem()
        .title('Grants & Partnerships')
        .icon(TrolleyIcon)
        .child(
          S.list()
            .title('Grants & Partnerships')
            .items([
              S.listItem()
                .title('Grants')
                .icon(TrolleyIcon)
                .child(
                  S.documentTypeList('grant')
                    .title('Grants')
                    .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Awards')
                .icon(StarIcon)
                .child(
                  S.documentTypeList('award')
                    .title('Awards')
                    .defaultOrdering([{ field: 'dateReceived', direction: 'desc' }])
                ),
              S.listItem()
                .title('Collaborations')
                .icon(UsersIcon)
                .child(
                  S.documentTypeList('collaboration')
                    .title('Collaborations')
                    .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Partnerships')
                .icon(CaseIcon)
                .child(
                  S.documentTypeList('partnership')
                    .title('Partnerships')
                    .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                ),
            ])
        ),

      // Partners & Sponsors
      S.listItem()
        .title('Partners & Sponsors')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Partners & Sponsors')
            .items([
              S.listItem()
                .title('All Partners')
                .child(
                  S.documentTypeList('partner')
                    .title('All Partners')
                    .defaultOrdering([
                      { field: 'category', direction: 'asc' },
                      { field: 'featuredOrder', direction: 'asc' },
                      { field: 'name', direction: 'asc' },
                    ])
                ),
              S.divider(),
              S.listItem()
                .title('Funders / Sponsors')
                .child(
                  S.documentList()
                    .title('Funders / Sponsors')
                    .filter('_type == "partner" && category == "FUNDER"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Academic / Research')
                .child(
                  S.documentList()
                    .title('Academic / Research')
                    .filter('_type == "partner" && category == "ACADEMIC"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Government / Agency')
                .child(
                  S.documentList()
                    .title('Government / Agency')
                    .filter('_type == "partner" && category == "GOVERNMENT"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Industry / NGO')
                .child(
                  S.documentList()
                    .title('Industry / NGO')
                    .filter('_type == "partner" && category == "INDUSTRY"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Advisory Board')
                .child(
                  S.documentList()
                    .title('Advisory Board')
                    .filter('_type == "partner" && category == "ADVISORY"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Featured Sponsors')
                .child(
                  S.documentList()
                    .title('Featured Sponsors')
                    .filter('_type == "partner" && isFeatured == true')
                    .apiVersion('2024-01-01')
                ),
            ])
        ),

      // News Section
      S.listItem()
        .title('News & Announcements')
        .icon(BellIcon)
        .child(
          S.list()
            .title('News & Announcements')
            .items([
              S.listItem()
                .title('All News')
                .child(
                  S.documentTypeList('news')
                    .title('All News')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.divider(),
              S.listItem()
                .title('Published')
                .child(
                  S.documentList()
                    .title('Published')
                    .filter('_type == "news" && isPublished == true')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Drafts')
                .child(
                  S.documentList()
                    .title('Drafts')
                    .filter('_type == "news" && isPublished == false')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Featured')
                .child(
                  S.documentList()
                    .title('Featured News')
                    .filter('_type == "news" && isFeatured == true')
                    .apiVersion('2024-01-01')
                ),
            ])
        ),

      S.divider(),

      // Settings (Singleton)
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('settings')),
    ])
