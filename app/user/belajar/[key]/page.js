"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppNav from "@/components/AppNav";
import { useSession } from "@/lib/mockAuth";
import { getProductByName, isProductOwned, updateLastWatched, getOwnedByUser } from "@/lib/mockStore";

const T = { p1: "#293c2d", p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", orange: "#ff682c", green: "#e1fc9d", greenTxt: "#0f1f0f" };

export default function BelajarPage() {
  const params = useParams();
  const key = decodeURIComponent(params.key);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) { setForbidden(true); setLoading(false); return; }

    const prod = getProductByName(key);
    if (!prod) { setLoading(false); return; }

    if (!isProductOwned(session.user.id, prod._id)) { setForbidden(true); setLoading(false); return; }

    setProduct(prod);
    const ups = getOwnedByUser(session.user.id);
    const up = ups.find((u) => u.productId === prod._id);
    const lastVid = prod.video.find((v) => v._id === up?.lastWatchedVideoId);
    setSelectedVideo(lastVid ?? prod.video[0] ?? null);
    setLoading(false);
  }, [key, status, session]);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (session?.user && product) updateLastWatched(session.user.id, product._id, video._id);
  };

  if (loading) return <div style={{ minHeight: "100vh", background: T.p3, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: T.t3, fontFamily: "var(--font-inter)" }}>Loading course...</p></div>;

  if (forbidden) return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "600px", margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "22px", fontWeight: 400, color: T.t1, margin: "0 0 12px" }}>Access Denied</h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: T.t2, marginBottom: "24px" }}>You need to enroll in this course before you can access it.</p>
          <Link href="/produk" style={{ display: "inline-block", background: T.green, color: T.greenTxt, borderRadius: "8px", padding: "10px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", textDecoration: "none", fontWeight: 600 }}>
            Browse Courses
          </Link>
        </div>
      </main>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "600px", margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-inter)", color: T.t2 }}>Course not found.</p>
      </main>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <button onClick={() => router.back()} style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, background: "none", border: "none", cursor: "pointer", marginBottom: "24px", padding: 0 }}>
          ← Back
        </button>

        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: "12px", overflow: "hidden", background: "#000", marginBottom: "24px" }}>
          {selectedVideo ? (
            <iframe
              key={selectedVideo._id}
              src={`https://www.youtube.com/embed/${selectedVideo.kodePelajaran}?autoplay=1&modestbranding=1&rel=0`}
              title={selectedVideo.namaPelajaran}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "var(--font-inter)", color: T.t3 }}>Select a video to play</p>
            </div>
          )}
        </div>

        <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "20px", fontWeight: 400, color: T.t1, margin: "0 0 8px" }}>
            {product.name} — {selectedVideo?.namaPelajaran}
          </h1>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, margin: 0, lineHeight: 1.6 }}>{product.desc}</p>
        </div>

        <div style={{ background: T.p2, border: `1px solid ${T.border}`, borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-polysans)", fontSize: "16px", fontWeight: 400, color: T.t1, margin: "0 0 16px" }}>Playlist</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
            {product.video.map((video) => (
              <div
                key={video._id}
                onClick={() => handleSelectVideo(video)}
                style={{ cursor: "pointer", borderRadius: "8px", overflow: "hidden", border: `1px solid ${selectedVideo?._id === video._id ? T.green : T.border}`, background: selectedVideo?._id === video._id ? "rgba(225,252,157,0.08)" : T.p1 }}
              >
                <div style={{ position: "relative", paddingTop: "56.25%" }}>
                  <img src={`https://i.ytimg.com/vi/${video.kodePelajaran}/hq720.jpg`} alt={video.namaPelajaran} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: selectedVideo?._id === video._id ? T.green : T.t2, padding: "8px", margin: 0, lineHeight: 1.4 }}>
                  {video.namaPelajaran}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
