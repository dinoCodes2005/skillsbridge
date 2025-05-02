import axios from "axios";

export const fetchProblem = async (problemId: string | "") => {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_FETCH_PROBLEM as string,
      {
        problemId,
      }
    );
    if (res.status === 200) {
      const data = res.data;
      return data;
    } else if (res.status === 400) {
      console.log("Profile nahi mila ");
      return null;
    }
  } catch (err) {
    console.log("Fetch Profile Error:", err);
    return null;
  }
};
