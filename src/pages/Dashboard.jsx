import { useEffect, useMemo, useState } from "react";
import { getMe, getOrgs, listPosts, createPost, deletePost } from "../api/client.js";
import PostCard from "../components/PostCard.jsx";

export default function Dashboard(){
  const userId = localStorage.getItem("userId");
  const [me, setMe] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [text, setText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [{ user }, orgRes] = await Promise.all([getMe(userId), getOrgs()]);
        setMe(user);
        setOrgs(orgRes.items || []);
      } catch (e) { setError(e.message); }
    })();
  }, [userId]);

  const query = useMemo(() => {
    const q = [];
    if (selectedOrgId) q.push(`organizationId=${selectedOrgId}`);
    return q.length ? `?${q.join("&")}` : "";
  }, [selectedOrgId]);

  const loadPosts = async () => {
    setLoading(true);
    try { const data = await listPosts(query); setPosts(data.items || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPosts(); }, [query]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {

      await createPost({
        text: text.trim(),
        authorId: userId,
        organizationId: selectedOrgId || me?.organizationId
      });
      setText("");
      await loadPosts();
    } catch (e) { setError(e.message); }
    finally { setPosting(false); }
  };

  const onDelete = async (id) => {
    await deletePost(id, userId);
    setPosts(p => p.filter(x => x._id !== id));
  };

  return (
    <div className="container" style={{paddingTop:24}}>
      <div className="grid" style={{gridTemplateColumns:"1fr 320px"}}>
        <div className="stack">
          <div className="card stack">
            <div className="row" style={{justifyContent:"space-between"}}>
              <div className="row">
                <span className="label">Filter</span>
                <select className="select" value={selectedOrgId} onChange={e=>setSelectedOrgId(e.target.value)}>
                  <option value="">All Organizations</option>
                  {orgs.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
              </div>
            </div>
            <form className="stack" onSubmit={submit}>
              <label className="label">Create Post</label>
              <textarea className="textarea" placeholder="Share something…" value={text} onChange={e=>setText(e.target.value)} />
              <div className="row" style={{justifyContent:"flex-end"}}>
                <button className="btn" disabled={posting || !text.trim()}>{posting ? "Posting…" : "Post"}</button>
              </div>
            </form>
          </div>

          {error && <div className="card" style={{color:"#b91c1c"}}>{error}</div>}
          {loading ? <div className="card">Loading feed…</div> :
            <div className="feed">
              {posts.map(p => (
                <PostCard key={p._id} post={p} canDelete={p.authorId === userId} onDelete={() => onDelete(p._id)} />
              ))}
              {!posts.length && <div className="card">No posts yet.</div>}
            </div>
          }
        </div>

        <aside className="sidebar grid stack">
          <div className="card">
            <div className="header-md">Upcoming Events</div>
            <div className="meta">Add later. For now this is a placeholder card to match design.</div>
            <hr/>
            <div>Greek Week Kickoff – Aug 28 (Student Center)</div>
            <div className="meta" style={{marginTop:6}}>Charity Car Wash – Aug 30 (Main St Lot)</div>
          </div>
          <div className="card">
            <div className="header-md">You</div>
            {me ? (
              <>
                <div style={{fontWeight:700}}>{me.fullName}</div>
                <div className="meta">{me.email}</div>
              </>
            ) : <div className="meta">Loading…</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
