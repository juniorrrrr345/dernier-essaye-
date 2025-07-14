export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  video_url: string;
  thumbnail_url: string;
  order_link: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ShopConfig {
  id: string;
  shop_name: string;
  background_color: string;
  background_image_url?: string;
  logo_url?: string;
  dark_mode: boolean;
  footer_text: string;
  created_at: string;
  updated_at: string;
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  page_key: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  authenticated: boolean;
  expires: string;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  thumbnail_url?: string;
  error?: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}