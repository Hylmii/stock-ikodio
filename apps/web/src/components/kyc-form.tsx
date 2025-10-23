"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  MapPin,
  Building2,
  CreditCard,
  Upload,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Shield,
  Landmark,
  TrendingUp,
  X,
} from "lucide-react";

interface KYCFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userEmail?: string;
}

export function KYCForm({
  isOpen,
  onClose,
  onComplete,
  userEmail = "",
}: KYCFormProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    // Step 1: Data Pribadi
    fullName: "",
    email: userEmail,
    phone: "",
    password: "",
    birthDate: "",
    gender: "",
    citizenship: "WNI",

    // Step 2: Data Identitas
    nik: "",
    ktpPhoto: null as File | null,
    selfiePhoto: null as File | null,
    address: "",
    postalCode: "",
    province: "",
    city: "",
    district: "",
    subDistrict: "",

    // Step 3: Data Keuangan
    bankName: "",
    accountNumber: "",
    npwp: "",
    fundSource: "",
    monthlyIncome: "",
    investmentGoal: "",

    // Step 4: Profil Risiko
    investmentDuration: "",
    riskReaction: "",
    investmentPurpose: "",
    knowledgeLevel: "",

    // Step 5: Dokumen Tambahan
    incomeProof: null as File | null,
    signature: "",
    referralCode: "",

    // Step 6: Keamanan
    securityQuestion: "",
    securityAnswer: "",
    transactionPin: "",
  });

  const steps = [
    { title: "Data Pribadi", icon: User },
    { title: "Identitas Resmi", icon: FileText },
    { title: "Data Keuangan", icon: Landmark },
    { title: "Profil Risiko", icon: TrendingUp },
    { title: "Dokumen", icon: Upload },
    { title: "Keamanan", icon: Shield },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete KYC
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/[0.08] rounded-3xl shadow-2xl my-8"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="border-b border-white/[0.06] px-10 py-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-medium text-white mb-2 tracking-tight">
                      Verifikasi Akun
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Lengkapi data untuk aktivasi trading
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2.5 text-zinc-500 hover:text-white transition-colors rounded-full hover:bg-white/[0.03]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-3">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                      <React.Fragment key={index}>
                        <div className="flex flex-col items-center flex-1 gap-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "bg-white text-black"
                                : isActive
                                  ? "bg-white text-black ring-4 ring-white/10"
                                  : "bg-white/[0.03] text-zinc-600 border border-white/[0.08]"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <span
                            className={`text-xs text-center transition-colors ${
                              isActive
                                ? "text-white font-medium"
                                : isCompleted
                                  ? "text-zinc-400"
                                  : "text-zinc-600"
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div
                            className={`h-[2px] flex-1 mb-10 transition-all duration-500 ${
                              isCompleted ? "bg-white" : "bg-white/[0.08]"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="px-10 py-8 max-h-[65vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {/* Step 1: Data Pribadi */}
                    {currentStep === 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-medium text-white mb-6">
                          Data Pribadi Dasar
                        </h3>

                        <div className="grid grid-cols-2 gap-5">
                          <div className="col-span-2">
                            <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                              Nama Lengkap (sesuai KTP) *
                            </label>
                            <input
                              type="text"
                              value={formData.fullName}
                              onChange={e =>
                                handleChange("fullName", e.target.value)
                              }
                              placeholder="Hylmi Rafif Rabbani"
                              className="w-full px-4 py-3.5 bg-[#0F0F0F] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                              Email Aktif *
                            </label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={e =>
                                handleChange("email", e.target.value)
                              }
                              placeholder="hylmi@email.com"
                              className="w-full px-4 py-3.5 bg-[#0F0F0F] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                              Nomor HP (WhatsApp) *
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={e =>
                                handleChange("phone", e.target.value)
                              }
                              placeholder="+62 812 3456 7890"
                              className="w-full px-4 py-3.5 bg-[#0F0F0F] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                              Tanggal Lahir *
                            </label>
                            <input
                              type="date"
                              value={formData.birthDate}
                              onChange={e =>
                                handleChange("birthDate", e.target.value)
                              }
                              placeholder="dd/mm/yyyy"
                              className="w-full px-4 py-3.5 bg-[#0F0F0F] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                              Jenis Kelamin *
                            </label>
                            <select
                              value={formData.gender}
                              onChange={e =>
                                handleChange("gender", e.target.value)
                              }
                              className="w-full px-4 py-3.5 bg-[#0F0F0F] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A1A1AA' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 1rem center",
                              }}
                            >
                              <option value="">Pilih</option>
                              <option value="male">Laki-laki</option>
                              <option value="female">Perempuan</option>
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm font-normal text-zinc-400 mb-2.5">
                              Kewarganegaraan *
                            </label>
                            <select
                              value={formData.citizenship}
                              onChange={e =>
                                handleChange("citizenship", e.target.value)
                              }
                              className="w-full px-4 py-3.5 bg-[#0F0F0F] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23A1A1AA' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 1rem center",
                              }}
                            >
                              <option value="WNI">
                                WNI (Warga Negara Indonesia)
                              </option>
                              <option value="WNA">
                                WNA (Warga Negara Asing)
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Data Identitas */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white mb-4">
                          Data Identitas Resmi (KYC Level 1)
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-sm text-zinc-400 mb-2">
                              Nomor KTP / NIK *
                            </label>
                            <input
                              type="text"
                              value={formData.nik}
                              onChange={e =>
                                handleChange("nik", e.target.value)
                              }
                              placeholder="3578xxxxxxxxxxxx"
                              maxLength={16}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Upload Foto KTP *
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e =>
                                  handleFileUpload(
                                    "ktpPhoto",
                                    e.target.files?.[0] || null
                                  )
                                }
                                className="hidden"
                                id="ktp-upload"
                              />
                              <label
                                htmlFor="ktp-upload"
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:bg-white/10 cursor-pointer transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">
                                  {formData.ktpPhoto
                                    ? formData.ktpPhoto.name
                                    : "Pilih File"}
                                </span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Selfie dengan KTP *
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                capture="user"
                                onChange={e =>
                                  handleFileUpload(
                                    "selfiePhoto",
                                    e.target.files?.[0] || null
                                  )
                                }
                                className="hidden"
                                id="selfie-upload"
                              />
                              <label
                                htmlFor="selfie-upload"
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:bg-white/10 cursor-pointer transition-colors"
                              >
                                <Camera className="w-4 h-4" />
                                <span className="text-sm">
                                  {formData.selfiePhoto
                                    ? formData.selfiePhoto.name
                                    : "Ambil Foto"}
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm text-zinc-400 mb-2">
                              Alamat Lengkap (sesuai KTP) *
                            </label>
                            <textarea
                              value={formData.address}
                              onChange={e =>
                                handleChange("address", e.target.value)
                              }
                              placeholder="Jl. Mawar No. 10, Surabaya"
                              rows={3}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Kode Pos *
                            </label>
                            <input
                              type="text"
                              value={formData.postalCode}
                              onChange={e =>
                                handleChange("postalCode", e.target.value)
                              }
                              placeholder="60111"
                              maxLength={5}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Provinsi *
                            </label>
                            <input
                              type="text"
                              value={formData.province}
                              onChange={e =>
                                handleChange("province", e.target.value)
                              }
                              placeholder="Jawa Timur"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Kota *
                            </label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={e =>
                                handleChange("city", e.target.value)
                              }
                              placeholder="Surabaya"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Kecamatan *
                            </label>
                            <input
                              type="text"
                              value={formData.district}
                              onChange={e =>
                                handleChange("district", e.target.value)
                              }
                              placeholder="Genteng"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Data Keuangan */}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white mb-4">
                          Data Keuangan & Rekening
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Nama Bank *
                            </label>
                            <select
                              value={formData.bankName}
                              onChange={e =>
                                handleChange("bankName", e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20"
                            >
                              <option value="">Pilih Bank</option>
                              <option value="BCA">BCA</option>
                              <option value="Mandiri">Mandiri</option>
                              <option value="BNI">BNI</option>
                              <option value="BRI">BRI</option>
                              <option value="CIMB">CIMB Niaga</option>
                              <option value="Permata">Permata</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Nomor Rekening *
                            </label>
                            <input
                              type="text"
                              value={formData.accountNumber}
                              onChange={e =>
                                handleChange("accountNumber", e.target.value)
                              }
                              placeholder="1234567890"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm text-zinc-400 mb-2">
                              NPWP (Opsional)
                            </label>
                            <input
                              type="text"
                              value={formData.npwp}
                              onChange={e =>
                                handleChange("npwp", e.target.value)
                              }
                              placeholder="09.123.456.7-890.000"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Sumber Dana *
                            </label>
                            <select
                              value={formData.fundSource}
                              onChange={e =>
                                handleChange("fundSource", e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20"
                            >
                              <option value="">Pilih</option>
                              <option value="salary">Gaji</option>
                              <option value="business">Bisnis</option>
                              <option value="investment">Investasi</option>
                              <option value="inheritance">Warisan</option>
                              <option value="other">Lainnya</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Pendapatan Bulanan *
                            </label>
                            <select
                              value={formData.monthlyIncome}
                              onChange={e =>
                                handleChange("monthlyIncome", e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20"
                            >
                              <option value="">Pilih</option>
                              <option value="<5jt">{"< 5 juta"}</option>
                              <option value="5-10jt">5 - 10 juta</option>
                              <option value="10-20jt">10 - 20 juta</option>
                              <option value=">20jt">{"> 20 juta"}</option>
                            </select>
                          </div>

                          <div className="col-span-2">
                            <label className="block text-sm text-zinc-400 mb-2">
                              Tujuan Investasi *
                            </label>
                            <select
                              value={formData.investmentGoal}
                              onChange={e =>
                                handleChange("investmentGoal", e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20"
                            >
                              <option value="">Pilih</option>
                              <option value="short">
                                Jangka Pendek (Trading Harian)
                              </option>
                              <option value="medium">
                                Jangka Menengah (1-3 tahun)
                              </option>
                              <option value="long">
                                Jangka Panjang (&gt;3 tahun)
                              </option>
                              <option value="retirement">Dana Pensiun</option>
                              <option value="education">Dana Pendidikan</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Profil Risiko */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium text-white mb-4">
                          Profil Risiko Investasi
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-zinc-400 mb-3">
                              Berapa lama kamu berencana berinvestasi? *
                            </label>
                            <div className="space-y-2">
                              {[
                                { value: "<1year", label: "< 1 tahun" },
                                { value: "1-3years", label: "1 - 3 tahun" },
                                { value: ">3years", label: "> 3 tahun" },
                              ].map(option => (
                                <label
                                  key={option.value}
                                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                  <input
                                    type="radio"
                                    name="investmentDuration"
                                    value={option.value}
                                    checked={
                                      formData.investmentDuration ===
                                      option.value
                                    }
                                    onChange={e =>
                                      handleChange(
                                        "investmentDuration",
                                        e.target.value
                                      )
                                    }
                                    className="w-4 h-4"
                                  />
                                  <span className="text-white">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-3">
                              Bagaimana reaksi kamu jika nilai investasi turun
                              10%? *
                            </label>
                            <div className="space-y-2">
                              {[
                                {
                                  value: "panic",
                                  label: "Panik dan ingin menjual segera",
                                },
                                {
                                  value: "calm",
                                  label: "Diam dan tunggu kondisi membaik",
                                },
                                {
                                  value: "buy",
                                  label: "Beli lagi karena harga sedang turun",
                                },
                              ].map(option => (
                                <label
                                  key={option.value}
                                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                  <input
                                    type="radio"
                                    name="riskReaction"
                                    value={option.value}
                                    checked={
                                      formData.riskReaction === option.value
                                    }
                                    onChange={e =>
                                      handleChange(
                                        "riskReaction",
                                        e.target.value
                                      )
                                    }
                                    className="w-4 h-4"
                                  />
                                  <span className="text-white">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-3">
                              Tujuan utama investasi kamu? *
                            </label>
                            <div className="space-y-2">
                              {[
                                {
                                  value: "profit",
                                  label: "Keuntungan jangka pendek",
                                },
                                { value: "retirement", label: "Dana pensiun" },
                                {
                                  value: "education",
                                  label: "Dana pendidikan",
                                },
                                { value: "passive", label: "Passive income" },
                              ].map(option => (
                                <label
                                  key={option.value}
                                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                  <input
                                    type="radio"
                                    name="investmentPurpose"
                                    value={option.value}
                                    checked={
                                      formData.investmentPurpose ===
                                      option.value
                                    }
                                    onChange={e =>
                                      handleChange(
                                        "investmentPurpose",
                                        e.target.value
                                      )
                                    }
                                    className="w-4 h-4"
                                  />
                                  <span className="text-white">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-3">
                              Seberapa paham kamu tentang saham / investasi? *
                            </label>
                            <div className="space-y-2">
                              {[
                                {
                                  value: "beginner",
                                  label: "Tidak paham (Pemula)",
                                },
                                {
                                  value: "intermediate",
                                  label: "Cukup paham (Menengah)",
                                },
                                {
                                  value: "advanced",
                                  label: "Sangat paham (Mahir)",
                                },
                              ].map(option => (
                                <label
                                  key={option.value}
                                  className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                  <input
                                    type="radio"
                                    name="knowledgeLevel"
                                    value={option.value}
                                    checked={
                                      formData.knowledgeLevel === option.value
                                    }
                                    onChange={e =>
                                      handleChange(
                                        "knowledgeLevel",
                                        e.target.value
                                      )
                                    }
                                    className="w-4 h-4"
                                  />
                                  <span className="text-white">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Dokumen Tambahan */}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white mb-4">
                          Dokumen Tambahan (Opsional)
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Upload Slip Gaji / Bukti Penghasilan
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={e =>
                                  handleFileUpload(
                                    "incomeProof",
                                    e.target.files?.[0] || null
                                  )
                                }
                                className="hidden"
                                id="income-upload"
                              />
                              <label
                                htmlFor="income-upload"
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:bg-white/10 cursor-pointer transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                                <span className="text-sm">
                                  {formData.incomeProof
                                    ? formData.incomeProof.name
                                    : "Pilih File (PDF/Gambar)"}
                                </span>
                              </label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Kode Referral (Opsional)
                            </label>
                            <input
                              type="text"
                              value={formData.referralCode}
                              onChange={e =>
                                handleChange("referralCode", e.target.value)
                              }
                              placeholder="INV12345"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-sm text-zinc-400 mb-2">
                              ℹ Dokumen tambahan membantu mempercepat
                              verifikasi dan meningkatkan limit transaksi Anda.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 6: Keamanan */}
                    {currentStep === 5 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-white mb-4">
                          Keamanan Akun
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Pertanyaan Keamanan *
                            </label>
                            <select
                              value={formData.securityQuestion}
                              onChange={e =>
                                handleChange("securityQuestion", e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/20"
                            >
                              <option value="">Pilih Pertanyaan</option>
                              <option value="pet">
                                Nama hewan peliharaan pertama?
                              </option>
                              <option value="school">
                                Nama sekolah dasar?
                              </option>
                              <option value="city">Kota kelahiran?</option>
                              <option value="food">Makanan favorit?</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              Jawaban Keamanan *
                            </label>
                            <input
                              type="text"
                              value={formData.securityAnswer}
                              onChange={e =>
                                handleChange("securityAnswer", e.target.value)
                              }
                              placeholder="Jawaban Anda"
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-zinc-400 mb-2">
                              PIN Transaksi (6 digit) *
                            </label>
                            <input
                              type="password"
                              value={formData.transactionPin}
                              onChange={e =>
                                handleChange("transactionPin", e.target.value)
                              }
                              placeholder="••••••"
                              maxLength={6}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
                            />
                          </div>

                          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <div className="flex items-start gap-3">
                              <Shield className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-zinc-400">
                                <p className="font-medium text-white mb-2">
                                  Keamanan Data Anda
                                </p>
                                <ul className="space-y-1 list-disc list-inside">
                                  <li>Data terenkripsi end-to-end</li>
                                  <li>Verifikasi 2FA via SMS/Email</li>
                                  <li>PIN untuk setiap transaksi</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-white/[0.06] px-10 py-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-6 py-3 text-white hover:bg-white/[0.03] rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed font-normal"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500">
                      Step {currentStep + 1} dari {steps.length}
                    </span>
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-100 transition-all"
                    >
                      {currentStep === steps.length - 1 ? (
                        <>
                          Selesai
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Lanjutkan
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
