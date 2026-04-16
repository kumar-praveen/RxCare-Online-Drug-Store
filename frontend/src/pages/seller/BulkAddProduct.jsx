import React, { useState, useRef } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  Upload,
  FileSpreadsheet,
  ImagePlus,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Info,
} from "lucide-react";

// ── CSV Template Data ──────────────────────────────────────────────────────
const CSV_TEMPLATE = `name,description,category,price,offerPrice,inStock,images
Paracetamol 500mg,Used for fever relief|500mg strength|Take with water,pain-relief,50,40,true,paracetamol.jpg
Vitamin C Tablets,Boosts immunity|500mg per tablet|One daily,vitamins,120,99,true,vitaminc.jpg`;

const FIELD_INFO = [
  {
    field: "name",
    desc: "Product name",
    required: true,
    example: "Paracetamol 500mg",
  },
  {
    field: "description",
    desc: "Bullet points separated by |",
    required: true,
    example: "Used for fever|Take with water",
  },
  {
    field: "category",
    desc: "Must match your category paths",
    required: true,
    example: "pain-relief",
  },
  {
    field: "price",
    desc: "Original MRP price",
    required: true,
    example: "100",
  },
  {
    field: "offerPrice",
    desc: "Discounted selling price",
    required: true,
    example: "85",
  },
  { field: "inStock", desc: "true or false", required: false, example: "true" },
  {
    field: "images",
    desc: "Image filenames separated by | (must match uploaded files)",
    required: true,
    example: "img1.jpg|img2.jpg",
  },
];

const BulkAddProduct = () => {
  const { axios, fetchProducts } = useAppContext();

  const [csvFile, setCsvFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { success, message, invalid? }
  const [previewData, setPreviewData] = useState([]); // CSV preview rows

  const csvRef = useRef();
  const imgRef = useRef();

  // ── Download CSV Template ────────────────────────────────────────────────
  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rxcare_bulk_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Parse CSV for Preview ────────────────────────────────────────────────
  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a valid .csv file");
      return;
    }
    setCsvFile(file);
    setResult(null);

    // Read & preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        return headers.reduce((acc, h, i) => {
          acc[h] = values[i] || "";
          return acc;
        }, {});
      });
      setPreviewData(rows.slice(0, 5)); // preview first 5 rows
    };
    reader.readAsText(file);
  };

  // ── Handle Image Upload ──────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const valid = files.filter((f) => imageTypes.includes(f.type));
    if (valid.length !== files.length) {
      toast.error("Only JPG, PNG, WEBP images are allowed");
    }
    setImageFiles((prev) => {
      const existing = prev.map((f) => f.name);
      const newFiles = valid.filter((f) => !existing.includes(f.name));
      return [...prev, ...newFiles];
    });
  };

  const removeImage = (name) => {
    setImageFiles((prev) => prev.filter((f) => f.name !== name));
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csvFile) return toast.error("Please upload a CSV file");
    if (imageFiles.length === 0)
      return toast.error("Please upload at least one product image");

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      formData.append("csv", csvFile);
      imageFiles.forEach((file) => formData.append("images", file));

      const { data } = await axios.post("/api/product/bulk-add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(data);
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        setCsvFile(null);
        setImageFiles([]);
        setPreviewData([]);
        if (csvRef.current) csvRef.current.value = "";
        if (imgRef.current) imgRef.current.value = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Bulk Upload Products
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Upload multiple products at once using a CSV file and product images
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left: Instructions ────────────────────────────────────── */}
        <div className="xl:col-span-1 flex flex-col gap-5">
          {/* Step Guide */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              How to Bulk Upload
            </h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  step: "1",
                  title: "Download Template",
                  desc: "Download the CSV template and fill in your product details",
                  color: "bg-blue-500",
                },
                {
                  step: "2",
                  title: "Fill CSV Data",
                  desc: "Each row = one product. Use | to separate multiple values",
                  color: "bg-purple-500",
                },
                {
                  step: "3",
                  title: "Upload Images",
                  desc: "Upload product images. Filenames must match what you put in CSV",
                  color: "bg-orange-500",
                },
                {
                  step: "4",
                  title: "Submit",
                  desc: "Upload CSV + images together and all products will be added",
                  color: "bg-green-500",
                },
              ].map((s, idx) => (
                <div key={idx} className="flex gap-3">
                  <div
                    className={`${s.color} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}
                  >
                    {s.step}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Template */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-gray-800">CSV Template</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Download the template, fill in your data, and upload it back.
            </p>
            <button
              onClick={downloadTemplate}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dull transition"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
          </div>

          {/* CSV Field Reference */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">
              CSV Field Reference
            </h2>
            <div className="flex flex-col gap-3">
              {FIELD_INFO.map((f, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono text-primary">
                      {f.field}
                    </code>
                    {f.required && (
                      <span className="text-[10px] text-red-500 font-semibold">
                        required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                  <p className="text-[10px] text-gray-300 font-mono">
                    e.g. {f.example}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Upload Form ────────────────────────────────────── */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-6"
          >
            {/* CSV Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <FileSpreadsheet className="w-4 h-4 text-primary" />
                Upload CSV File
              </label>
              <div
                onClick={() => csvRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  csvFile
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/40 bg-gray-50"
                }`}
              >
                <input
                  ref={csvRef}
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleCsvChange}
                />
                {csvFile ? (
                  <>
                    <CheckCircle className="w-10 h-10 text-primary" />
                    <p className="text-sm font-semibold text-primary">
                      {csvFile.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(csvFile.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCsvFile(null);
                        setPreviewData([]);
                        if (csvRef.current) csvRef.current.value = "";
                      }}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-gray-300" />
                    <p className="text-sm text-gray-500 font-medium">
                      Click to upload CSV file
                    </p>
                    <p className="text-xs text-gray-400">Only .csv files</p>
                  </>
                )}
              </div>
            </div>

            {/* CSV Preview */}
            {previewData.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  CSV Preview (first {previewData.length} rows)
                </p>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(previewData[0]).map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {previewData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {Object.values(row).map((val, i) => (
                            <td
                              key={i}
                              className="px-3 py-2 text-gray-500 max-w-[120px] truncate"
                            >
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <ImagePlus className="w-4 h-4 text-primary" />
                Upload Product Images
              </label>
              <p className="text-xs text-gray-400 mb-3">
                Filenames must exactly match what you wrote in the CSV{" "}
                <code className="bg-gray-100 px-1 rounded">images</code> column
              </p>
              <div
                onClick={() => imgRef.current?.click()}
                className="border-2 border-dashed border-gray-200 hover:border-primary/40 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer bg-gray-50 transition-all"
              >
                <input
                  ref={imgRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
                <ImagePlus className="w-8 h-8 text-gray-300" />
                <p className="text-sm text-gray-500 font-medium">
                  Click to upload images
                </p>
                <p className="text-xs text-gray-400">
                  JPG, PNG, WEBP • Multiple files allowed
                </p>
              </div>

              {/* Image File List */}
              {imageFiles.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-500">
                    {imageFiles.length} image
                    {imageFiles.length !== 1 ? "s" : ""} selected
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                    {imageFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-8 h-8 object-cover rounded-lg shrink-0"
                        />
                        <p className="text-[11px] text-gray-600 truncate flex-1 font-mono">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeImage(file.name)}
                          className="text-gray-300 hover:text-red-400 transition shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Result Message */}
            {result && (
              <div
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
                  result.success
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {result.success ? (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{result.message}</p>
                  {result.invalid && result.invalid.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Failed products:
                      </p>
                      <ul className="list-disc ml-4 mt-1 text-xs">
                        {result.invalid.map((name, i) => (
                          <li key={i}>{name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !csvFile || imageFiles.length === 0}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all ${
                loading || !csvFile || imageFiles.length === 0
                  ? "bg-primary/50 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dull cursor-pointer"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Uploading Products...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload{" "}
                  {previewData.length > 0
                    ? `${previewData.length}+ Products`
                    : "Products"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BulkAddProduct;
