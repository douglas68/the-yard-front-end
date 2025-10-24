import { useEffect, useState } from "react";
import { createUser, getOrgs, findUserByEmail } from "../api/client.js";
import { useNavigate } from "react-router-dom";

export default function Auth(){
  const nav = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({ fullName:"", email:"", password:"", organizationId:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { getOrgs().then(d => setOrgs(d.items || [])).catch(e=>setError(e.message)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try{
      const { user } = await createUser(form);
      localStorage.setItem("userId", user._id);
      nav("/dashboard");
    }catch(err){ setError(err.message); }
    finally{ setLoading(false); }
  };

const quickUseExisting = async (e) => {
  e.preventDefault();
  const email = prompt("Enter your email:");
  if (!email) return;
  try {
    const { user } = await findUserByEmail(email);
    localStorage.setItem("userId", user._id);
    nav("/dashboard");
  } catch (err) {
    alert(err.message || "User not found");
  }
};

  return (
    <div className="container" style={{maxWidth:520, paddingTop:40}}>
      <h1 className="header-xl">Create Profile</h1>
      <p className="meta" style={{marginBottom:16}}>Create a profile to continue.</p>
      <form className="stack card" onSubmit={submit}>
        {error && <div style={{color:"#b91c1c"}}>{error}</div>}
        <div>
          <label className="label">Full name</label>
          <input className="input" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} required/>
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        </div>
        <div>
          <label className="label">Organization</label>
          <select className="select" value={form.organizationId} onChange={e=>setForm({...form, organizationId:e.target.value})} required>
            <option value="">Select organization…</option>
            {orgs.map(o => <option key={o._id} value={o._id}>{o.name} ({o.letters})</option>)}
          </select>
        </div>
        <div className="row" style={{justifyContent:"space-between", marginTop:8}}>
          <button className="btn" disabled={loading}>{loading ? "Creating…" : "Continue"}</button>
          <button className="btn" type="button" onClick={quickUseExisting} style={{background:"#6b7280"}}>Use Existing ID</button>
        </div>
      </form>
    </div>
  );
}
