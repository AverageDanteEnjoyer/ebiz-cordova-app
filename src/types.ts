import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface SidebarItems {
  links: Array<{
    label: string;
    href: string;
    icon?: LucideIcon;
  }>;
  extras?: ReactNode;
}

export const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  bio?: string;
  imagePath?: string;
}

interface BasicUser {
  id: number;
  firstName: string;
  lastName: string;
  imagePath?: string;
}

interface Comment {
  id: number;
  text: string;
  rating: number;
  user: BasicUser;
  createdAt: string;
}

export interface CommentForm {
  text: string;
  rating: number;
}

export interface RecipeDetails {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
  imagePath: string;
  avgRating: number;
  commentCount: number;
  user: BasicUser;
  comments: Comment[];
}

export type RecipeListItem = {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  avgRating: number;
  commentCount: number;
  user: BasicUser;
};

export type Paginated<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
};
