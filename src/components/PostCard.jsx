export default function PostCard({ post, canDelete, onDelete }){
  const when = new Date(post.createdAt).toLocaleString();
  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between"}}>
        <div className="row">
          <div className="badge">{post.organizationId?.name || "Org"}</div>
          <span className="meta">• {when}</span>
        </div>
        {canDelete && <button className="btn" onClick={onDelete} style={{background:"#b91c1c"}}>Delete</button>}
      </div>
      <div style={{marginTop:10, lineHeight:1.5}}>{post.text}</div>
      {post.picture && <img src={post.picture} alt="" style={{marginTop:10, width:"100%", borderRadius:12}}/>}
    </div>
  );
}
