import apiClient from './client';
import type { 
  LabMember, Project, Collaboration, Grant, 
  Award, Publication, Partnership 
} from './types';

// Generic function to get all items of a specific type
const getAll = async <T>(endpoint: string): Promise<T[]> => {
  const response = await apiClient.get<T[]>(`/${endpoint}/`);
  return response.data;
};

// Generic function to get a single item by slug
const getBySlug = async <T>(endpoint: string, slug: string): Promise<T> => {
  const response = await apiClient.get<T>(`/${endpoint}/${slug}/`);
  return response.data;
};

// Lab Members
export const getLabMembers = () => getAll<LabMember>('members');
export const getLabMemberBySlug = (slug: string) => getBySlug<LabMember>('members', slug);

// Projects
export const getProjects = () => getAll<Project>('projects');
export const getProjectBySlug = (slug: string) => getBySlug<Project>('projects', slug);

// Collaborations
export const getCollaborations = () => getAll<Collaboration>('collaborations');
export const getCollaborationBySlug = (slug: string) => getBySlug<Collaboration>('collaborations', slug);

// Grants
export const getGrants = () => getAll<Grant>('grants');
export const getGrantBySlug = (slug: string) => getBySlug<Grant>('grants', slug);

// Awards
export const getAwards = () => getAll<Award>('awards');
export const getAwardBySlug = (slug: string) => getBySlug<Award>('awards', slug);

// Publications
export const getPublications = () => getAll<Publication>('publications');
export const getPublicationBySlug = (slug: string) => getBySlug<Publication>('publications', slug);

// Partnerships
export const getPartnerships = () => getAll<Partnership>('partnerships');
export const getPartnershipBySlug = (slug: string) => getBySlug<Partnership>('partnerships', slug); 