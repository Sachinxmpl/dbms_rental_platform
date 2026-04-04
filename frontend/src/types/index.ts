export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED";
export type ItemStatus = "AVAILABLE" | "RENTED" | "UNAVAILABLE";
export type ItemCategory =
  | "ELECTRONICS"
  | "MUSICAL_INSTRUMENTS"
  | "VEHICLES"
  | "SPORTS_EQUIPMENT"
  | "TOOLS"
  | "CLOTHING"
  | "OTHER";
export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "RETURN_REQUESTED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  verificationStatus: VerificationStatus;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  pricePerDay: number;
  depositAmount: number;
  images: string[];
  location: string;
  status: ItemStatus;
  ownerId: string;
  owner: Pick<
    User,
    "id" | "name" | "averageRating" | "verificationStatus" | "avatarUrl"
  >;
  createdAt: string;
}

export interface Rental {
  id: string;
  itemId: string;
  item: Pick<Item, "id" | "title" | "images">;
  renterId: string;
  renter: Pick<User, "id" | "name" | "averageRating">;
  ownerId: string;
  owner: Pick<User, "id" | "name" | "averageRating">;
  startDate: string;
  endDate: string;
  totalDays: number;
  rentalAmount: number;
  depositAmount: number;
  depositPaid: boolean;
  depositReleased: boolean;
  status: RentalStatus;
  pickupConditionNote?: string;
  returnConditionNote?: string;
  ownerNote?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rentalId: string;
  reviewerId: string;
  reviewer: Pick<User, "id" | "name">;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PaginatedItems {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
}
