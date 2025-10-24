import { Link } from "react-router-dom";

export default function PostCard({ post, canDelete, onDelete }) {
  const when = new Date(post.createdAt).toLocaleString();

  const authorName = post.authorId?.fullName || "Unknown";
  const orgId   = post.organizationId?._id || post.organizationId;
  const orgName = post.organizationId?.name || "";

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="row" style={{ gap: 8 }}>
          <strong>{authorName}</strong>
          {orgId && (
            <>
              <span className="meta">•</span>
              <Link className="badge" to={`/orgs/${orgId}`}>{orgName || "Org"}</Link>
            </>
          )}
          <span className="meta">• {when}</span>
        </div>
        {canDelete && (
          <button className="btn" onClick={onDelete} style={{ background: "#b91c1c" }}>
            Delete
          </button>
        )}
      </div>

      <div style={{ marginTop: 10, lineHeight: 1.5 }}>{post.text}</div>

      {post.picture && (
        <img
          src={post.picture}
          alt=""
          style={{ marginTop: 10, width: "100%", borderRadius: 12 }}
        />
      )}
    </div>
  );
}
