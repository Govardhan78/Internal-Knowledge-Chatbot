import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { getDocuments } from "../services/getDocuments.service";
import { uploadDocument } from "../services/document.service";

const Admin = () => {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const loadDocuments = async () => {
    try {
      const res = await getDocuments();
      setDocuments(res.documents);
    } catch {
      // silent
    }
  };

  useEffect(() => { loadDocuments(); }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);
    try {
      await uploadDocument(file);
      setUploadMsg({ type: "success", text: `"${file.name}" indexed successfully.` });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      loadDocuments();
    } catch {
      setUploadMsg({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-heading mb-1">Admin Dashboard</h2>
            <p className="text-sm text-muted">Manage and index knowledge base documents</p>
          </div>
          <div className="bg-surface border border-border rounded-xl px-5 py-3 text-center">
            <span className="block text-3xl font-bold text-accent">{documents.length}</span>
            <span className="text-[11px] text-muted uppercase tracking-wider">Documents</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Upload card */}
          <div className="bg-surface border border-border rounded-xl p-7">
            <h3 className="text-base font-semibold text-heading mb-1">Upload Document</h3>
            <p className="text-xs text-muted mb-5 leading-relaxed">
              PDF files only. The document will be split, embedded, and indexed into the vector store.
            </p>

            {/* Drop zone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-9 text-center cursor-pointer transition-all mb-4
                ${dragging
                  ? "border-accent bg-[rgba(108,99,255,0.08)]"
                  : file
                    ? "border-success bg-[rgba(62,207,142,0.05)]"
                    : "border-border hover:border-muted"
                }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              {file ? (
                <>
                  <div className="text-3xl mb-2">📄</div>
                  <p className="text-sm font-semibold text-success mb-0.5">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-2">☁️</div>
                  <p className="text-sm text-text font-medium mb-1">Drag & drop a PDF here</p>
                  <p className="text-xs text-muted">or click to browse</p>
                </>
              )}
            </div>

            {uploadMsg && (
              <div className={`px-4 py-2.5 rounded-lg text-sm mb-4
                ${uploadMsg.type === "success"
                  ? "bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.3)] text-success"
                  : "bg-[rgba(255,92,108,0.1)] border border-[rgba(255,92,108,0.3)] text-danger"
                }`}
              >
                {uploadMsg.type === "success" ? "✓ " : "✕ "}{uploadMsg.text}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors disabled:opacity-40"
            >
              {uploading ? "Indexing document..." : "Upload & Index"}
            </button>
          </div>

          {/* Documents list */}
          <div className="bg-surface border border-border rounded-xl p-7">
            <h3 className="text-base font-semibold text-heading mb-1">Indexed Documents</h3>
            <p className="text-xs text-muted mb-5 leading-relaxed">
              All documents currently in the knowledge base.
            </p>

            {documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted">
                <span className="text-4xl">📂</span>
                <p className="text-sm">No documents indexed yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <div key={doc._id} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface2 border border-border">
                    <span className="text-xl shrink-0">📄</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-heading truncate">{doc.fileName}</p>
                      <p className="text-[11px] text-muted mt-0.5">{doc.totalChunks} chunks · {formatDate(doc.createdAt)}</p>
                    </div>
                    <span className="text-[11px] px-2 py-1 rounded-full shrink-0 bg-[rgba(62,207,142,0.1)] border border-[rgba(62,207,142,0.3)] text-success font-semibold">
                      Indexed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
