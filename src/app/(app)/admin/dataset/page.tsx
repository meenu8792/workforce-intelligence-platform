"use client";

import { useState, useRef } from "react";
import { useApp } from "@/lib/store";
import { SectionHeader, EmptyState } from "@/components/SectionHeader";
import { Database, Upload, FileSpreadsheet, FileJson, FileText, CheckCircle2, AlertCircle, Sparkles, Download, RefreshCcw, Eye, X } from "lucide-react";
import Papa from "papaparse";
import { Modal } from "@/components/Modal";
import { formatNumber } from "@/lib/utils";

type PreviewState = {
  fileName: string;
  rows: Record<string, unknown>[];
  columns: string[];
  duplicates: number;
  missing: number;
  valid: number;
};

export default function DatasetManagerPage() {
  const importDataset = useApp((s) => s.importDataset);
  const resetDataset = useApp((s) => s.resetDataset);
  const meta = useApp((s) => s.datasetMeta);
  const pushToast = useApp((s) => s.pushToast);

  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sampleCSV = `employeeId,name,email,department,designation,joiningDate,yearsOfExperience,location,salary,performanceScore,attendancePct,skills,shift,project,attritionRisk,status
EMP-2001,Aarav Mehta,aarav.mehta@nexora.com,Engineering,Senior Engineer,2022-03-14,5.4,Bengaluru,1450000,88,94,"React,Node.js,TypeScript",Morning,Helios CRM,Low,Active
EMP-2002,Priya Sharma,priya.sharma@nexora.com,Product,Product Manager,2021-08-22,7.1,Mumbai,1820000,91,96,"Product Strategy,Agile,SQL",Morning,Phoenix AI,Low,Active
EMP-2003,Rahul Verma,rahul.verma@nexora.com,Engineering,Tech Lead,2019-04-01,11.2,Hyderabad,2350000,84,89,"Java,Kubernetes,AWS",Evening,Atlas Migration,Medium,Active`;

  const parseFile = (file: File) => {
    setParsing(true);
    const name = file.name.toLowerCase();
    if (name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          const rows = Array.isArray(parsed) ? parsed : Array.isArray((parsed as any).data) ? (parsed as any).data : [parsed];
          computePreview(rows, file.name);
        } catch {
          pushToast({ message: "Invalid JSON file.", type: "error" });
          setParsing(false);
        }
      };
      reader.readAsText(file);
    } else {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const rows = res.data as Record<string, unknown>[];
          computePreview(rows, file.name);
        },
        error: () => {
          pushToast({ message: "Could not parse file. Please check the format.", type: "error" });
          setParsing(false);
        },
      });
    }
  };

  const computePreview = (rows: Record<string, unknown>[], fileName: string) => {
    const cols = rows[0] ? Object.keys(rows[0]) : [];
    const seen = new Set<string>();
    let dup = 0, miss = 0, valid = 0;
    for (const r of rows) {
      const id = String((r as any).employeeId ?? (r as any).employee_id ?? (r as any).id ?? "").trim();
      if (!id) { miss++; continue; }
      if (seen.has(id)) { dup++; continue; }
      seen.add(id);
      if (!(r as any).name) miss++;
      else valid++;
    }
    setPreview({ fileName, rows, columns: cols, duplicates: dup, missing: miss, valid });
    setShowPreview(true);
    setParsing(false);
  };

  const confirmImport = () => {
    if (!preview) return;
    importDataset(preview.rows, { fileName: preview.fileName, records: preview.rows.length, columns: preview.columns });
    setShowPreview(false);
    setPreview(null);
    pushToast({ message: `Dataset "${preview.fileName}" successfully imported.`, type: "success" });
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) parseFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) parseFile(f);
  };

  const downloadTemplate = () => {
    const blob = new Blob([sampleCSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "workforce_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Dataset Manager"
        description="Upload a real workforce dataset (CSV / XLSX / JSON). All dashboards will update from this single source."
        icon={<Database size={16} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`section-card lg:col-span-2 border-2 border-dashed ${drag ? "border-blue-500 bg-blue-500/5" : "border-[color:var(--border)]"} transition cursor-pointer`}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".csv,.json,.xlsx,.xls" className="hidden" onChange={onFile} />
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
              <Upload size={28} />
            </div>
            <h3 className="text-lg font-semibold mb-1">Drop your dataset here</h3>
            <p className="text-sm text-[color:var(--text-muted)] max-w-md">or click to browse — supports CSV, XLSX and JSON files. Columns are mapped automatically.</p>
            <div className="flex items-center gap-2 mt-5">
              <span className="tag"><FileText size={12} /> CSV</span>
              <span className="tag"><FileSpreadsheet size={12} /> XLSX</span>
              <span className="tag"><FileJson size={12} /> JSON</span>
            </div>
            {parsing && <p className="mt-4 text-sm text-blue-500">Parsing file…</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="section-card">
            <h3 className="font-semibold mb-3">Current Dataset</h3>
            {meta ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">File</span><span className="font-medium text-xs truncate max-w-[160px]">{meta.fileName}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Records</span><span className="font-medium">{formatNumber(meta.records)}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Valid</span><span className="font-medium text-emerald-500">{formatNumber(meta.validRecords)}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Duplicates</span><span className="font-medium text-amber-500">{meta.duplicates}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Missing</span><span className="font-medium text-rose-500">{meta.missing}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">Updated</span><span className="font-medium text-xs">{new Date(meta.uploadedOn).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[color:var(--text-muted)]">By</span><span className="font-medium text-xs">{meta.uploadedBy}</span></div>
              </div>
            ) : <p className="text-sm text-[color:var(--text-muted)]">No dataset loaded.</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={resetDataset} className="btn btn-secondary flex-1 !text-sm"><RefreshCcw size={14} /> Reset to demo</button>
              <button onClick={downloadTemplate} className="btn btn-ghost !text-sm"><Download size={14} /> Template</button>
            </div>
          </div>

          <div className="section-card">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><Sparkles size={14} className="text-violet-500" /> Intelligent mapping</h3>
            <p className="text-xs text-[color:var(--text-muted)] leading-relaxed">
              The system automatically recognises common column names (Employee ID, Name, Department, Salary, Attendance, Skills, etc.) and maps them to the central data model — even if your headers are different.
            </p>
            <p className="text-xs text-[color:var(--text-muted)] mt-2">If a column is missing, the relevant analytics are gracefully disabled rather than fabricated.</p>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3 className="font-semibold mb-2">Sample CSV template</h3>
        <p className="text-xs text-[color:var(--text-muted)] mb-3">Download the template to see the supported fields.</p>
        <pre className="text-[11px] bg-[color:var(--bg-soft)] p-3 rounded-lg overflow-x-auto">{sampleCSV}</pre>
      </div>

      <Modal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        title="Dataset Preview & Validation"
        size="xl"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowPreview(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={confirmImport}><CheckCircle2 size={16} /> Confirm Import</button>
          </>
        }
      >
        {preview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Records" value={preview.rows.length} color="blue" />
              <StatCard label="Valid" value={preview.valid} color="green" />
              <StatCard label="Duplicates" value={preview.duplicates} color="amber" />
              <StatCard label="Missing" value={preview.missing} color="rose" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-semibold mb-1.5">Detected columns ({preview.columns.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {preview.columns.map((c) => (<span key={c} className="tag">{c}</span>))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-[color:var(--text-muted)] font-semibold mb-1.5">First 5 records</div>
              <div className="overflow-x-auto rounded-lg border border-[color:var(--border)]">
                <table className="table">
                  <thead>
                    <tr>{preview.columns.slice(0, 8).map((c) => <th key={c}>{c}</th>)}</tr>
                  </thead>
                  <tbody>
                    {preview.rows.slice(0, 5).map((r, i) => (
                      <tr key={i}>
                        {preview.columns.slice(0, 8).map((c) => (
                          <td key={c} className="truncate max-w-[160px]">{String((r as Record<string, unknown>)[c] ?? "—")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {preview.missing > 0 || preview.duplicates > 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-sm text-amber-500 flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium">Some analytics may be limited.</div>
                  <div className="text-xs opacity-90">Missing or duplicate records will be skipped during import. Imported data will only reflect valid records.</div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: "blue" | "green" | "amber" | "rose" }) {
  const map = { blue: "from-blue-500/15 to-blue-500/0 text-blue-500", green: "from-emerald-500/15 to-emerald-500/0 text-emerald-500", amber: "from-amber-500/15 to-amber-500/0 text-amber-500", rose: "from-rose-500/15 to-rose-500/0 text-rose-500" } as const;
  return (
    <div className={`kpi-card`}>
      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${map[color]} flex items-center justify-center mb-2`}><Eye size={16} /></div>
      <div className="text-xs text-[color:var(--text-muted)] uppercase tracking-wider font-medium">{label}</div>
      <div className="text-2xl font-bold mt-1">{formatNumber(value)}</div>
    </div>
  );
}
