export interface User {
  email?: string;
  profileImage?: string;         // path in Firebase Storage
  profileImageUrl?: string;      // signed URL or public download URL
}
