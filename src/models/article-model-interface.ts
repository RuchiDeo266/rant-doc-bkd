export interface Article {
  id: string;
  created_at: Date;
  title: string;
  subtitle: string;
  body: string;
  video_url: string;
  image_url: string;
  audio: string;
  tags: string[];
}
