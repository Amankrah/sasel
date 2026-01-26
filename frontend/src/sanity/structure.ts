import type { StructureResolver } from 'sanity/structure'
import { CogIcon, UserIcon, DocumentTextIcon, RocketIcon, BellIcon } from '@sanity/icons'

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
