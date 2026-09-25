export interface Movie {
  identifier: string;
  title: string;
  description: string;
  year?: number | string;
  licenseurl?: string;
  downloads?: number;
  rating?: number | string;
  runtime?: string;
  posterUrl: string;
  videoUrl?: string;
  embedUrl: string;
  category?: string;
  tags?: string[];
}

export interface ArchiveSearchDoc {
  identifier: string;
  title: string;
  description?: string;
  licenseurl?: string;
  year?: number | string;
  downloads?: number;
  rating?: number | string;
  runtime?: string;
}

export interface ArchiveSearchResponse {
  responseHeader: {
    status: number;
    QTime: number;
    params: Record<string, string>;
  };
  response: {
    numFound: number;
    start: number;
    docs: ArchiveSearchDoc[];
  };
}

export interface MovieFile {
  name: string;
  format: string;
  size?: string;
  height?: string;
  width?: string;
}

export interface MovieDetailResponse {
  identifier: string;
  title: string;
  description: string;
  year?: string;
  date?: string;
  licenseurl?: string;
  embedUrl: string;
  posterUrl: string;
  videoUrl?: string;
  files: MovieFile[];
}

export interface KidProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
}
