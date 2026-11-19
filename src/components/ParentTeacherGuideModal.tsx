"use client";

import React from "react";
import { X, BookOpen, Heart, Brain, Lightbulb, Sparkles } from "lucide-react";
import { playPop } from "../lib/sounds";

interface ParentTeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentTeacherGuideModal: React.FC<ParentTeacherGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-indigo-200 p-6 md:p-8 flex flex-col gap-6 relative">
        {/* Tombol Tutup */}
        <button
          onClick={() => {
            playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3 border-b border-indigo-100 pb-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-indigo-950">
              Panduan Orang Tua & Guru 👨‍👩‍👧‍👦
            </h2>
            <p className="text-xs md:text-sm text-indigo-600 font-medium">
              Mengenalkan Fondasi Berpikir Komputasional (Usia 4–6 Tahun)
            </p>
          </div>
        </div>

        {/* Konten Edukatif */}
        <div className="flex flex-col gap-5 text-sm text-slate-700 leading-relaxed">
          {/* Mengapa Algoritma untuk Anak Usia Dini? */}
          <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
            <h3 className="font-extrabold text-indigo-950 flex items-center gap-2 mb-2 text-base">
              <Brain className="w-5 h-5 text-indigo-600" />
              <span>Mengapa Mengajarkan Algoritma Sejak Dini?</span>
            </h3>
            <p>
              Pada usia 4 hingga 6 tahun, belajar coding <strong>bukanlah</strong> menghafal teks kode rumit.
              Melainkan melatih <strong>Computational Thinking</strong> (cara berpikir terstruktur):
              bagaimana menyusun urutan langkah demi langkah secara logis untuk mencapai sebuah tujuan.
            </p>
          </div>

          {/* 4 Pilar yang Dilatih Game Ini */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h4 className="font-extrabold text-emerald-900 flex items-center gap-1.5 mb-1">
                <span>1. Sekuensial (Urutan) 👣</span>
              </h4>
              <p className="text-xs text-emerald-800">
                Memahami bahwa urutan itu penting. Langkah 1 harus selesai sebelum langkah 2 dimulai.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5 mb-1">
                <span>2. Orientasi Spasial 🧭</span>
              </h4>
              <p className="text-xs text-amber-800">
                Melatih perspektif kiri-kanan dari sudut pandang robot Kiki, bukan sekadar sudut pandang layar.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
              <h4 className="font-extrabold text-rose-900 flex items-center gap-1.5 mb-1">
                <span>3. Debugging (Pantang Menyerah) 🐞</span>
              </h4>
              <p className="text-xs text-rose-800">
                Saat robot menabrak atau salah arah, anak diajarkan bahwa kesalahan adalah hal biasa! Kita cukup cari langkah yang keliru dan menggantinya.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
              <h4 className="font-extrabold text-purple-900 flex items-center gap-1.5 mb-1">
                <span>4. Loop (Pengulangan) 🔁</span>
              </h4>
              <p className="text-xs text-purple-800">
                Melihat pola berulang sehingga anak paham bahwa komputer dapat mengotomatisasi pekerjaan panjang dengan cepat.
              </p>
            </div>
          </div>

          {/* Tips Praktis untuk Pendamping */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <h3 className="font-extrabold text-amber-950 flex items-center gap-2 mb-2 text-base">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <span>Tips Mendampingi Anak:</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900">
              <li>
                <strong>Ajak Berbicara Nyaring:</strong> Mintalah anak menyebutkan langkahnya dengan suara ceria ("Maju satu, lalu belok mana ya?").
              </li>
              <li>
                <strong>Gunakan Fitur Suara (TTS):</strong> Klik ikon pengeras suara agar instruksi dibacakan otomatis bila anak belum lancar membaca.
              </li>
              <li>
                <strong>Kaitkan dengan Rutinitas Rumah:</strong> Mainkan mode "Algoritma Sehari-hari" untuk menunjukkan sikat gigi & membuat roti juga adalah algoritma!
              </li>
            </ul>
          </div>
        </div>

        {/* Tombol Mengerti */}
        <div className="flex justify-end pt-2 border-t border-indigo-100">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="w-full md:w-auto px-6 py-3 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
          >
            Mengerti, Ayo Main Bersama! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
