import { useEffect, useState } from "react";
import { getMe, listPosts, deletePost } from "../api/client.js";
import PostCard from "../components/PostCard.jsx";

export default function Profile(){
  const userId = localStorage.getItem("userId");
  const [me, setMe] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ user }, feed] = await Promise.all([
        getMe(userId),
        listPosts(`?authorId=${userId}`)
      ]);
      setMe(user); setPosts(feed.items || []); setLoading(false);
    })();
  }, [userId]);

  const onDelete = async (id) => {
    await deletePost(id, userId);
    setPosts(p => p.filter(x => x._id !== id));
  };

  return (
    <div className="container" style={{paddingTop:24}}>
      {!me ? <div className="card">Loading…</div> : (
        <>
          <div className="card">
            <div className="header-xl">{me.fullName}</div>
            {/* <div className="meta">{me.graduationYear}</div> */}
            <div className="meta">{me.email}</div>
            <div className="meta" style={{marginTop:6}}>Role: {me.role}</div>
          </div>
          <div className="header-md" style={{marginTop:16}}>My Posts</div>
          {loading ? <div className="card">Loading posts…</div> :
            (posts.length ? posts.map(p =>
              <PostCard key={p._id} post={p} canDelete={true} onDelete={() => onDelete(p._id)} />
            ) : <div className="card">You haven’t posted yet.</div>)
          }
        </>
      )}
    </div>
  );
}
