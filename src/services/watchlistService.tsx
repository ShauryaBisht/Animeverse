import { supabase } from "../lib/supabase";
import { Tables, TablesInsert } from "../types/database.types";

export type WatchlistItem = Tables<"watchlist">;
export type WatchlistInsert = TablesInsert<"watchlist">;

export type WatchlistStatus =
  | "watching"
  | "completed"
  | "plan_to_watch"
  | "dropped";

export interface AddWatchListInput {
  anime_id: number;
  title: string;
  image_url?: string;
  score?: number | null;
  episodes?: number | null;
  type?: string | null;
  status?: WatchlistStatus;
}

export const fetchUserWatchlist = async (): Promise<WatchlistItem[]> => {
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Error fetching watchlist", error.message);
    throw error;
  }
  return data ?? [];
};

export const isAnimeInWatchlist=async(animeId:number):Promise<boolean>=>{
    const{data:{user}}=await supabase.auth.getUser()
    if(!user) return false

    const {data,error}=await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id",user.id)
    .eq("anime_id",animeId)
    .maybeSingle()

    if(error){
        console.error("Error checking watchlist",error.message)
        return false
    }
    return !!data
}


export const addToWatchlist = async (
  item: AddWatchListInput,
): Promise<WatchlistItem> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be logged in");

  const { data, error } = await supabase.from("watchlist").insert({
    user_id: user.id,
    anime_id: item.anime_id,
    title: item.title,
    image_url: item.image_url ?? null,
    score: item.score ?? null,
    episodes: item.episodes ?? null,
    type: item.type ?? null,
    status: item.status ?? "plan_to_watch",
  })
  .select()
  .single()

  if(error){
    console.log("Error adding to watchlist")
    throw error
  }
  return data
};


export const removeFromWatchlist = async (animeId: number): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to remove items.");
  }

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("anime_id", animeId);

  if (error) {
    console.error("Error removing from watchlist:", error.message);
    throw error;
  }
};

export const updateWatchlistStatus = async (
  animeId: number,
  status: WatchlistStatus
): Promise<WatchlistItem> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to update items.");
  }

  const { data, error } = await supabase
    .from("watchlist")
    .update({ status })
    .eq("user_id", user.id)
    .eq("anime_id", animeId)
    .select()
    .single();

  if (error) {
    console.error("Error updating watchlist status:", error.message);
    throw error;
  }

  return data;
};