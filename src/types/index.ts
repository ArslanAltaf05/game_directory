export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface UserReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful?: number;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  imageUrl: string;
  releaseDate: string;
  developer: string;
  price: number;
  isFeatured: boolean;
  version?: string;
  fileSize?: string;
  downloads: number;
  packageName?: string;
  platforms?: string[];
  socialLinks?: SocialLink[];
  reviews?: UserReview[];
  totalReviews?: number;
  ratingDistribution?: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
  downloadUrl?: string; // New field for APK download URL
    createdAt?: string; // ✅ Add this optional field
  updatedAt?: string; // ✅ Add this optional field

}
