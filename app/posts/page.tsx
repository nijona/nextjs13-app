import { Comment, Like, User } from "@prisma/client";
import Feed from "./Feed";

async function getPosts() {
 return [];
}

export default async function Posts() {
  const data: {
    id: string;
    content: string;
    user: User;
    createdAt: string;
    likes: Like[];
    comments: {
      id: string;
      user: User;
      createdAt: string;
      content: string;
    }[];
  }[] = await getPosts();
  // console.log(data);
  return (
    <main>
      <Feed posts={data} />
    </main>
  );
}
