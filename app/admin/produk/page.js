"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { getProducts, addProduct, deleteProduct } from "@/lib/mockStore";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };
const inputStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1, outline: "none", width: "100%", boxSizing: "border-box" };

export default function ProductsPage() {
  const [tab, setTab] = useState("create");
  const [products, setProducts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [form, setForm] = useState({ name: "", shortDesc: "", desc: "" });
  const [videoForm, setVideoForm] = useState({ namaPelajaran: "", kodePelajaran: "" });
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = () => setProducts(getProducts());
  useEffect(() => { refresh(); }, []);

  const addVideoTemp = () => {
    const { namaPelajaran, kodePelajaran } = videoForm;
    if (!namaPelajaran || !kodePelajaran) return;
    setVideos([...videos, { id: Date.now(), namaPelajaran, kodePelajaran }]);
    setVideoForm({ namaPelajaran: "", kodePelajaran: "" });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.shortDesc) return;
    const newVideos = videos.map((v, i) => ({ _id: `v-new-${Date.now()}-${i}`, namaPelajaran: v.namaPelajaran, kodePelajaran: v.kodePelajaran }));
    addProduct({ name: form.name, shortDesc: form.shortDesc, desc: form.desc, video: newVideos, kodePelajaranPertama: newVideos[0]?.kodePelajaran ?? "", price: 0 });
    setForm({ name: "", shortDesc: "", desc: "" });
    setVideos([]);
    refresh();
    setTab("list");
  };

  const handleDelete = () => {
    if (!toDelete) return;
    setLoading(true);
    deleteProduct(toDelete._id);
    refresh();
    setLoading(false);
    setToDelete(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "28px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: "0 0 6px" }}>Course Management</h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, margin: "0 0 28px" }}>Add, edit, and manage Trainity courses.</p>

        <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "4px", width: "fit-content" }}>
          {[["create","Add Course"],["list","Course List"]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "14px", background: tab === key ? T.p2 : "transparent", color: tab === key ? T.t1 : T.t3, transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "create" && (
          <div style={{ padding: "8px 0" }}>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Course Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Course name" required style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Short Description</label>
                <input value={form.shortDesc} onChange={(e) => setForm((p) => ({ ...p, shortDesc: e.target.value }))} placeholder="Short description" required style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Description</label>
                <textarea value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} placeholder="Full course description" rows={4}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "16px" }}>
                <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 400, color: T.t1, margin: "0 0 12px" }}>Add Video</h3>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <input value={videoForm.namaPelajaran} onChange={(e) => setVideoForm((p) => ({ ...p, namaPelajaran: e.target.value }))} placeholder="Lesson Name" style={{ ...inputStyle, flex: "1", minWidth: "140px" }} />
                  <input value={videoForm.kodePelajaran} onChange={(e) => setVideoForm((p) => ({ ...p, kodePelajaran: e.target.value }))} placeholder="YouTube Code (e.g. dQw4w9WgXcQ)" style={{ ...inputStyle, flex: "1", minWidth: "140px" }} />
                  <button type="button" onClick={addVideoTemp}
                    style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, cursor: "pointer", whiteSpace: "nowrap" }}>
                    + Add
                  </button>
                </div>
                {videos.length > 0 && (
                  <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {videos.map((v) => (
                      <li key={v.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", fontFamily: "var(--font-inter)", fontSize: "13px" }}>
                        <span style={{ color: T.t2 }}>{v.namaPelajaran}</span>
                        <span style={{ color: T.t3 }}>{v.kodePelajaran}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button type="submit"
                style={{ alignSelf: "flex-start", background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "10px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Save Course
              </button>
            </form>
          </div>
        )}

        {tab === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>No courses yet.</p>
              </div>
            ) : products.map((p) => (
              <div key={p._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.border}`, padding: "14px 0", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "15px", fontWeight: 400, color: T.t1, margin: "0 0 4px" }}>{p.name}</h3>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, margin: 0 }}>{p.video.length} video</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href={`/admin/produk/${p._id}`} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "6px", padding: "6px 14px", fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2, textDecoration: "none" }}>Edit</Link>
                  <button onClick={() => setToDelete(p)} style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "6px 14px", fontFamily: "var(--font-inter)", fontSize: "13px", color: "#f87171", cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {toDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "32px", width: "380px", maxWidth: "90vw" }}>
            <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "18px", fontWeight: 400, color: T.t1, margin: "0 0 12px" }}>Delete This Course?</h3>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: "0 0 24px" }}>{toDelete.name} will be removed.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setToDelete(null)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "8px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDelete} disabled={loading} style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.5)", borderRadius: "8px", padding: "8px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", color: "#f87171", cursor: "pointer" }}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
