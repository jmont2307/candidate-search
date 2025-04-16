export interface Candidate {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
  location: string | null;
  email: string | null;
  html_url: string;
  company: string | null;
}
