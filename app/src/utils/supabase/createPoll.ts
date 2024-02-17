import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function createPoll(req: {
  pollId: string;
  question: string;
  creator: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  isAnon: boolean;
  validity: number;
}): Promise<{ message: string; response: any }> {
  const {
    pollId,
    question,
    creator,
    optionA,
    optionB,
    optionC,
    optionD,
    isAnon,
    validity,
  } = req;

  try {
    const { data: fetchedPoll, error: fetchError } = await supabase
      .from("polls")
      .select("*")
      .eq("pollId", pollId);

    console.log(fetchedPoll);
    if (fetchError || fetchedPoll == null || fetchedPoll.length === 0) {
      const { data, error } = supabase
        ? await supabase
            .from("polls")
            .insert([
              {
                id: parseInt(pollId),
                question,
                creator,
                option_a: optionA,
                option_b: optionB,
                option_c: optionC,
                option_d: optionD,
                is_anon: isAnon,
                validity,
              },
            ])
            .select()
        : {
            data: null,
            error: new Error("Supabase client is not initialized"),
          };
      if (error) {
        console.log(error);

        return { message: "Error creating poll", response: error };
      }
      return {
        message: "Poll created",
        response: data != null ? data[0] : "",
      };
    } else {
      return {
        message: "Poll already exists",
        response: fetchedPoll[0],
      };
    }
  } catch (error) {
    console.error("Error creating nft:", error);
    return { message: "Internal Server Error", response: null };
  }
}
