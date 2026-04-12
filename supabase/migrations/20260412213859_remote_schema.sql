drop trigger if exists "article_like_delete" on "public"."article_likes";

drop trigger if exists "article_like_insert" on "public"."article_likes";

drop trigger if exists "trig_hug_count" on "public"."article_likes";

drop policy "Authenticated Insert for Articles" on "public"."article";

drop policy "Authenticated Update for Articles" on "public"."article";

drop policy "Delete the article row" on "public"."article";

drop policy "Enable read access for all users" on "public"."article";

drop policy "allow trigger updates" on "public"."article";

drop policy "Public can count hugs" on "public"."article_likes";

drop policy "Public can hug" on "public"."article_likes";

drop policy "delete" on "public"."article_likes";

drop policy "allow insert rant views" on "public"."rant_views";

drop policy "allow update rant views" on "public"."rant_views";

drop policy "allow_public_read_views" on "public"."rant_views";

drop policy "Allow delete logs" on "public"."view_logs";

drop policy "allow insert view logs" on "public"."view_logs";

drop policy "allow read view logs" on "public"."view_logs";

revoke delete on table "public"."article" from "anon";

revoke insert on table "public"."article" from "anon";

revoke references on table "public"."article" from "anon";

revoke select on table "public"."article" from "anon";

revoke trigger on table "public"."article" from "anon";

revoke truncate on table "public"."article" from "anon";

revoke update on table "public"."article" from "anon";

revoke delete on table "public"."article" from "authenticated";

revoke insert on table "public"."article" from "authenticated";

revoke references on table "public"."article" from "authenticated";

revoke select on table "public"."article" from "authenticated";

revoke trigger on table "public"."article" from "authenticated";

revoke truncate on table "public"."article" from "authenticated";

revoke update on table "public"."article" from "authenticated";

revoke delete on table "public"."article" from "service_role";

revoke insert on table "public"."article" from "service_role";

revoke references on table "public"."article" from "service_role";

revoke select on table "public"."article" from "service_role";

revoke trigger on table "public"."article" from "service_role";

revoke truncate on table "public"."article" from "service_role";

revoke update on table "public"."article" from "service_role";

revoke delete on table "public"."article_likes" from "anon";

revoke insert on table "public"."article_likes" from "anon";

revoke references on table "public"."article_likes" from "anon";

revoke select on table "public"."article_likes" from "anon";

revoke trigger on table "public"."article_likes" from "anon";

revoke truncate on table "public"."article_likes" from "anon";

revoke update on table "public"."article_likes" from "anon";

revoke delete on table "public"."article_likes" from "authenticated";

revoke insert on table "public"."article_likes" from "authenticated";

revoke references on table "public"."article_likes" from "authenticated";

revoke select on table "public"."article_likes" from "authenticated";

revoke trigger on table "public"."article_likes" from "authenticated";

revoke truncate on table "public"."article_likes" from "authenticated";

revoke update on table "public"."article_likes" from "authenticated";

revoke delete on table "public"."article_likes" from "service_role";

revoke insert on table "public"."article_likes" from "service_role";

revoke references on table "public"."article_likes" from "service_role";

revoke select on table "public"."article_likes" from "service_role";

revoke trigger on table "public"."article_likes" from "service_role";

revoke truncate on table "public"."article_likes" from "service_role";

revoke update on table "public"."article_likes" from "service_role";

revoke delete on table "public"."rant_views" from "anon";

revoke insert on table "public"."rant_views" from "anon";

revoke references on table "public"."rant_views" from "anon";

revoke select on table "public"."rant_views" from "anon";

revoke trigger on table "public"."rant_views" from "anon";

revoke truncate on table "public"."rant_views" from "anon";

revoke update on table "public"."rant_views" from "anon";

revoke delete on table "public"."rant_views" from "authenticated";

revoke insert on table "public"."rant_views" from "authenticated";

revoke references on table "public"."rant_views" from "authenticated";

revoke select on table "public"."rant_views" from "authenticated";

revoke trigger on table "public"."rant_views" from "authenticated";

revoke truncate on table "public"."rant_views" from "authenticated";

revoke update on table "public"."rant_views" from "authenticated";

revoke delete on table "public"."rant_views" from "service_role";

revoke insert on table "public"."rant_views" from "service_role";

revoke references on table "public"."rant_views" from "service_role";

revoke select on table "public"."rant_views" from "service_role";

revoke trigger on table "public"."rant_views" from "service_role";

revoke truncate on table "public"."rant_views" from "service_role";

revoke update on table "public"."rant_views" from "service_role";

revoke delete on table "public"."view_logs" from "anon";

revoke insert on table "public"."view_logs" from "anon";

revoke references on table "public"."view_logs" from "anon";

revoke select on table "public"."view_logs" from "anon";

revoke trigger on table "public"."view_logs" from "anon";

revoke truncate on table "public"."view_logs" from "anon";

revoke update on table "public"."view_logs" from "anon";

revoke delete on table "public"."view_logs" from "authenticated";

revoke insert on table "public"."view_logs" from "authenticated";

revoke references on table "public"."view_logs" from "authenticated";

revoke select on table "public"."view_logs" from "authenticated";

revoke trigger on table "public"."view_logs" from "authenticated";

revoke truncate on table "public"."view_logs" from "authenticated";

revoke update on table "public"."view_logs" from "authenticated";

revoke delete on table "public"."view_logs" from "service_role";

revoke insert on table "public"."view_logs" from "service_role";

revoke references on table "public"."view_logs" from "service_role";

revoke select on table "public"."view_logs" from "service_role";

revoke trigger on table "public"."view_logs" from "service_role";

revoke truncate on table "public"."view_logs" from "service_role";

revoke update on table "public"."view_logs" from "service_role";

alter table "public"."article" drop constraint "Article Table_title_key";

alter table "public"."article" drop constraint "article_image_url_key";

alter table "public"."article" drop constraint "article_subtitle_key";

alter table "public"."article" drop constraint "article_video_url_key";

alter table "public"."article_likes" drop constraint "article_likes_article_id_fkey";

alter table "public"."article_likes" drop constraint "unique_like";

alter table "public"."rant_views" drop constraint "rant_views_rant_id_fkey";

alter table "public"."rant_views" drop constraint "rant_views_rant_id_key";

alter table "public"."view_logs" drop constraint "view_logs_rant_id_fkey";

alter table "public"."view_logs" drop constraint "view_logs_rant_id_ip_address_key";

drop function if exists "public"."decrement_like_count"();

drop function if exists "public"."increment"(table_name text, column_name text, row_id integer, id_column text);

drop function if exists "public"."increment"(table_name text, column_name text, row_id numeric, id_column text);

drop function if exists "public"."increment"(table_name text, column_name text, row_id text, id_column text);

drop function if exists "public"."increment"(table_name text, column_name text, row_id uuid, id_column text);

drop function if exists "public"."increment_hug_count"();

drop function if exists "public"."increment_like_count"();

drop function if exists "public"."increment_rant_views"(rant integer);

drop function if exists "public"."increment_share_count"(rant_id integer);

alter table "public"."article" drop constraint "Article Table_pkey";

alter table "public"."article_likes" drop constraint "article_likes_pkey";

alter table "public"."view_logs" drop constraint "view_logs_pkey";

drop index if exists "public"."Article Table_pkey";

drop index if exists "public"."Article Table_title_key";

drop index if exists "public"."article_image_url_key";

drop index if exists "public"."article_likes_pkey";

drop index if exists "public"."article_subtitle_key";

drop index if exists "public"."article_video_url_key";

drop index if exists "public"."idx_article_likes_article_id";

drop index if exists "public"."idx_article_likes_ip_hash";

drop index if exists "public"."idx_likes_article_ip";

drop index if exists "public"."rant_views_rant_id_key";

drop index if exists "public"."unique_like";

drop index if exists "public"."view_logs_pkey";

drop index if exists "public"."view_logs_rant_id_ip_address_key";

drop table "public"."article";

drop table "public"."article_likes";

drop table "public"."rant_views";

drop table "public"."view_logs";


