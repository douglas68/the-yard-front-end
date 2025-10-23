import { useEffect, useState } from "react";
import { getMe, getOrgs, updateUser } from "../api/client.js";
import { useNavigate } from "react-router-dom";

export default function EditProfile(){
  const nav = useNavigate();
  const userId = localStorage.getItem("userId");
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ fullName:"", email:"", organizationId:"", graduationYear:"", about:"" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try{
        const [{ user }, o] = await Promise.all([getMe(userId), getOrgs()]);
        setForm({
          fullName: user.fullName || "",
          email: user.email || "",
          organizationId: user.organizationId || "",
          graduationYear: user.graduationYear || "",
          about: user.about || "",
        });
        setOrgs(o.items || []);
      }catch(e){ setError(e.message); }
    })();
  }, [userId]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true); setError("");
    try{
      const payload = {
        fullName: form.fullName,
        email: form.email,
        organizationId: form.organizationId,
        about: form.about,
      };
      if (form.graduationYear) payload.graduationYear = Number(form.graduationYear);
      await updateUser(userId, payload);
      nav("/profile");
    }catch(e){ setError(e.message); }
    finally{ setSaving(false); }
  };

  return (
    <div className="container" style={{maxWidth:720, paddingTop:24}}>
      <div className="header-xl">Edit Profile</div>
      <form className="card stack" onSubmit={submit}>
        {error && <div style={{color:"#b91c1c"}}>{error}</div>}
        <div>
          <label className="label">Full name</label>
          <input className="input" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})}/>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        </div>
        <div>
          <label className="label">Organization</label>
          <select className="select" value={form.organizationId} onChange={e=>setForm({...form, organizationId:e.target.value})}>
            <option value="">Select organization…</option>
            {orgs.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
          </select>
        </div>
        <div className="grid grid-2">
          <div>
            <label className="label">Graduation Year</label>
            <input className="input" inputMode="numeric" value={form.graduationYear} onChange={e=>setForm({...form, graduationYear:e.target.value})}/>
          </div>
          <div>
            <label className="label">Role</label>
            <input className="input" value={form.role || ""} disabled/>
          </div>
        </div>
        <div>
          <label className="label">About</label>
          <textarea className="textarea" value={form.about} onChange={e=>setForm({...form, about:e.target.value})}/>
        </div>
        <div className="row" style={{justifyContent:"flex-end"}}>
          <button className="btn" disabled={saving}>{saving ? "Saving…" : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
}
