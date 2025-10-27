import apiClient from './client';
import type { 
  LabMember, Project, Collaboration, Grant, 
  Award, Publication, Partnership 
} from './types';

// Generic function to get all items of a specific type
const getAll = async <T>(endpoint: string): Promise<T[]> => {
  try {
    console.log(`Fetching data from /${endpoint}/`);
    const response = await apiClient.get<T[]>(`/${endpoint}/`);
    console.log(`Response for ${endpoint}:`, response.data);
    
    // Check if response has results property (DRF pagination)
    if (response.data && typeof response.data === 'object' && 'results' in response.data) {
      console.log(`Received paginated data for ${endpoint}`);
      return response.data.results;
    }
    
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return empty array on error to prevent map errors
    return [];
  }
};

// Generic function to get a single item by slug
const getBySlug = async <T>(endpoint: string, slug: string): Promise<T | null> => {
  try {
    const response = await apiClient.get<T>(`/${endpoint}/${slug}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} with slug ${slug}:`, error);
    return null;
  }
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