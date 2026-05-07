import React, { useState } from 'react';
import { BookOpen, Code, Play, CheckCircle, AlertCircle, ChevronRight, HelpCircle} from 'lucide-react';
import * as XLSX from 'xlsx';

function AlgoritmaDashboard() {
  const [activeTab, setActiveTab] = useState('materi');
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [currentProblemIndex, setCurrentProblemIndex] = useState(null); // pakai index, bukan objek
  const [analysis, setAnalysis] = useState({ selectedInputs: [], processText: '', selectedOutputs: [] });
  const [flowchart, setFlowchart] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [completedProblems, setCompletedProblems] = useState([]); // array of problem IDs yg skor >= 60
  const [showNamePopup, setShowNamePopup] = useState(true);
  const [tempName, setTempName] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState(null);

const isValidName = (name) => {
  const trimmed = name.trim();
  // Minimal 3 karakter
  if (trimmed.length < 3) return false;
  // Harus mengandung minimal 1 huruf
  if (!/[a-zA-Z]/.test(trimmed)) return false;
  // Tidak boleh lebih dari 50% karakter spesial/angka
  const letters = trimmed.replace(/[^a-zA-Z\s]/g, '').length;
  if (letters < trimmed.length * 0.5) return false;
  return true;
};

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyc_jzd9vAJC4COfi1zagI8HTo8SFn1-2GkH-3pmOAJfBNJG8PxCB9MAsyDB5YS9QV3QQ/exec';

  const materiList = [
    {
      id: 1,
      title: 'Pengertian Algoritma',
      icon: '📚',
      content: {
        intro: 'Algoritma adalah urutan langkah-langkah logis dan sistematis yang disusun untuk menyelesaikan suatu masalah.',
        pengertian: [
          {
            judul: 'Definisi Algoritma',
            penjelasan: 'Algoritma berasal dari nama matematikawan Persia, Abu Ja\'far Muhammad bin Musa Al-Khawarizmi. Algoritma adalah serangkaian instruksi yang jelas dan terstruktur untuk menyelesaikan masalah atau melakukan tugas tertentu. Algoritma adalah seraingkaian instruksi yang jelas dan terstruktur untuk menyelesaikan masalah atau melakukan tugas tertentu. Algoritma juga merupakan bentuk dari suatu strategi atau ‘resep’ yang kamu gunakan untuk menyelesaikan suatu masalah. Algoritma lahir dari suatu proses berpikir komputasional oleh seseorang untuk menemukan Solusi dari suatu permasalahan yang diberikan. Dengan demikian, berpikir komputasional merupakan keahlian yang diperlukan untuk dapat membuat algoritma, program, atau suatu karya informatika yang dapat digunakakn dengan efektif dan efisien. '
          },
          {
            judul: 'Karakteristik Algoritma',
            penjelasan: 'Algoritma yang baik memiliki karakteristik: Input (masukan), Output (keluaran), Definiteness (jelas), Finiteness (berakhir), dan Effectiveness (efektif).'
          }
        ],
        ciri: [
          'Memiliki input (masukan) yang jelas',
          'Memiliki output (keluaran) yang diharapkan',
          'Definiteness - Setiap langkah harus jelas dan tidak ambigu',
          'Finiteness - Algoritma harus berakhir setelah sejumlah langkah tertentu',
          'Effectiveness - Setiap langkah harus dapat dikerjakan'
        ],
        contoh: [
          {
            judul: 'Algoritma Membuat Teh Manis',
            langkah: [
              '1. Siapkan gelas, teh celup, air panas, dan gula',
              '2. Masukkan teh celup ke dalam gelas',
              '3. Tuangkan air panas ke dalam gelas',
              '4. Tunggu 3-5 menit',
              '5. Angkat teh celup',
              '6. Tambahkan 2 sendok gula',
              '7. Aduk hingga gula larut',
              '8. Teh manis siap dihidangkan'
            ]
          },
          {
            judul: 'Algoritma Menentukan Bilangan Terbesar',
            langkah: [
              '1. Masukkan tiga bilangan: A, B, C',
              '2. Anggap A adalah bilangan terbesar',
              '3. Jika B lebih besar dari A, maka B adalah terbesar',
              '4. Jika C lebih besar dari bilangan terbesar, maka C adalah terbesar',
              '5. Tampilkan bilangan terbesar'
            ]
          },
          {judul: 'Algoritma mencari buku di perpustakaan',
            langkah: [
              '1. Catat judul buku yang dicari',
              '2. Tanyakan ke petugas letak kategori buku',
              '3. Pergi ke rak sesuai kategori',
              '4. Cari buku berdasarkan urutan abjad',
              '5. Jika ketemu, ambil bukunya',
              '6. Jika tidak ketemu, tanyakan ke petugas'
            ]
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Flowchart',
      icon: '🔷',
      content: {
        intro: 'Flowchart atau diagram alir adalah diagram yang menggambarkan alur atau urutan proses dari suatu algoritma menggunakan simbol-simbol standar. Flowchart atau diagram alir yang menggambarkan alur atau urutan proses dari suatu algoritma menggunakan symbol-simbil standar. Diagram alir merupakan notasi algoritma dengan menggunakan gambar atau symbol sebagai penjelas dari suatu algoritma. Diagram alir dibuat dalam bentuk aliran symbol yang dapat ditelusuri dari suatu titik permulaan hingga titik akhir dari program.',
        pengertian: 'Flowchart adalah representasi visual dari algoritma yang menggunakan simbol-simbol geometris untuk menunjukkan langkah-langkah dan alur keputusan.',
        manfaat: [
          'Memudahkan pemahaman logika program',
          'Memperjelas alur proses secara visual',
          'Membantu dokumentasi sistem',
          'Mempermudah komunikasi antar tim',
          'Membantu menemukan kesalahan logika'
        ],
        symbols: [
          { name: 'Terminator', shape: 'oval', desc: 'Menandakan awal dan akhir dari suatu algoritma', color: 'bg-green-100', contoh: 'START, END, MULAI, SELESAI' },
          { name: 'Input/Output', shape: 'parallelogram', desc: 'Menunjukkan proses input atau output', color: 'bg-yellow-100', contoh: 'INPUT nama, OUTPUT hasil' },
          { name: 'Proses', shape: 'rectangle', desc: 'Menunjukkan suatu proses pengolahan data', color: 'bg-blue-100', contoh: 'luas = panjang × lebar' },
          { name: 'Keputusan', shape: 'diamond', desc: 'Menunjukkan pemilihan keputusan (Ya/Tidak)', color: 'bg-red-100', contoh: 'Apakah nilai >= 60?' },
          { name: 'Panah Alur', shape: 'arrow', desc: 'Menunjukkan arah aliran proses', color: 'bg-gray-100', contoh: '→ ↓ ← ↑' }
        ],
        contohFlowchart: [
          {
            judul: 'Flowchart Menghitung Luas Persegi Panjang',
            deskripsi: 'Contoh flowchart sederhana',
            langkah: [
              { simbol: 'START', jenis: 'Terminator' },
              { simbol: 'INPUT panjang, lebar', jenis: 'Input' },
              { simbol: 'luas = panjang × lebar', jenis: 'Proses' },
              { simbol: 'OUTPUT luas', jenis: 'Output' },
              { simbol: 'END', jenis: 'Terminator' }
            ]
          },
          {
            judul: 'Flowchart Menentukan Bilangan Genap atau Ganjil',
            deskripsi: 'Contoh flowchart sederhana percabangan (Decision)',
            langkah: [
              { simbol: 'START', jenis: 'Terminator' },
              { simbol: 'INPUT bilangan', jenis: 'Input' },
              { simbol: 'bilangan % 2 == 0?', jenis: 'Keputusan' },
              { simbol: 'Ya → OUTPUT "Genap', jenis: 'Output' },
              { simbol: 'Tidak → OUTPUT "Ganjil', jenis: 'Output' },
              { simbol: 'END', jenis: 'Terminator' }
            ]
          }
        ]
      }
    }
  ];

  const tutorialSteps = [
    { step: 1, title: '1. Pilih Masalah', desc: 'Klik kartu masalah yang tersedia. Level Sedang & Sulit akan terbuka setelah menyelesaikan soal sebelumnya.', img: '🎯' },
    { step: 2, title: '2. Baca dan Pahami Masalah', desc: 'Baca deskripsi masalah dengan teliti dan perhatikan pertanyaan pemantik.', img: '📖' },
    { step: 3, title: '3. Analisis Masalah (IPO)', desc: 'Identifikasi Input, Proses, dan Output dari masalah.', img: '🔍' },
    { step: 4, title: '4. Susun Flowchart', desc: 'Drag & drop simbol flowchart ke dalam slot yang tersedia.', img: '🔷' },
    { step: 5, title: '5. Jalankan Simulasi', desc: 'Klik tombol "Jalankan Simulasi" untuk mengecek jawaban Anda.', img: '▶️' },
    { step: 6, title: '6. Next atau Perbaiki', desc: 'Jika skor ≥ 60, lanjut ke soal berikutnya. Jika tidak, perbaiki dulu.', img: '✅' }
  ];

  const problemSets = [
    // MUDAH
    {
      id: 1, title: 'Menghitung Luas Segitiga', level: 'Mudah',
      description: 'Buatlah algoritma untuk menghitung luas segitiga. Program menerima input alas dan tinggi, kemudian menghitung dan menampilkan luas segitiga.',
      hints: ['Data apa yang diperlukan untuk menghitung luas segitiga?', 'Apa rumus luas segitiga?', 'Hasil apa yang harus ditampilkan?'],
      expectedFlow: ['start', 'input', 'process', 'output', 'end'], needsDecision: false,
      inputOptions: ['alas', 'tinggi', 'keliling', 'diameter', 'jari-jari'], correctInputs: ['alas', 'tinggi'],
      processKeywords: ['alas', 'tinggi', 'bagi', '2', 'kali'],
      outputOptions: ['luas segitiga', 'keliling segitiga', 'volume segitiga', 'tinggi segitiga'], correctOutputs: ['luas segitiga']
    },
    {
      id: 2, title: 'Konversi Suhu Celsius ke Fahrenheit', level: 'Mudah',
      description: 'Buatlah algoritma untuk mengkonversi suhu dari Celsius ke Fahrenheit.',
      hints: ['Apa input yang diperlukan?', 'Bagaimana rumus konversi Celsius ke Fahrenheit?', 'Apa yang harus ditampilkan sebagai output?'],
      expectedFlow: ['start', 'input', 'process', 'output', 'end'], needsDecision: false,
      inputOptions: ['celsius', 'fahrenheit', 'kelvin', 'reamur'], correctInputs: ['celsius'],
      processKeywords: ['celsius', '9', '5', '32', 'kali', 'tambah'],
      outputOptions: ['fahrenheit', 'celsius', 'kelvin', 'suhu'], correctOutputs: ['fahrenheit']
    },
    {
      id: 3, title: 'Menentukan Bilangan Positif atau Negatif', level: 'Mudah',
      description: 'Buatlah algoritma untuk menentukan apakah sebuah bilangan positif, negatif, atau nol.',
      hints: ['Berapa kondisi yang perlu dicek?', 'Bagaimana membedakan bilangan positif, negatif, dan nol?', 'Percabangan seperti apa yang dibutuhkan?'],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'], needsDecision: true,
      inputOptions: ['bilangan', 'angka', 'nama', 'nilai'], correctInputs: ['bilangan'],
      processKeywords: ['positif', 'negatif', 'nol', '0', 'jika', 'lebih', 'kurang'],
      outputOptions: ['status bilangan', 'hasil bilangan', 'nama bilangan', 'jenis bilangan'], correctOutputs: ['status bilangan']
    },
    // SEDANG
    {
      id: 4, title: 'Menentukan Nilai Maksimum dari 2 Bilangan', level: 'Sedang',
      description: 'Buatlah algoritma untuk menentukan bilangan terbesar dari dua bilangan yang diinputkan.',
      hints: ['Berapa bilangan yang perlu dibandingkan?', 'Bagaimana cara membandingkan dua bilangan?', 'Apa output yang diharapkan?'],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'], needsDecision: true,
      inputOptions: ['bilangan1', 'bilangan2', 'nama', 'nilai', 'angka1', 'angka2'], correctInputs: ['bilangan1', 'bilangan2'],
      processKeywords: ['bilangan', 'maksimum', 'terbesar', 'banding', 'jika', 'lebih'],
      outputOptions: ['bilangan maksimum', 'bilangan minimum', 'hasil', 'nilai terbesar'], correctOutputs: ['bilangan maksimum', 'nilai terbesar']
    },
    {
      id: 5, title: 'Menghitung Total Belanja dan Diskon', level: 'Sedang',
      description: 'Buatlah algoritma untuk menghitung total belanja. Jika total belanja lebih dari 100000, dapat diskon 10%.',
      hints: ['Apa yang perlu diinput?', 'Kapan diskon diberikan?', 'Bagaimana cara menghitung total setelah diskon?'],
      expectedFlow: ['start', 'input', 'decision', 'process', 'output', 'end'], needsDecision: true,
      inputOptions: ['harga', 'total', 'diskon', 'nama barang', 'jumlah'], correctInputs: ['harga'],
      processKeywords: ['100000', 'diskon', '10', 'jika', 'total', 'harga'],
      outputOptions: ['total bayar', 'harga total', 'diskon', 'harga barang'], correctOutputs: ['total bayar', 'harga total']
    },
    {
      id: 6, title: 'Menghitung Nilai Akhir Siswa', level: 'Sedang',
      description: 'Buatlah algoritma untuk menghitung nilai akhir siswa. Nilai akhir = (UTS × 30%) + (UAS × 40%) + (Tugas × 30%). Tentukan juga status kelulusan (lulus jika >= 60).',
      hints: ['Berapa komponen nilai yang perlu diinput?', 'Bagaimana cara menghitung nilai akhir dengan bobot?', 'Kapan siswa dinyatakan lulus?'],
      expectedFlow: ['start', 'input', 'process', 'decision', 'output', 'end'], needsDecision: true,
      inputOptions: ['UTS', 'UAS', 'Tugas', 'nama', 'kelas', 'absen'], correctInputs: ['UTS', 'UAS', 'Tugas'],
      processKeywords: ['30', '40', 'nilai', 'akhir', '60', 'lulus'],
      outputOptions: ['nilai akhir', 'status kelulusan', 'nilai UTS', 'nama siswa'], correctOutputs: ['nilai akhir', 'status kelulusan']
    },
    // SULIT
    {
      id: 7, title: 'Menentukan Tahun Kabisat', level: 'Sulit',
      description: 'Buatlah algoritma untuk menentukan apakah suatu tahun adalah tahun kabisat.',
      hints: ['Apa syarat tahun kabisat?', 'Berapa kondisi yang harus dicek?', 'Bagaimana urutan pengecekan kondisi?'],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'], needsDecision: true,
      inputOptions: ['tahun', 'bulan', 'tanggal', 'hari'], correctInputs: ['tahun'],
      processKeywords: ['4', '100', '400', 'bagi', 'kabisat', 'jika'],
      outputOptions: ['status kabisat', 'tahun kabisat', 'jumlah hari', 'nama bulan'], correctOutputs: ['status kabisat', 'tahun kabisat']
    },
    {
      id: 8, title: 'Menghitung Tarif Parkir', level: 'Sulit',
      description: 'Buatlah algoritma untuk menghitung tarif parkir. Tarif: 2 jam pertama Rp5000, setiap jam berikutnya Rp2000.',
      hints: ['Berapa tarif untuk 2 jam pertama?', 'Bagaimana menghitung jam tambahan?', 'Bagaimana struktur percabangannya?'],
      expectedFlow: ['start', 'input', 'decision', 'process', 'output', 'end'], needsDecision: true,
      inputOptions: ['lama parkir', 'jam masuk', 'jam keluar', 'nomor plat'], correctInputs: ['lama parkir'],
      processKeywords: ['2', 'jam', '5000', '2000', 'tarif', 'jika'],
      outputOptions: ['total tarif', 'tarif parkir', 'jam parkir', 'waktu parkir'], correctOutputs: ['total tarif', 'tarif parkir']
    },
    {
      id: 9, title: 'Menentukan Kategori Nilai Siswa', level: 'Sulit',
      description: 'Buatlah algoritma untuk menentukan kategori nilai siswa. Ketentuan: Nilai > 85 = "A", nilai 70-84 = "B", nilai < 60 = "D".',
      hints: ['Berapa kategori nilai yang ada?', 'Bagaimana urutan pengecekan kondisi dari yang tertinggi?', 'Bagaimana menangani rentang nilai?'],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'], needsDecision: true,
      inputOptions: ['nilai akhir', 'nama siswa', 'kelas', 'absen'], correctInputs: ['nilai akhir'],
      processKeywords: ['85', '70', '60', 'kategori', 'A', 'B', 'D', 'jika'],
      outputOptions: ['kategori nilai', 'grade', 'huruf mutu', 'nilai akhir'], correctOutputs: ['kategori nilai', 'grade', 'huruf mutu']
    }
  ];

  // ===== SISTEM LOCK/UNLOCK =====
  // Mudah: soal 1,2,3 selalu terbuka
  // Sedang: terbuka setelah 2 soal Mudah selesai (skor >= 60)
  // Sulit:  terbuka setelah 2 soal Sedang selesai (skor >= 60)

  const completedCountByLevel = (level) =>
    problemSets.filter(p => p.level === level && completedProblems.includes(p.id)).length;

  const isProblemUnlocked = (problem) => {
    if (problem.level === 'Mudah') return true;
    if (problem.level === 'Sedang') return completedCountByLevel('Mudah') >= 2;
    if (problem.level === 'Sulit') return completedCountByLevel('Sedang') >= 2;
    return false;
  };

  // Soal yang aktif saat ini
  const currentProblem = currentProblemIndex !== null ? problemSets[currentProblemIndex] : null;

  const flowchartSymbols = [
    { id: 'start', name: 'Mulai', type: 'terminator', color: 'bg-green-100 border-green-400' },
    { id: 'input', name: 'Input', type: 'io', color: 'bg-yellow-100 border-yellow-400' },
    { id: 'process', name: 'Proses', type: 'process', color: 'bg-blue-100 border-blue-400' },
    { id: 'decision', name: 'Keputusan', type: 'decision', color: 'bg-red-100 border-red-400' },
    { id: 'output', name: 'Output', type: 'io', color: 'bg-yellow-100 border-yellow-400' },
    { id: 'end', name: 'Selesai', type: 'terminator', color: 'bg-green-100 border-green-400' }
  ];

  // Klik simbol → pilih/deselect
const handleSelectSymbol = (symbol) => {
  if (selectedSymbol?.id === symbol.id) {
    setSelectedSymbol(null); // deselect kalau klik sama
  } else {
    setSelectedSymbol(symbol);
  }
};

// Klik slot → taruh simbol yang dipilih
const handleSlotClick = (index) => {
  if (selectedSymbol) {
    const newFlowchart = [...flowchart];
    newFlowchart[index] = selectedSymbol;
    setFlowchart(newFlowchart);
    setSelectedSymbol(null); // reset pilihan setelah ditaruh
  } else if (flowchart[index]) {
    // Klik slot yang sudah terisi → hapus simbolnya
    const newFlowchart = [...flowchart];
    newFlowchart[index] = null;
    setFlowchart(newFlowchart);
  }
};

// Tetap support drag & drop untuk laptop
const handleDragStart = (e, symbol) => {
  e.dataTransfer.setData('symbol', JSON.stringify(symbol));
  setSelectedSymbol(symbol);
};

const handleDrop = (e, index) => {
  e.preventDefault();
  const symbol = JSON.parse(e.dataTransfer.getData('symbol'));
  const newFlowchart = [...flowchart];
  newFlowchart[index] = symbol;
  setFlowchart(newFlowchart);
  setSelectedSymbol(null);
};

const handleDragOver = (e) => e.preventDefault();

  const initializeWorkspace = (index) => {
    setCurrentProblemIndex(index);
    setAnalysis({ selectedInputs: [], processText: '', selectedOutputs: [] });
    setFlowchart(new Array(6).fill(null));
    setSimulationResult(null);
    setShowFeedback(false);
  };

  // Pindah ke soal berikutnya yang unlocked
  const goToNextProblem = () => {
    if (currentProblemIndex === null) return;
    // Cari soal berikutnya yang unlocked
    for (let i = currentProblemIndex + 1; i < problemSets.length; i++) {
      if (isProblemUnlocked(problemSets[i])) {
        initializeWorkspace(i);
        return;
      }
    }
    // Tidak ada soal berikutnya → kembali ke daftar
    setCurrentProblemIndex(null);
  };

  const hasNextProblem = () => {
    if (currentProblemIndex === null) return false;
    for (let i = currentProblemIndex + 1; i < problemSets.length; i++) {
      if (isProblemUnlocked(problemSets[i])) return true;
    }
    return false;
  };

  const toggleInput = (input) => {
    const current = analysis.selectedInputs;
    setAnalysis({ ...analysis, selectedInputs: current.includes(input) ? current.filter(i => i !== input) : [...current, input] });
  };

  const toggleOutput = (output) => {
    const current = analysis.selectedOutputs;
    setAnalysis({ ...analysis, selectedOutputs: current.includes(output) ? current.filter(o => o !== output) : [...current, output] });
  };

  const runSimulation = () => {
    if (!currentProblem) return;

    const filledSymbols = flowchart.filter(s => s !== null);
    const symbolIds = filledSymbols.map(s => s.id);
    let score = 0;
    let feedback = [];
    let errors = [];

    // VALIDASI 1: INPUT
    const correctInputs = currentProblem.correctInputs || [];
    const selectedInputs = analysis.selectedInputs || [];
    const inputCorrect = selectedInputs.length > 0 &&
      selectedInputs.every(i => correctInputs.includes(i)) &&
      correctInputs.every(c => selectedInputs.includes(c));

    if (inputCorrect) { score += 15; feedback.push(`✅ Input sudah benar: ${selectedInputs.join(', ')}`); }
    else {
      if (selectedInputs.length === 0) errors.push('❌ Anda belum memilih input apapun');
      else {
        const wrong = selectedInputs.filter(i => !correctInputs.includes(i));
        const missing = correctInputs.filter(c => !selectedInputs.includes(c));
        if (wrong.length > 0) errors.push(`❌ Input yang salah: ${wrong.join(', ')}`);
        if (missing.length > 0) errors.push(`❌ Input yang kurang: ${missing.join(', ')}`);
      }
    }

    // VALIDASI 2: PROSES
    const processText = (analysis.processText || '').toLowerCase();
    const processKeywords = currentProblem.processKeywords || [];
    const hasKeywords = processKeywords.length > 0 && processKeywords.every(k => processText.includes(k.toLowerCase()));
    const isLongEnough = processText.length > 15;

    if (hasKeywords && isLongEnough) { score += 25; feedback.push('✅ Proses algoritma sudah dijelaskan dengan lengkap'); }
    else {
      if (!isLongEnough) errors.push('❌ Penjelasan proses terlalu singkat (minimal 15 karakter)');
      if (!hasKeywords && processKeywords.length > 0) {
        const missing = processKeywords.filter(k => !processText.includes(k.toLowerCase()));
        errors.push(`❌ Kata kunci yang harus ada di proses: ${missing.join(', ')}`);
      }
    }

    // VALIDASI 3: OUTPUT
    const correctOutputs = currentProblem.correctOutputs || [];
    const selectedOutputs = analysis.selectedOutputs || [];
    const outputCorrect = selectedOutputs.length > 0 && 
      selectedOutputs.every(output => correctOutputs.includes(output)) &&
      correctOutputs.every(correct => selectedOutputs.includes(correct));

    if (outputCorrect) { score += 15; feedback.push(`✅ Output sudah benar: ${selectedOutputs.join(', ')}`); }
    else {
      if (selectedOutputs.length === 0) errors.push('❌ Anda belum memilih output apapun');
      else errors.push(`❌ Output yang benar adalah: ${correctOutputs.join(' atau ')}`);
    }

    // VALIDASI 4: START & END
    const hasStart = symbolIds[0] === 'start';
    const hasEnd = symbolIds[symbolIds.length - 1] === 'end';
    if (hasStart && hasEnd) { score += 10; feedback.push('✅ Flowchart dimulai dengan Mulai dan diakhiri dengan Selesai'); }
    else {
      if (!hasStart) errors.push('❌ Flowchart harus dimulai dengan simbol Mulai');
      if (!hasEnd) errors.push('❌ Flowchart harus diakhiri dengan simbol Selesai');
    }

    // VALIDASI 5: KELENGKAPAN IPO
    const hasInput = symbolIds.includes('input');
    const hasProcess = symbolIds.includes('process');
    const hasOutput = symbolIds.includes('output');
    const hasDecision = symbolIds.includes('decision');

    if (selectedInputs.length > 0) {
      if (hasInput) { score += 10; feedback.push('✅ Flowchart memiliki simbol Input sesuai analisis IPO'); }
      else errors.push('❌ Flowchart harus ada simbol Input karena analisis IPO Anda membutuhkan input');
    }
    if (processText.length > 0) {
      if (hasProcess) { score += 10; feedback.push('✅ Flowchart memiliki simbol Proses sesuai analisis IPO'); }
      else errors.push('❌ Flowchart harus ada simbol Proses karena analisis IPO Anda memiliki proses');
    }
    if (selectedOutputs.length > 0) {
      if (hasOutput) { score += 10; feedback.push('✅ Flowchart memiliki simbol Output sesuai analisis IPO'); }
      else errors.push('❌ Flowchart harus ada simbol Output karena analisis IPO Anda memiliki output');
    }

    // VALIDASI 6: DECISION
    if (currentProblem.needsDecision) {
      if (hasDecision) { score += 10; feedback.push('✅ Flowchart memiliki simbol Keputusan (diperlukan untuk soal ini)'); }
      else errors.push('❌ Soal ini membutuhkan percabangan, flowchart harus ada simbol Keputusan');
    } else {
      if (hasDecision) { errors.push('❌ Simbol Keputusan tidak diperlukan untuk soal ini'); score -= 5; }
      else feedback.push('✅ Tidak menggunakan simbol Keputusan (sudah tepat)');
    }

    // VALIDASI 7: URUTAN
    const inputIndex = symbolIds.indexOf('input');
    const processIndex = symbolIds.indexOf('process');
    const decisionIndex = symbolIds.indexOf('decision');
    const outputIndex = symbolIds.indexOf('output');
    let orderCorrect = true;
    if (hasInput && hasProcess && inputIndex > processIndex) { errors.push('❌ Simbol Input harus ditempatkan sebelum Proses'); orderCorrect = false; }
    if (hasProcess && hasOutput && processIndex > outputIndex && !hasDecision) { errors.push('❌ Simbol Proses harus ditempatkan sebelum Output'); orderCorrect = false; }
    if (hasDecision && hasOutput && decisionIndex > outputIndex) { errors.push('❌ Simbol Keputusan harus ditempatkan sebelum Output'); orderCorrect = false; }
    if (orderCorrect && filledSymbols.length >= 4) { score += 5; feedback.push('✅ Urutan flowchart sudah logis'); }

    score = Math.max(0, score);
    const status = score >= 75 ? 'Baik' : score >= 50 ? 'Cukup' : 'Perlu Perbaikan';
    const result = { score, feedback, errors, status };

    setSimulationResult(result);
    setShowFeedback(true);

    // ===== TANDAI SELESAI JIKA SKOR >= 60 =====
    if (score >= 60 && !completedProblems.includes(currentProblem.id)) {
      setCompletedProblems(prev => [...prev, currentProblem.id]);
    }

    const submission = {
      timestamp: new Date().toLocaleString('id-ID'),
      studentName: studentName || 'Siswa',
      problemTitle: currentProblem.title,
      problemLevel: currentProblem.level,
      input: selectedInputs.join(', '),
      proses: processText,
      output: selectedOutputs.join(', '),
      flowchart: filledSymbols.map(s => s.name).join(' → '),
      score: result.score,
      status: result.status,
      feedback: result.feedback.join('; '),
      errors: result.errors.join('; ')
    };

    setSubmissionHistory([...submissionHistory, submission]);
    saveToGoogleSheets(submission);
  };

  const saveToGoogleSheets = async (data) => {
    if (!studentName) { alert('Mohon isi nama siswa terlebih dahulu!'); return; }
    setIsSaving(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const exportToExcel = () => {
    if (submissionHistory.length === 0) { alert('Belum ada data untuk diekspor!'); return; }
    const worksheetData = submissionHistory.map((item, index) => ({
      'No': index + 1, 'Waktu': item.timestamp, 'Nama Siswa': item.studentName,
      'Judul Soal': item.problemTitle, 'Level': item.problemLevel,
      'Input': item.input, 'Proses': item.proses, 'Output': item.output,
      'Flowchart': item.flowchart, 'Skor': item.score, 'Status': item.status,
      'Feedback Positif': item.feedback, 'Perlu Perbaikan': item.errors
    }));
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    ws['!cols'] = [5,20,20,30,10,25,35,25,40,8,15,50,50].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hasil Simulasi');
    XLSX.writeFile(wb, `Hasil_Algoritma_${studentName || 'Siswa'}_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`);
  };

  // ===== RENDER DAFTAR SOAL =====
  const renderProblemList = () => {
    const levels = ['Mudah', 'Sedang', 'Sulit'];
    const levelColors = {
      Mudah: { header: 'bg-green-100 border-green-300 text-green-800', badge: 'bg-green-100 text-green-800', lockBg: 'bg-green-50', emoji: '🟢' },
      Sedang: { header: 'bg-yellow-100 border-yellow-300 text-yellow-800', badge: 'bg-yellow-100 text-yellow-800', lockBg: 'bg-yellow-50', emoji: '🟡' },
      Sulit: { header: 'bg-red-100 border-red-300 text-red-800', badge: 'bg-red-100 text-red-800', lockBg: 'bg-red-50', emoji: '🔴' },
    };

    return (
      <div className="space-y-8">
        {levels.map(level => {
          const levelProblems = problemSets.filter(p => p.level === level);
          const isUnlocked = level === 'Mudah' ? true :
            level === 'Sedang' ? completedCountByLevel('Mudah') >= 2 :
            completedCountByLevel('Sedang') >= 2;
          const c = levelColors[level];

          return (
            <div key={level}>
              {/* Header Level */}
             <div className={`flex flex-col md:flex-row md:items-center gap-2 p-3 rounded-xl border-2 mb-4 ${c.header}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{c.emoji}</span>
                <h3 className="font-bold text-lg">Level {level}</h3>
              </div>
              {!isUnlocked && (
                <div className="flex items-center gap-1 md:ml-auto bg-white bg-opacity-70 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                  🔒
                  <span>
                    {level === 'Sedang'
                      ? `Selesaikan ${2 - completedCountByLevel('Mudah')} soal Mudah lagi (skor ≥ 60)`
                      : `Selesaikan ${2 - completedCountByLevel('Sedang')} soal Sedang lagi (skor ≥ 60)`}
                  </span>
                </div>
              )}
              {isUnlocked && (
                <div className="md:ml-auto text-sm font-semibold">
                  ✅ {completedCountByLevel(level)}/{problemSets.filter(p => p.level === level).length} selesai
                </div>
              )}
            </div>

              {/* Grid Soal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {levelProblems.map((problem) => {
                  const unlocked = isProblemUnlocked(problem);
                  const completed = completedProblems.includes(problem.id);

                  return (
                    <div key={problem.id} className="relative">
                      <button
                        onClick={() => unlocked && initializeWorkspace(problemSets.indexOf(problem))}
                        disabled={!unlocked}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all
                          ${!unlocked
                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                            : completed
                              ? 'bg-green-50 border-green-400 hover:shadow-lg cursor-pointer ring-2 ring-green-300'
                              : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 hover:border-indigo-400 hover:shadow-lg cursor-pointer'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                            ${!unlocked ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 text-white'}`}>
                            {!unlocked ? '🔒' : problem.id}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.badge}`}>
                            {problem.level}
                          </span>
                        </div>
                        <h3 className={`font-bold text-sm mb-2 ${!unlocked ? 'text-gray-400' : 'text-gray-800'}`}>
                          {problem.title}
                        </h3>
                        {!unlocked && (
                          <p className="text-xs text-gray-400 italic">
                            {level === 'Sedang' ? 'Butuh 2 soal Mudah selesai' : 'Butuh 2 soal Sedang selesai'}
                          </p>
                        )}
                        {completed && unlocked && (
                          <div className="flex items-center gap-1 text-green-700 text-xs font-bold mt-1">
                            <CheckCircle size={14} /> Sudah diselesaikan
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Info Sistem */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-blue-900">
            <strong>🔓 Sistem Buka Level:</strong> Selesaikan minimal <strong>2 soal Mudah</strong> (skor ≥ 60) untuk membuka level Sedang.
            Selesaikan minimal <strong>2 soal Sedang</strong> untuk membuka level Sulit.
          </p>
        </div>
      </div>
    );
  };

  // POPUP NAMA - taruh sebelum return utama
if (showNamePopup) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-4 border-indigo-300">
        
        {/* Header Popup */}
        <div className="text-center mb-6">
          <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Algoritma Dasar</h1>
          <p className="text-gray-500 text-sm mt-1">Pembelajaran Informatika Fase E</p>
        </div>

        {/* Form Nama */}
        <div className="mb-6">
          <label className="block font-bold text-gray-700 mb-2 text-lg">
            👤 Masukkan Nama Kamu:
          </label>
          <input
            type="text"
            placeholder="Contoh: Budi Santoso"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            // Bagian onKeyDown
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isValidName(tempName)) {
                setStudentName(tempName.trim());
                setShowNamePopup(false);
              }
            }}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 text-lg"
            autoFocus
          />
          <p className="text-xs text-gray-400 mt-2">
            * Nama akan digunakan untuk menyimpan hasil belajar kamu
          </p>
        </div>


        {/* Tombol Mulai */}
        <button
          // Bagian tombol onClick
          onClick={() => {
            if (isValidName(tempName)) {
              setStudentName(tempName.trim());
              setShowNamePopup(false);
            }
          }}
          disabled={!isValidName(tempName)}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all
            ${tempName.trim()
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          Mulai Belajar 🚀
        </button>

      </div>
    </div>
  );
}

          return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              {/* Header */}
              <div className="bg-white shadow-md border-b-4 border-indigo-500">
                <div className="max-w-7xl mx-auto px-6 py-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Judul */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 md:p-3 rounded-lg flex-shrink-0">
              <Code size={22} />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-800 leading-tight">
                Dashboard Algoritma Dasar
              </h1>
              <p className="text-xs md:text-sm text-gray-600">Pembelajaran Informatika Fase E</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
              {/* Progress Level */}
              <div className="flex items-center gap-2 text-xs bg-gray-50 px-2 py-1 rounded-lg border">
                <span className="text-green-600 font-bold">🟢 {completedCountByLevel('Mudah')}/3</span>
                <span className={`font-bold ${completedCountByLevel('Mudah') >= 2 ? 'text-yellow-600' : 'text-gray-400'}`}>
                  🟡 {completedCountByLevel('Sedang')}/3
                </span>
                <span className={`font-bold ${completedCountByLevel('Sedang') >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
                  🔴 {completedCountByLevel('Sulit')}/3
                </span>
              </div>
              {/* Nama Siswa */}
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                <span className="text-indigo-600 text-sm">👤</span>
                <span className="text-sm font-semibold text-indigo-800">{studentName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('materi')}
              className={'px-3 md:px-6 py-3 font-semibold transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base ' + (activeTab === 'materi' ? 'bg-indigo-600 text-white border-b-4 border-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
>
              <BookOpen size={16} />
                <span>Materi</span>
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={'px-3 md:px-6 py-3 font-semibold transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base ' + (activeTab === 'workspace' ? 'bg-indigo-600 text-white border-b-4 border-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
>
            <Code size={16} />
              <span>Workspace</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'materi' ? (
          /* ========== TAB MATERI ========== */
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Daftar Materi</h2>
                <div className="space-y-3">
                  {materiList.map((materi) => (
                    <button key={materi.id} onClick={() => setSelectedMateri(materi)}
                      className={'w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 ' + (selectedMateri?.id === materi.id ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent')}>
                      <span className="text-3xl">{materi.icon}</span>
                      <div className="flex-1"><p className="font-semibold text-gray-800">{materi.title}</p></div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              {selectedMateri ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-5xl">{selectedMateri.icon}</span>
                    <h2 className="text-3xl font-bold text-gray-800">{selectedMateri.title}</h2>
                  </div>
                  {selectedMateri.content.intro && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                      <p className="text-gray-700 leading-relaxed">{selectedMateri.content.intro}</p>
                    </div>
                  )}
                  {selectedMateri.content.pengertian && selectedMateri.id === 1 && (
                    <div className="space-y-4 mb-6">
                      {selectedMateri.content.pengertian.map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
                          <h3 className="font-bold text-lg text-purple-900 mb-2">{item.judul}</h3>
                          <p className="text-gray-700">{item.penjelasan}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedMateri.content.ciri && (
                    <div className="mb-6">
                      <h3 className="font-bold text-xl text-gray-800 mb-3">Ciri-ciri Algoritma yang Baik:</h3>
                      <div className="space-y-2">
                        {selectedMateri.content.ciri.map((ciri, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                            <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">{idx + 1}</div>
                            <p className="text-gray-700">{ciri}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedMateri.content.contoh && (
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-4">💡 Contoh Algoritma:</h3>
                      <div className="space-y-5">
                        {selectedMateri.content.contoh.map((contoh, idx) => (
                          <div key={idx} className="bg-green-50 border-2 border-green-200 p-5 rounded-lg">
                            <h4 className="font-bold text-lg text-green-900 mb-3">{contoh.judul}</h4>
                            <div className="space-y-1">{contoh.langkah.map((l, i) => <p key={i} className="text-gray-700 pl-2">{l}</p>)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedMateri.content.manfaat && (
                    <div className="mb-6">
                      <h3 className="font-bold text-xl text-gray-800 mb-3">Manfaat Flowchart:</h3>
                      <div className="space-y-2">
                        {selectedMateri.content.manfaat.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                            <CheckCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-gray-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedMateri.content.symbols && (
                    <div className="mb-6">
                      <h3 className="font-bold text-xl text-gray-800 mb-4">Simbol-Simbol Flowchart:</h3>
                      <div className="space-y-4">
                        {selectedMateri.content.symbols.map((symbol, idx) => (
                          <div key={idx} className={`p-5 rounded-lg border-2 ${symbol.color}`}>
                            <div className="flex items-start gap-4">
                              <div className="bg-white p-3 rounded border-2 border-gray-300 flex-shrink-0">
                                <div className={`inline-block px-6 py-2 border-2 border-gray-800 ${symbol.shape === 'oval' ? 'rounded-full' : symbol.shape === 'parallelogram' ? 'skew-x-12' : symbol.shape === 'diamond' ? 'rotate-45 w-12 h-12 flex items-center justify-center' : 'rounded'}`}>
                                  {symbol.shape !== 'arrow' && symbol.shape !== 'diamond' && <span className="text-xs font-bold">{symbol.name}</span>}
                                  {symbol.shape === 'diamond' && <span className="-rotate-45 text-xs font-bold">?</span>}
                                  {symbol.shape === 'arrow' && <span className="text-xl">→</span>}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-1">{symbol.name}</h4>
                                <p className="text-sm text-gray-700 mb-2">{symbol.desc}</p>
                                <div className="bg-white p-2 rounded border-l-4 border-gray-600">
                                  <p className="text-xs text-gray-600"><strong>Contoh:</strong> {symbol.contoh}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedMateri.content.contohFlowchart && (
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 mb-4">📊 Contoh Flowchart:</h3>
                      <div className="space-y-6">
                        {selectedMateri.content.contohFlowchart.map((fc, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 p-6 rounded-lg">
                            <h4 className="font-bold text-lg text-cyan-900 mb-2">{fc.judul}</h4>
                            <p className="text-sm text-gray-600 mb-4">{fc.deskripsi}</p>
                            <div className="flex flex-col items-center gap-3 bg-white p-4 rounded-lg">
                              {fc.langkah.map((step, i) => (
                                <div key={i} className="flex flex-col items-center">
                                  <div className="flex flex-col items-center">
                                    {/* TERMINATOR - oval/pill */}
                                    {step.jenis === 'Terminator' && (
                                  <div className="px-8 py-2 bg-green-100 border-2 border-green-400 rounded-full font-semibold text-sm text-center min-w-[160px]">
                                    {step.simbol}
                                  </div>
                                   )}

                                  {/* INPUT/OUTPUT - jajar genjang */}
                                  {(step.jenis === 'Input' || step.jenis === 'Output') && (
                                <div className="relative px-6 py-2 bg-yellow-100 border-2 border-yellow-400 font-semibold text-sm text-center min-w-[160px]"
                                  style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}>
                                  {step.simbol}
                                </div>
                                 )}

                                  {/* PROSES - persegi panjang */}
                                   {step.jenis === 'Proses' && (
                                <div className="px-6 py-2 bg-blue-100 border-2 border-blue-400 font-semibold text-sm text-center min-w-[160px]">
                                  {step.simbol}
                                </div>
                                )}

                                {/* KEPUTUSAN - belah ketupat */}
                                {step.jenis === 'Keputusan' && (
                                <div className="relative flex items-center justify-center bg-red-100 border-2 border-red-400 font-semibold text-sm text-center"
                                style={{ 
                                        width: '180px', 
                                         height: '80px',
                                        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                                     }}>
                                  {step.simbol}
                                  </div>
                                 )}
                                </div>
                                  {i < fc.langkah.length - 1 && (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    gap: '0px',
    lineHeight: '0'
  }}>
    <div style={{ 
      width: '2px', 
      height: '20px', 
      backgroundColor: '#9ca3af',
    }}></div>
    <div style={{
      width: '0',
      height: '0',
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderTop: '17px solid #9ca3af',
    }}></div>
  </div>
)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Pilih materi dari daftar untuk mulai belajar</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========== TAB WORKSPACE ========== */
          <div className="space-y-6">
            {/* Tutorial */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HelpCircle size={20} className="text-amber-600 flex-shrink-0" />
                  <h2 className="text-base md:text-xl font-bold text-gray-800">Cara Menggunakan Workspace</h2>
                </div>
                <button onClick={() => setShowTutorial(!showTutorial)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold text-sm flex-shrink-0">
                  {showTutorial ? 'Sembunyikan' : 'Lihat Tutorial'}
                </button>
              </div>
              {showTutorial && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {tutorialSteps.map((t) => (
                    <div key={t.step} className="bg-white p-4 rounded-lg border-2 border-amber-200">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{t.img}</span>
                        <div><h3 className="font-bold text-gray-800 mb-1">{t.title}</h3><p className="text-sm text-gray-600">{t.desc}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!currentProblem ? (
              /* ===== DAFTAR SOAL ===== */
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">🎯 Pilih Masalah</h2>

                {/* Info Lock Level */}
                <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-6">
                  <p className="font-bold text-indigo-800 mb-2">🔓 Sistem Buka Level:</p>
                  <div className="flex flex-col md:flex-row gap-2 text-sm">
                    <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
                      <span>🟢</span>
                      <span className="text-green-800 font-semibold">Mudah → selalu terbuka</span>
                    </div>
                    <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-lg">
                      <span>🟡</span>
                      <span className="text-yellow-800 font-semibold">Sedang → selesaikan 2 soal Mudah (skor ≥ 60)</span>
                    </div>
                    <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg">
                      <span>🔴</span>
                      <span className="text-red-800 font-semibold">Sulit → selesaikan 2 soal Sedang (skor ≥ 60)</span>
                    </div>
                  </div>
                </div>
                {renderProblemList()}
              </div>
            ) : (
              /* ===== WORKSPACE SOAL ===== */
              <>
                {/* Header Soal — TANPA tombol Ganti Masalah, ada navigasi */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col gap-3">
                  {/* Baris 1: Badge level + tombol navigasi */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        currentProblem.level === 'Mudah' ? 'bg-green-100 text-green-800' : 
                        currentProblem.level === 'Sedang' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                        {currentProblem.level === 'Mudah' ? '🟢' : currentProblem.level === 'Sedang' ? '🟡' : '🔴'} {currentProblem.level}
                      </span>
                      <span className="text-xs text-gray-500">Soal {currentProblem.id} dari 9</span>
                      {completedProblems.includes(currentProblem.id) && (
                        <span className="flex items-center gap-1 text-green-700 text-xs font-bold bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> Selesai
                        </span>
                      )}
                    </div>
                    {/* Tombol navigasi */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setCurrentProblemIndex(null)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-semibold text-xs flex items-center gap-1">
                        📋 Daftar
                      </button>
                      {hasNextProblem() && (
                        <button onClick={goToNextProblem}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1">
                          Next <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Baris 2: Judul + Deskripsi */}
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800">{currentProblem.title}</h2>
                    <p className="text-sm text-gray-600 mt-1 text-justify">{currentProblem.description}</p>
                  </div>
                </div>
                </div>

                {/* Analisis IPO */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-yellow-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm flex-shrink-0">1</span>
                    Analisis Masalah (IPO)
                  </h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                    <p className="font-semibold text-yellow-900 mb-2 tets-sm">💡 Pertanyaan Pemantik:</p>
                    <ul className="space-y-1 text-xs md:text-sm text-yellow-800">
                      {currentProblem.hints.map((hint, idx) => <li key={idx}>• {hint}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-6">
                    {/* INPUT */}
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-blue-50">
                      <label className="block font-bold text-gray-800 mb-3 text-lg">
                        📥 Input (Masukan) - Pilih yang sesuai:
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {currentProblem.inputOptions.map((option, idx) => (
                          <label key={idx} className={`flex items-center gap-2 p-2 md:p-3 rounded-lg border-2 cursor-pointer transition-all ${analysis.selectedInputs.includes(option) ? 'bg-indigo-100 border-indigo-500 shadow-md' : 'bg-white border-gray-300 hover:border-indigo-300'}`}>
                            <input type="checkbox" checked={analysis.selectedInputs.includes(option)} onChange={() => toggleInput(option)} className="w-4 h-4 md:h-5 text-indigo-600 rounded" />
                            <span className="font-semibold text-gray-800 text-xs md:text-sm">{option}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">✅ Dipilih: {analysis.selectedInputs.length > 0 ? analysis.selectedInputs.join(', ') : 'Belum ada'}</p>
                    </div>
                    {/* PROSES */}
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-green-50">
                      <label className="block font-bold text-gray-800 mb-3 text-lg">
                        ⚙️ Proses (Langkah Algoritma) - Tulis penjelasan:
                      </label>
                      <textarea
                        value={analysis.processText}
                        onChange={(e) => setAnalysis({ ...analysis, processText: e.target.value })}
                        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none font-mono"
                        rows="4" placeholder="Contoh: luas = (alas × tinggi) / 2"
                      />
                      <div className="mt-3 bg-white p-3 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm font-semibold text-green-900 mb-1">💡 Kata kunci yang harus ada:</p>
                        <div className="flex flex-wrap gap-2">
                          {currentProblem.processKeywords.map((keyword, idx) => (
                            <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold ${analysis.processText.toLowerCase().includes(keyword.toLowerCase()) ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-600'}`}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Panjang: {analysis.processText.length} karakter (minimal 15)</p>
                    </div>
                    {/* OUTPUT */}
                    <div className="border-2 border-gray-200 rounded-lg p-4 bg-purple-50">
                     <label className="block font-bold text-gray-800 mb-3 text-lg">
                        📤 Output (Keluaran) - Pilih yang sesuai:
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {currentProblem.outputOptions.map((option, idx) => (
                          <label key={idx} className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${analysis.selectedOutputs.includes(option) ? 'bg-purple-100 border-purple-500 shadow-md' : 'bg-white border-gray-300 hover:border-purple-300'}`}>
                            <input type="checkbox" checked={analysis.selectedOutputs.includes(option)} onChange={() => toggleOutput(option)} className="w-5 h-5 text-purple-600 rounded" />
                            <span className="font-semibold text-gray-800">{option}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">✅ Dipilih: {analysis.selectedOutputs.length > 0 ? analysis.selectedOutputs.join(', ') : 'Belum ada'}</p>
                    </div>
                  </div>
                </div>

                {/* Flowchart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm flex-shrink-0">2</span>
                    Susun Flowchart
                  </h3>
                  <div className="mb-6">
                    <p className="font-semibold text-gray-700 mb-1">Pilih simbol lalu klik slot:</p>
                    <p className="text-xs text-gray-500 mb-3">
                      💡 <strong>Laptop:</strong> Klik simbol atau drag & drop ke slot | 
                      <strong> HP:</strong> Klik simbol dulu, lalu klik slot yang diinginkan.
                      Klik slot yang sudah terisi untuk menghapusnya.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {flowchartSymbols.map((symbol) => (
                      <div
                        key={symbol.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, symbol)}
                        onClick={() => handleSelectSymbol(symbol)}
                        className={`cursor-pointer hover:shadow-lg transition-all hover:scale-105
                          ${selectedSymbol?.id === symbol.id 
                            ? 'ring-4 ring-indigo-500 ring-offset-2 scale-105' 
                            : ''}`}
                      >
                        {/* TERMINATOR - oval */}
                        {(symbol.id === 'start' || symbol.id === 'end') && (
                        <div className="px-6 py-2 bg-green-100 border-2 border-green-400 rounded-full font-semibold text-sm text-center min-w-[100px]">
                        {symbol.name}
                      </div>
                    )}
                        {/* INPUT/OUTPUT - jajar genjang */}
                        {(symbol.id === 'input' || symbol.id === 'output') && (
                      <div className="px-6 py-2 bg-yellow-100 border-2 border-yellow-400 font-semibold text-sm text-center min-w-[100px]"
                        style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}>
                          {symbol.name}
                      </div>
                    )}
                        {/* PROSES - persegi panjang */}
                        {symbol.id === 'process' && (
                    <div className="px-6 py-2 bg-blue-100 border-2 border-blue-400 font-semibold text-sm text-center min-w-[100px]">
                        {symbol.name}
                      </div>
                    )}
                      {/* KEPUTUSAN - belah ketupat */}
                      {symbol.id === 'decision' && (
                  <div className="flex items-center justify-center bg-red-100 border-2 border-red-400 font-semibold text-sm text-center"
                      style={{
                      width: '110px',
                      height: '60px',
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    }}>
                      {symbol.name}
                      </div>
                    )}
                    </div>
                  ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="flex flex-col items-center gap-4">
                      {flowchart.map((symbol, idx) => (
                    <div key={idx}>
                    <div
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragOver={handleDragOver}
                      onClick={() => handleSlotClick(idx)}
                      className={`flex items-center justify-center cursor-pointer transition-all
                        ${selectedSymbol && !flowchart[idx] 
                          ? 'ring-2 ring-indigo-400 ring-offset-1 rounded-lg' 
                          : ''}`}
                      style={{ minHeight: '80px', minWidth: '220px' }}
                    >
                          {!symbol ? (
                            // Slot kosong
                            <div className="w-52 h-16 bg-white border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                              Slot {idx + 1}
                            </div>
                          ) : (
                            // Slot terisi - tampil sesuai bentuk
                            <>
                              {(symbol.id === 'start' || symbol.id === 'end') && (
                                <div className="px-8 py-3 bg-green-100 border-2 border-green-400 rounded-full font-semibold text-center min-w-[180px]">
                                  {symbol.name}
                                </div>
                              )}
                              {(symbol.id === 'input' || symbol.id === 'output') && (
                                <div className="px-8 py-3 bg-yellow-100 border-2 border-yellow-400 font-semibold text-center min-w-[180px]"
                                  style={{ clipPath: 'polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)' }}>
                                  {symbol.name}
                                </div>
                              )}
                              {symbol.id === 'process' && (
                                <div className="px-8 py-3 bg-blue-100 border-2 border-blue-400 font-semibold text-center min-w-[180px]">
                                  {symbol.name}
                                </div>
                              )}
                              {symbol.id === 'decision' && (
                                <div className="flex items-center justify-center bg-red-100 border-2 border-red-400 font-semibold text-center"
                                  style={{
                                    width: '200px',
                                    height: '90px',
                                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                                  }}>
                                  {symbol.name}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                          {idx < flowchart.length - 1 && <div className="flex justify-center my-2 text-gray-400 text-2xl">↓</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulasi */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                  <h3 className="text-base md:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                    Simulasi dan Feedback
                  </h3>
                  <button onClick={runSimulation}
                    className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 text-sm">
                    <Play size={16} /> Jalankan Simulasi
                  </button>
                </div>

                  {showFeedback && simulationResult && (
                    <div className="space-y-4">
                      <div className={`p-6 rounded-lg border-2 ${simulationResult.status === 'Baik' ? 'bg-green-50 border-green-500' : simulationResult.status === 'Cukup' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-2xl font-bold text-gray-800">Skor: {simulationResult.score}/100</h4>
                          <span className={`px-4 py-2 rounded-full font-bold ${simulationResult.status === 'Baik' ? 'bg-green-200 text-green-900' : simulationResult.status === 'Cukup' ? 'bg-yellow-200 text-yellow-900' : 'bg-red-200 text-red-900'}`}>
                            {simulationResult.status}
                          </span>
                        </div>

                        {simulationResult.feedback.length > 0 && (
                          <div className="mb-4">
                            <p className="font-bold text-green-900 mb-2 flex items-center gap-2"><CheckCircle size={20} /> Yang Sudah Baik:</p>
                            <ul className="space-y-1">{simulationResult.feedback.map((fb, idx) => <li key={idx} className="text-gray-700">✓ {fb}</li>)}</ul>
                          </div>
                        )}
                        {simulationResult.errors.length > 0 && (
                          <div>
                            <p className="font-bold text-red-900 mb-2 flex items-center gap-2"><AlertCircle size={20} /> Perlu Diperbaiki:</p>
                            <ul className="space-y-1">{simulationResult.errors.map((err, idx) => <li key={idx} className="text-gray-700">✗ {err}</li>)}</ul>
                          </div>
                        )}
                      </div>

                      {/* Tombol Next muncul di sini jika skor >= 60 */}
                      {simulationResult.score >= 60 && (
                        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-green-900 text-lg">🎉 Selamat! Skor Anda ≥ 60</p>
                              <p className="text-sm text-green-700 mt-1">
                                {hasNextProblem()
                                  ? 'Lanjut ke soal berikutnya atau kembali ke daftar soal.'
                                  : 'Anda telah menyelesaikan semua soal yang tersedia!'}
                              </p>
                            </div>
                            <div className="flex gap-3">
                              <button onClick={() => setCurrentProblemIndex(null)}
                                className="px-4 py-2 bg-white border-2 border-green-400 hover:bg-green-50 rounded-lg text-green-800 font-semibold text-sm">
                                📋 Daftar Soal
                              </button>
                              {hasNextProblem() && (
                                <button onClick={goToNextProblem}
                                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-2">
                                  Soal Berikutnya <ChevronRight size={18} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {simulationResult.score < 60 && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <p className="text-sm text-blue-900">
                            <strong>💡 Tips:</strong> Perhatikan feedback di atas. Perbaiki analisis dan flowchart Anda, lalu jalankan simulasi lagi!
                          </p>
                        </div>
                      )}

                      <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          {isSaving ? (
                            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-900"></div><p className="text-sm text-green-700">Menyimpan...</p></>
                          ) : (
                            <><CheckCircle size={20} className="text-green-600" /><div><p className="font-bold text-green-900">✅ Data Tersimpan ke Database Guru!</p><p className="text-sm text-green-700">Hasil simulasi Anda sudah dikirim ke spreadsheet guru</p></div></>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {!showFeedback && (
                    <div className="text-center py-12 text-gray-500">
                      <Play size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>Lengkapi analisis dan flowchart, lalu klik tombol Jalankan Simulasi</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlgoritmaDashboard;
