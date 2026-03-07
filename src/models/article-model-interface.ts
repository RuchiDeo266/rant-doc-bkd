export interface Article {
  id: string;
  created_at: Date;
  title: string;
  subtitle: string;
  body: string;
  video_url: string;
  image: string;
  audio: string;
  tags: string[];
  like?: string;
  share_count?: string;
}
