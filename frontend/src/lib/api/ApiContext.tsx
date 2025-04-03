'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as apiServices from './services';
import type { 
  LabMember, Project, Collaboration, Grant, 
  Award, Publication, Partnership 
} from './types';

interface ApiContextType {
  labMembers: LabMember[];
  projects: Project[];
  collaborations: Collaboration[];
  grants: Grant[];
  awards: Award[];
  publications: Publication[];
  partnerships: Partnership[];
  loading: boolean;
  error: Error | null;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [labMembers, setLabMembers] = useState<LabMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          membersData,
          projectsData,
          collaborationsData,
          grantsData,
          awardsData,
          publicationsData,
          partnershipsData
        ] = await Promise.all([
          apiServices.getLabMembers(),
          apiServices.getProjects(),
          apiServices.getCollaborations(),
          apiServices.getGrants(),
          apiServices.getAwards(),
          apiServices.getPublications(),
          apiServices.getPartnerships()
        ]);

        // Validate and ensure data is in the correct format
        setLabMembers(Array.isArray(membersData) ? membersData : []);
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setCollaborations(Array.isArray(collaborationsData) ? collaborationsData : []);
        setGrants(Array.isArray(grantsData) ? grantsData : []);
        setAwards(Array.isArray(awardsData) ? awardsData : []);
        setPublications(Array.isArray(publicationsData) ? publicationsData : []);
        setPartnerships(Array.isArray(partnershipsData) ? partnershipsData : []);
      } catch (err) {
        console.error('API Error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        // Set empty arrays for all data to prevent map errors
        setLabMembers([]);
        setProjects([]);
        setCollaborations([]);
        setGrants([]);
        setAwards([]);
        setPublications([]);
        setPartnerships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ApiContext.Provider
      value={{
        labMembers,
        projects,
        collaborations,
        grants,
        awards,
        publications,
        partnerships,
        loading,
        error
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}; 