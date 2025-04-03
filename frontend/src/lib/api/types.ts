// Common type for media fields
interface MediaFields {
  image?: string | null;
  video?: string | null;
  audio?: string | null;
  document?: string | null;
}

export interface LabMember extends MediaFields {
  id: number;
  name: string;
  slug: string;
  member_type: string;
  position: string;
  bio: string;
  email: string;
  website: string;
  joined_date: string;
  left_date: string | null;
  is_active: boolean;
  order: number;
}

export interface Project extends MediaFields {
  id: number;
  title: string;
  slug: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  members: LabMember[] | number[];
  website: string;
  github_repo: string;
}

export interface Collaboration extends MediaFields {
  id: number;
  name: string;
  slug: string;
  collaboration_type: string;
  institution: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  website: string;
  projects: Project[] | number[];
}

export interface Grant extends MediaFields {
  id: number;
  title: string;
  slug: string;
  funding_agency: string;
  description: string;
  amount: number | null;
  currency: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  principal_investigators: LabMember[] | number[];
  co_investigators: LabMember[] | number[];
  projects: Project[] | number[];
}

export interface Award extends MediaFields {
  id: number;
  title: string;
  slug: string;
  awarding_body: string;
  description: string;
  date_received: string;
  recipients: LabMember[] | number[];
  projects: Project[] | number[];
}

export interface Publication extends MediaFields {
  id: number;
  title: string;
  slug: string;
  publication_type: string;
  authors: LabMember[] | number[];
  external_authors: string;
  abstract: string;
  journal: string;
  conference: string;
  volume: string;
  issue: string;
  pages: string;
  year: number;
  month: number | null;
  publisher: string;
  doi: string;
  url: string;
  citation: string;
  projects: Project[] | number[];
}

export interface Partnership extends MediaFields {
  id: number;
  name: string;
  slug: string;
  organization: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  website: string;
  contact_name: string;
  contact_email: string;
  projects: Project[] | number[];
} 