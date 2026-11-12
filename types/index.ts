export interface Author {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
  bio?: string | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  authorId?: string | null;
  author?: Author | null;
  location?: string | null;
  isTopStory: boolean;
  isSpotlight: boolean;
  isOpinion: boolean;
  status: string;
  tags?: string[];
  publishedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type CategorySlug =
  | "usa"
  | "europe"
  | "russia"
  | "technology"
  | "opinion"
  | "finance";
