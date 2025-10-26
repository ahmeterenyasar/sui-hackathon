// Profile Types
export interface Profile {
  id: string;
  owner: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: Theme;
  links: Link[];
  socialLinks: SocialLinks;
  createdAt: number;
  updatedAt: number;
}

export interface Theme {
  backgroundColor: string;
  buttonStyle: string;
  font: string;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  description?: string;
  icon: string;
  position: number;
  isVisible: boolean;
}

export interface SocialLinks {
  twitter?: string;
  discord?: string;
  telegram?: string;
  github?: string;
  website?: string;
}

// Form Types
export interface CreateProfileFormData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: Theme;
}

export interface UsernameValidation {
  isValid: boolean;
  isChecking: boolean;
  error?: string;
}

// Theme Template Type
export interface ThemeTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  buttonStyle: string;
  font: string;
  gradient: string;
  preview: {
    bg: string;
    buttonBg: string;
    buttonText: string;
  };
}
