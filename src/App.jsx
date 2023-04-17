import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

function App() {
  const queryClient = useQueryClient(); //basically get the query client from main.jsx so that we can invalidate the cache

  //queryKey is an array of strings and objects that will be used to identify the query: 
  // /posts -> ['posts']
  // /posts/1 -> ['posts', post.id]
  // /posts?authorId=1 -> ['posts', { authorId: 1 }]
  // /posts/2/comments -> ['posts', post.id, 'comments']
  const postsQuery = useQuery({
    queryKey: ["posts"], //unique identifier for this query, a name for this query
    queryFn: async () => { 
      //function that will be called to fetch the data
      await wait(1000);
      return POSTS;
      /*
        return axios.get("/posts").then((res) => res.data); //fetch the data from the server
      */
      //await Promise.reject("Error Message"); //simulate an error
    },
  });

  const newPostMutation = useMutation({
    mutationFn: async (title) => {
      //function that will be called to mutate the data
      return wait(1000).then(() => {
        POSTS.push({ id: crypto.randomUUID(), title });
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]); //invalidate the cache for the posts query so that the new post will be fetched
    },
  });

  if (postsQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>;
  }

  return (
    <div className="App">
      {postsQuery.data.map((post) => (
        <h1 key={post.id}>{post.title}</h1>
      ))}

      <button
        disabled={newPostMutation.isLoading}
        onClick={() => newPostMutation.mutate("New Post")}
      >
        Add New
      </button>
    </div>
  );
}

function wait(duration) {
  //manually simulate a delay in load time
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
