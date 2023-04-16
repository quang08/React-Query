import { useQuery, useMutation } from "@tanstack/react-query";

const POSTS = [
  { id: 1, title: "Post 1" },
  { id: 2, title: "Post 2" },
];

function App() {
  const postsQuery = useQuery({
    queryKey: ["posts"], //unique identifier for this query, a name for this query
    queryFn: async () => {
      //function that will be called to fetch the data
      await wait(1000);
      return POSTS;
      //await Promise.reject("Error Message"); //simulate an error
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
    </div>
  );
}

function wait(duration) {
  //manually simulate a delay in load time
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default App;
