// Shared product types — aligned for both web and mobile backend shape

export type UserRole = "student" | "teacher" | "admin";

export type Profile = {
  id: string; // matches Clerk user ID
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type MediaSource = "cloudinary_upload" | "external_link";

// Media architecture: a lesson media entry can be an uploaded asset OR an external link.
// This supports both teacher web uploads and future mobile uploads, and external link entry.
export type LessonMedia = {
  id: string;
  lesson_id: string;
  source_type: MediaSource;
  cloudinary_public_id: string | null; // populated when source_type = 'cloudinary_upload'
  external_url: string | null; // populated when source_type = 'external_link'
  created_at: string;
};
