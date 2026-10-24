"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { getProducts } from "@/lib/mockStore";

const T = { p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", green: "#e1fc9d", greenTxt: "#0f1f0f" };
const inputStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 14px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1, outline: "none", width: "100%", boxSizing: "border-box" };

function saveProducts(products) {
  if (typeof window !== "undefined") localStorage.setItem("trainity_products", JSON.stringify(products));
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState("course");
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ name: "", shortDesc: "", desc: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [kodeInput, setKodeInput] = useState("");
  const [toEdit, setToEdit] = useState(null);
  const [editName, setEditName] = useState("");
  const [editKode, setEditKode] = useState("");
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    const found = getProducts().find((p) => p._id === id);
    if (found) { setProduct(found); setForm({ name: found.name, shortDesc: found.shortDesc, desc: found.desc }); }
    else setMessage("Course not found.");
  }, [id]);

  const updateInStore = (updated) => {
    const all = getProducts().map((p) => (p._id === updated._id ? updated : p));
    saveProducts(all);
    setProduct(updated);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    updateInStore({ ...product, name: form.name, shortDesc: form.shortDesc, desc: form.desc });
    setMessage("✅ Course saved");
    setLoading(false);
  };

  const handleAddVideo = () => {
    if (!nameInput || !kodeInput || !product) { setMessage("Fill in lesson name & YouTube code."); return; }
    const newVid = { _id: `v-${Date.now()}`, namaPelajaran: nameInput, kodePelajaran: kodeInput };
    updateInStore({ ...product, video: [...product.video, newVid], kodePelajaranPertama: product.kodePelajaranPertama || newVid.kodePelajaran });
    setNameInput(""); setKodeInput("");
    setMessage("✅ Video added");
  };

  const handleUpdateVideo = () => {
    if (!toEdit || !product) return;
    updateInStore({ ...product, video: product.video.map((v) => v._id === toEdit._id ? { ...v, namaPelajaran: editName, kodePelajaran: editKode } : v) });
    setMessage("✅ Video updated"); setToEdit(null);
  };

  const handleDeleteVideo = () => {
    if (!toDelete || !product) return;
    const newVideos = product.video.filter((v) => v._id !== toDelete._id);
    updateInStore({ ...product, video: newVideos, kodePelajaranPertama: newVideos[0]?.kodePelajaran ?? "" });
    setMessage("🗑️ Video deleted"); setToDelete(null);
  };

  if (!product && !message) return (
    <div style={{ minHeight: "100vh", background: T.p3, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => router.push("/admin/produk")} style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, background: "none", border: "none", cursor: "pointer", marginBottom: "24px", padding: 0 }}>
          ← Back
        </button>

        <div>
          <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "22px", fontWeight: 400, color: T.t1, margin: "0 0 6px" }}>Edit Course</h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, margin: "0 0 20px" }}>{product?.name ?? "..."}</p>

          <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "4px", width: "fit-content" }}>
            {[["course","Course Info"],["video","Course Videos"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                style={{ padding: "7px 18px", borderRadius: "6px", border: "none", cursor: "pointer", fontFamily: "var(--font-inter)", fontSize: "13px", background: tab === k ? T.p3 : "transparent", color: tab === k ? T.t1 : T.t3 }}>
                {l}
              </button>
            ))}
          </div>

          {tab === "course" && (
            <form onSubmit={handleUpdateProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Course Name</label>
                <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Short Description</label>
                <input value={form.shortDesc} onChange={(e) => setForm((p) => ({ ...p, shortDesc: e.target.value }))} required style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Description</label>
                <textarea value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ alignSelf: "flex-start", background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "10px 20px", fontFamily: "var(--font-polysans)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {tab === "video" && product && (
            <div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Lesson Name" style={{ ...inputStyle, flex: "1", minWidth: "140px" }} />
                <input value={kodeInput} onChange={(e) => setKodeInput(e.target.value)} placeholder="YouTube Code" style={{ ...inputStyle, flex: "1", minWidth: "140px" }} />
                <button onClick={handleAddVideo}
                  style={{ background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "10px 16px", fontFamily: "var(--font-inter)", fontSize: "14px", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Add
                </button>
              </div>
              {product.video.length === 0 ? (
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3 }}>No videos yet.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                  {product.video.map((v) => (
                    <li key={v._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: T.p3, borderRadius: "8px", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: "0 0 2px" }}>{v.namaPelajaran}</p>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t3, margin: 0 }}>{v.kodePelajaran}</p>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => { setToEdit(v); setEditName(v.namaPelajaran); setEditKode(v.kodePelajaran); }}
                          style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "6px", padding: "4px 10px", fontFamily: "var(--font-inter)", fontSize: "12px", color: T.t2, cursor: "pointer" }}>Edit</button>
                        <button onClick={() => setToDelete(v)}
                          style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "4px 10px", fontFamily: "var(--font-inter)", fontSize: "12px", color: "#f87171", cursor: "pointer" }}>Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {message && <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "#86efac", marginTop: "16px" }}>{message}</p>}
        </div>
      </main>

      {toEdit && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "28px", width: "380px", maxWidth: "90vw" }}>
            <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "17px", fontWeight: 400, color: T.t1, margin: "0 0 16px" }}>Edit Video</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Lesson Name" style={inputStyle} />
              <input value={editKode} onChange={(e) => setEditKode(e.target.value)} placeholder="YouTube Code" style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setToEdit(null)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "8px 14px", fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleUpdateVideo} style={{ background: T.green, color: T.greenTxt, border: "none", borderRadius: "8px", padding: "8px 14px", fontFamily: "var(--font-polysans)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {toDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "28px", width: "360px", maxWidth: "90vw" }}>
            <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "17px", fontWeight: 400, color: T.t1, margin: "0 0 12px" }}>Delete This Video?</h3>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: "0 0 20px" }}>{toDelete.namaPelajaran} will be removed.</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setToDelete(null)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "8px 14px", fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t2, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleDeleteVideo} style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.5)", borderRadius: "8px", padding: "8px 14px", fontFamily: "var(--font-inter)", fontSize: "13px", color: "#f87171", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
