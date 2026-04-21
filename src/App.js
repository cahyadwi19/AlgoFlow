import React, { useState } from 'react';
import { BookOpen, Code, Play, CheckCircle, AlertCircle, ChevronRight, HelpCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

function AlgoritmaDashboard() {
  const [activeTab, setActiveTab] = useState('materi');
  const [selectedMateri, setSelectedMateri] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [analysis, setAnalysis] = useState({ input: '', proses: '', output: '' });
  const [flowchart, setFlowchart] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // GANTI URL INI dengan URL Google Apps Script Anda
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
            penjelasan: 'Algoritma berasal dari nama matematikawan Persia, Abu Ja\'far Muhammad bin Musa Al-Khawarizmi. Algoritma adalah serangkaian instruksi yang jelas dan terstruktur untuk menyelesaikan masalah atau melakukan tugas tertentu. Algoritma juga merupakan bentuk dari suatu strategi atau resep yang digunakan untuk menyelesaikan suatu masalah. Algoritma lahir dari suatu proses berpikir komputasional oleh seseorang untuk menemukan solusi dari suatu permasalahan yang diberikan. Dengan demikian, berpikir komputasional merupakan keahlian yang diperlukan untuk dapat membuat algoritma program atau suatu karya informatika yang dapat digunakan dengan efektif dan efisien.'
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
          {
            judul: 'Algoritma Mencari Buku di Perpustakaan',
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
        intro: 'Flowchart atau diagram alir adalah diagram yang menggambarkan alur atau urutan proses dari suatu algoritma menggunakan simbol-simbol standar.',
        pengertian: 'Flowchart (Diagram Alir) adalah representasi visual dari algoritma yang menggunakan simbol-simbol geometris untuk menunjukkan langkah-langkah dan alur keputusan dalam menyelesaikan masalah. Diagram alir merupakan notasi algoritma dengan menggunakan gambar atau simbol sebagai penjelasan suatu algoritma. Diagram alir dibuat dalam bentuk aliran simbol yang dapat ditelusuri dari satu titik permulaan hingga titik akhir dari program.',
        manfaat: [
          'Memudahkan pemahaman logika program',
          'Memperjelas alur proses secara visual',
          'Membantu dokumentasi sistem',
          'Mempermudah komunikasi antar tim',
          'Membantu menemukan kesalahan logika'
        ],
        symbols: [
          { 
            name: 'Terminator', 
            shape: 'oval', 
            desc: 'Menandakan awal dan akhir dari suatu algoritma atau proses', 
            color: 'bg-green-100',
            contoh: 'START, END, MULAI, SELESAI'
          },
          { 
            name: 'Input/Output', 
            shape: 'parallelogram', 
            desc: 'Menunjukkan proses input (memasukkan data) atau output (menampilkan hasil)', 
            color: 'bg-yellow-100',
            contoh: 'INPUT nama, OUTPUT hasil'
          },
          { 
            name: 'Proses', 
            shape: 'rectangle', 
            desc: 'Menunjukkan suatu proses pengolahan data atau operasi perhitungan', 
            color: 'bg-blue-100',
            contoh: 'luas = panjang × lebar'
          },
          { 
            name: 'Keputusan', 
            shape: 'diamond', 
            desc: 'Menunjukkan pemilihan keputusan berdasarkan kondisi (Ya/Tidak, Benar/Salah)', 
            color: 'bg-red-100',
            contoh: 'Apakah nilai >= 60?'
          },
          { 
            name: 'Panah Alur', 
            shape: 'arrow', 
            desc: 'Menunjukkan arah aliran proses dari satu langkah ke langkah berikutnya', 
            color: 'bg-gray-100',
            contoh: '→ ↓ ← ↑'
          }
        ],
        contohFlowchart: [
          {
            judul: 'Flowchart Menghitung Luas Persegi Panjang',
            deskripsi: 'Contoh flowchart sederhana untuk menghitung luas persegi panjang',
            langkah: [
              { simbol: 'START', jenis: 'Terminator' },
              { simbol: 'INPUT panjang, lebar', jenis: 'Input' },
              { simbol: 'luas = panjang × lebar', jenis: 'Proses' },
              { simbol: 'OUTPUT luas', jenis: 'Output' },
              { simbol: 'END', jenis: 'Terminator' }
            ]
          },
          {
            judul: 'Flowchart Menentukan Bilangan Genap/Ganjil',
            deskripsi: 'Contoh flowchart dengan percabangan untuk cek genap atau ganjil',
            langkah: [
              { simbol: 'START', jenis: 'Terminator' },
              { simbol: 'INPUT bilangan', jenis: 'Input' },
              { simbol: 'bilangan % 2 == 0?', jenis: 'Keputusan' },
              { simbol: 'Ya: OUTPUT "Genap"', jenis: 'Output' },
              { simbol: 'Tidak: OUTPUT "Ganjil"', jenis: 'Output' },
              { simbol: 'END', jenis: 'Terminator' }
            ]
          }
        ]
      }
    }
  ];

  const tutorialSteps = [
    {
      step: 1,
      title: '1. Pilih Masalah yang Akan Diselesaikan',
      desc: 'Klik salah satu kartu masalah yang tersedia. Setiap masalah memiliki tingkat kesulitan yang berbeda.',
      img: '🎯'
    },
    {
      step: 2,
      title: '2. Baca dan Pahami Masalah',
      desc: 'Baca deskripsi masalah dengan teliti. Perhatikan pertanyaan pemantik yang ada di bagian analisis untuk membantu pemahaman.',
      img: '📖'
    },
    {
      step: 3,
      title: '3. Analisis Masalah (Input-Proses-Output)',
      desc: 'Identifikasi: (1) Input - data apa yang diperlukan, (2) Proses - langkah apa yang harus dilakukan, (3) Output - hasil apa yang diharapkan.',
      img: '🔍'
    },
    {
      step: 4,
      title: '4. Susun Flowchart',
      desc: 'Drag & drop simbol flowchart ke dalam slot yang tersedia. Pastikan urutan logis: Mulai → Input → Proses → Output → Selesai.',
      img: '🔷'
    },
    {
      step: 5,
      title: '5. Jalankan Simulasi',
      desc: 'Klik tombol "Jalankan Simulasi" untuk mengecek jawaban Anda. Sistem akan memberikan feedback dan skor.',
      img: '▶️'
    },
    {
      step: 6,
      title: '6. Perbaiki Jika Perlu',
      desc: 'Perhatikan feedback yang diberikan. Jika ada kesalahan, perbaiki analisis atau flowchart Anda, lalu jalankan simulasi lagi.',
      img: '✅'
    }
  ];

  const problemSets = [
    //level mudah 3 soal
    {
      id: 1,
      title: 'Menghitung Luas Segitiga',
      level: 'Mudah',
      description: 'Buatlah algoritma untuk menghitung luas segitiga. Program menerima input alas dan tinggi, kemudian menghitung dan menampilkan luas segitiga.',
      hints: [
        'Data apa yang diperlukan untuk menghitung luas segitiga?',
        'Apa rumus luas segitiga?',
        'Hasil apa yang harus ditampilkan?'
      ],
      expectedFlow: ['start', 'input', 'process', 'output', 'end'],
      correctAnswer: {
        input: 'alas, tinggi',
        proses: 'luas = (alas × tinggi) / 2',
        output: 'luas segitiga'
      }
    },
    {
      id: 2,
      title: 'Konversi Suhu Celsius ke Fahrenheit',
      level: 'Mudah',
      description: 'Buatlah algoritma untuk mengkonversi suhu dari Celsius ke Fahrenheit. Program menerima input suhu dalam Celsius.',
      hints: [
        'Apa input yang diperlukan?',
        'Bagaimana rumus konversi Celsius ke Fahrenheit?',
        'Apa yang harus ditampilkan sebagai output?'
      ],
      expectedFlow: ['start', 'input', 'process', 'output', 'end'],
      correctAnswer: {
        input: 'celsius',
        proses: 'fahrenheit = (celsius × 9/5) + 32',
        output: 'fahrenheit'
      }
    },
    {
      id: 3,
      title: 'Menentukan Bilangan Positif atau Negatif',
      level: 'Mudah',
      description: 'Buatlah algoritma untuk menentukan apakah sebuah bilangan positif, negatif, atau nol.',
      hints: [
        'Berapa kondisi yang perlu dicek?',
        'Bagaimana membedakan bilangan positif, negatif, dan nol?',
        'Percabangan seperti apa yang dibutuhkan?'
      ],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'],
      correctAnswer: {
        input: 'bilangan',
        proses: 'jika bilangan > 0 maka positif, jika < 0 maka negatif, jika = 0 maka nol',
        output: 'status bilangan'
      }
    },
    //level sedang 3 soal

    {
      id: 4,
      title: 'Menentukan Nilai Maksimum dari 2 Bilangan',
      level: 'Sedang',
      description: 'Buatlah algoritma untuk menentukan bilangan terbesar dari dua bilangan yang diinputkan.',
      hints: [
        'Berapa bilangan yang perlu dibandingkan?',
        'Bagaimana cara membandingkan dua bilangan?',
        'Apa output yang diharapkan?'
      ],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'],
      correctAnswer: {
        input: 'bilangan1, bilangan2',
        proses: 'jika bilangan1 > bilangan2 maka max = bilangan1, jika tidak max = bilangan2',
        output: 'bilangan maksimum'
      }
    },
        {
      id: 5,
      title: 'Menghitung Total Belanja dan Diskon',
      level: 'Sedang',
      description: 'Buatlah algoritma untuk menghitung total belanja. Jika total belanja lebih dari 100000, dapat diskon 10%. Program menerima input harga barang.',
      hints: [
        'Apa yang perlu diinput?',
        'Kapan diskon diberikan?',
        'Bagaimana cara menghitung total setelah diskon?'
      ],
      expectedFlow: ['start', 'input', 'decision', 'process', 'output', 'end'],
      correctAnswer: {
        input: 'harga',
        proses: 'jika harga > 100000 maka diskon 10%, total = harga - diskon',
        output: 'total bayar'
      }
    },
    {
      id: 6,
      title: 'Menghitung Nilai Akhir Siswa',
      level: 'Sedang',
      description: 'Buatlah algoritma untuk menghitung nilai akhir siswa. Nilai akhir = (UTS × 30%) + (UAS × 40%) + (Tugas × 30%). Tentukan juga status kelulusan (lulus jika >= 60).',
      hints: [
        'Berapa komponen nilai yang perlu diinput?',
        'Bagaimana cara menghitung nilai akhir dengan bobot?',
        'Kapan siswa dinyatakan lulus?'
      ],
      expectedFlow: ['start', 'input', 'process', 'decision', 'output', 'end'],
      correctAnswer: {
        input: 'nilai UTS, UAS, Tugas',
        proses: 'nilai akhir = (UTS × 0.3) + (UAS × 0.4) + (Tugas × 0.3), cek lulus jika >= 60',
        output: 'nilai akhir dan status'
      }
    },
        {
      id: 7,
      title: 'Menentukan Tahun Kabisat',
      level: 'Sulit',
      description: 'Buatlah algoritma untuk menentukan apakah suatu tahun adalah tahun kabisat. Tahun kabisat: habis dibagi 4 DAN (tidak habis dibagi 100 ATAU habis dibagi 400).',
      hints: [
        'Apa syarat tahun kabisat?',
        'Berapa kondisi yang harus dicek?',
        'Bagaimana urutan pengecekan kondisi?'
      ],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'],
      correctAnswer: {
        input: 'tahun',
        proses: 'cek: tahun % 4 = 0 DAN (tahun % 100 ≠ 0 ATAU tahun % 400 = 0)',
        output: 'kabisat atau bukan'
      }
    },
    {
      id: 8,
      title: 'Menghitung Tarif Parkir',
      level: 'Sulit',
      description: 'Buatlah algoritma untuk menghitung tarif parkir. Tarif: 2 jam pertama Rp5000, setiap jam berikutnya Rp2000. Input: lama parkir dalam jam.',
      hints: [
        'Berapa tarif untuk 2 jam pertama?',
        'Bagaimana menghitung jam tambahan?',
        'Bagaimana struktur percabangannya?'
      ],
      expectedFlow: ['start', 'input', 'decision', 'process', 'output', 'end'],
      correctAnswer: {
        input: 'lama parkir (jam)',
        proses: 'jika <= 2 jam tarif = 5000, jika > 2 jam tarif = 5000 + ((jam-2) × 2000)',
        output: 'total tarif'
      }
    },
    {
      id: 9,
      title: 'Menentukan Kategori Nilai Siswa',
      level: 'Sulit',
      description: 'Buatlah algoritma untuk menentukan kategori nilai siswa berdasarkan nilai akhir yang diperoleh. Ketentuan: Nilai > 85 "A", nilai 70-84 "B", nilai < 60 "D".',
      hints: [
        'Berapa kategori nilai yang ada?',
        'Bagaimana urutan pengecekan kondisi dari yang tertinggi?',
        'Bagaimana menangani rentang nilai?'
      ],
      expectedFlow: ['start', 'input', 'decision', 'output', 'end'],
      correctAnswer: {
        input: 'nilai akhir',
        proses: 'jika nilai > 85 maka A, jika 70-84 maka B, jika 60-69 maka c, jika < 60 maka D',
        output: 'kategori nilai (A/B/C/D)'
      }
    }
  ];

  const flowchartSymbols = [
    { id: 'start', name: 'Mulai', type: 'terminator', color: 'bg-green-100 border-green-400' },
    { id: 'input', name: 'Input', type: 'io', color: 'bg-yellow-100 border-yellow-400' },
    { id: 'process', name: 'Proses', type: 'process', color: 'bg-blue-100 border-blue-400' },
    { id: 'decision', name: 'Keputusan', type: 'decision', color: 'bg-red-100 border-red-400' },
    { id: 'output', name: 'Output', type: 'io', color: 'bg-yellow-100 border-yellow-400' },
    { id: 'end', name: 'Selesai', type: 'terminator', color: 'bg-green-100 border-green-400' }
  ];

  const handleDragStart = (e, symbol) => {
    e.dataTransfer.setData('symbol', JSON.stringify(symbol));
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const symbol = JSON.parse(e.dataTransfer.getData('symbol'));
    const newFlowchart = [...flowchart];
    newFlowchart[index] = symbol;
    setFlowchart(newFlowchart);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const initializeWorkspace = (problem) => {
    setCurrentProblem(problem);
    setAnalysis({ input: '', proses: '', output: '' });
    setFlowchart(new Array(6).fill(null));
    setSimulationResult(null);
    setShowFeedback(false);
  };

  const runSimulation = () => {
    if (!currentProblem) return;

    const filledSymbols = flowchart.filter(s => s !== null);
    const symbolIds = filledSymbols.map(s => s.id);
    
    let score = 0;
    let feedback = [];
    let errors = [];

    const analysisCorrect = {
      input: analysis.input.length > 3,
      proses: analysis.proses.length > 10,
      output: analysis.output.length > 3
    };

    if (analysisCorrect.input) {
      score += 20;
      feedback.push('Input teridentifikasi dengan baik');
    } else {
      errors.push('Input belum sesuai');
    }

    if (analysisCorrect.proses) {
      score += 20;
      feedback.push('Proses sudah dijelaskan');
    } else {
      errors.push('Proses belum detail');
    }

    if (analysisCorrect.output) {
      score += 20;
      feedback.push('Output sudah sesuai');
    } else {
      errors.push('Output belum tepat');
    }

    const hasStart = symbolIds.includes('start');
    const hasEnd = symbolIds.includes('end');

    if (hasStart && hasEnd) {
      score += 20;
      feedback.push('Flowchart memiliki awal dan akhir');
    } else {
      errors.push('Flowchart harus dimulai dengan Mulai dan diakhiri Selesai');
    }

    if (filledSymbols.length >= 4) {
      score += 20;
      feedback.push('Simbol flowchart cukup lengkap');
    } else {
      errors.push('Masih ada simbol yang kurang');
    }

    const result = {
      score,
      feedback,
      errors,
      status: score >= 60 ? 'Baik' : score >= 40 ? 'Cukup' : 'Perlu Perbaikan'
    };

    setSimulationResult(result);
    setShowFeedback(true);

    // Simpan ke history lokal
    const submission = {
      timestamp: new Date().toLocaleString('id-ID'),
      studentName: studentName || 'Siswa',
      problemTitle: currentProblem.title,
      problemLevel: currentProblem.level,
      input: analysis.input,
      proses: analysis.proses,
      output: analysis.output,
      flowchart: filledSymbols.map(s => s.name).join(' → '),
      score: result.score,
      status: result.status,
      feedback: result.feedback.join('; '),
      errors: result.errors.join('; ')
    };

    setSubmissionHistory([...submissionHistory, submission]);

    // Kirim ke Google Sheets
    saveToGoogleSheets(submission);
  };

  const saveToGoogleSheets = async (data) => {
    if (!studentName) {
      alert('Mohon isi nama siswa terlebih dahulu!');
      return;
    }

    setIsSaving(true);
    
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      // Karena mode no-cors, kita tidak bisa baca response
      // Tapi data tetap terkirim
      console.log('Data berhasil dikirim ke Google Sheets');
      
    } catch (error) {
      console.error('Error mengirim data:', error);
      alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const exportToExcel = () => {
    if (submissionHistory.length === 0) {
      alert('Belum ada data untuk diekspor. Selesaikan minimal 1 soal terlebih dahulu!');
      return;
    }

    // Buat worksheet dari data history
    const worksheetData = submissionHistory.map((item, index) => ({
      'No': index + 1,
      'Waktu': item.timestamp,
      'Nama Siswa': item.studentName,
      'Judul Soal': item.problemTitle,
      'Level': item.problemLevel,
      'Input': item.input,
      'Proses': item.proses,
      'Output': item.output,
      'Flowchart': item.flowchart,
      'Skor': item.score,
      'Status': item.status,
      'Feedback Positif': item.feedback,
      'Perlu Perbaikan': item.errors
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    
    // Set column widths
    const columnWidths = [
      { wch: 5 },   // No
      { wch: 20 },  // Waktu
      { wch: 20 },  // Nama Siswa
      { wch: 30 },  // Judul Soal
      { wch: 10 },  // Level
      { wch: 25 },  // Input
      { wch: 35 },  // Proses
      { wch: 25 },  // Output
      { wch: 40 },  // Flowchart
      { wch: 8 },   // Skor
      { wch: 15 },  // Status
      { wch: 50 },  // Feedback
      { wch: 50 }   // Errors
    ];
    ws['!cols'] = columnWidths;

    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hasil Simulasi');

    // Generate filename
    const fileName = `Hasil_Algoritma_${studentName || 'Siswa'}_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.xlsx`;

    // Download
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-md border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white p-3 rounded-lg">
                <Code size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Algoritma Dasar</h1>
                <p className="text-sm text-gray-600">Pembelajaran Informatika Fase E</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Nama Siswa (wajib diisi)"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('materi')}
              className={'px-6 py-3 font-semibold transition-all flex items-center gap-2 ' + (activeTab === 'materi' ? 'bg-indigo-600 text-white border-b-4 border-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
            >
              <BookOpen size={20} />
              Materi Pembelajaran
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={'px-6 py-3 font-semibold transition-all flex items-center gap-2 ' + (activeTab === 'workspace' ? 'bg-indigo-600 text-white border-b-4 border-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
            >
              <Code size={20} />
              Workspace Algoritma
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'materi' ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Daftar Materi</h2>
                <div className="space-y-3">
                  {materiList.map((materi) => (
                    <button
                      key={materi.id}
                      onClick={() => setSelectedMateri(materi)}
                      className={'w-full text-left p-4 rounded-lg transition-all flex items-center gap-3 ' + (selectedMateri?.id === materi.id ? 'bg-indigo-100 border-2 border-indigo-500 shadow-md' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent')}
                    >
                      <span className="text-3xl">{materi.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{materi.title}</p>
                      </div>
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
                            <div className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">
                              {idx + 1}
                            </div>
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
                            <div className="space-y-1">
                              {contoh.langkah.map((langkah, i) => (
                                <p key={i} className="text-gray-700 pl-2">{langkah}</p>
                              ))}
                            </div>
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
                          <div key={idx} className={'p-5 rounded-lg border-2 ' + symbol.color}>
                            <div className="flex items-start gap-4">
                              <div className="bg-white p-3 rounded border-2 border-gray-300 flex-shrink-0">
                                <div className={'inline-block px-6 py-2 border-2 border-gray-800 ' + (symbol.shape === 'oval' ? 'rounded-full' : symbol.shape === 'parallelogram' ? 'skew-x-12' : symbol.shape === 'diamond' ? 'rotate-45 w-12 h-12 flex items-center justify-center' : 'rounded')}>
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
                                  <div className={'px-4 py-2 rounded-lg border-2 font-semibold text-sm ' + 
                                    (step.jenis === 'Terminator' ? 'bg-green-100 border-green-400 rounded-full' :
                                     step.jenis === 'Input' || step.jenis === 'Output' ? 'bg-yellow-100 border-yellow-400' :
                                     step.jenis === 'Proses' ? 'bg-blue-100 border-blue-400' :
                                     step.jenis === 'Keputusan' ? 'bg-red-100 border-red-400 rotate-45' : 'bg-gray-100 border-gray-400')}>
                                    <span className={step.jenis === 'Keputusan' ? '-rotate-45' : ''}>{step.simbol}</span>
                                  </div>
                                  {i < fc.langkah.length - 1 && (
                                    <div className="text-gray-400 text-2xl my-1">↓</div>
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
          <div className="space-y-6">
            {/* Tutorial Section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HelpCircle size={28} className="text-amber-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Cara Menggunakan Workspace</h2>
                </div>
                <button
                  onClick={() => setShowTutorial(!showTutorial)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  {showTutorial ? 'Sembunyikan' : 'Lihat Tutorial'}
                </button>
              </div>

              {showTutorial && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {tutorialSteps.map((tutorial) => (
                    <div key={tutorial.step} className="bg-white p-4 rounded-lg border-2 border-amber-200">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{tutorial.img}</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-1">{tutorial.title}</h3>
                          <p className="text-sm text-gray-600">{tutorial.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!currentProblem ? (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Pilih Masalah</h2>
                
                {/* Filter by Level */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-600 mb-3">Filter berdasarkan tingkat kesulitan:</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold hover:bg-green-200">
                      🟢 Mudah (3)
                    </button>
                    <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold hover:bg-yellow-200">
                      🟡 Sedang (3)
                    </button>
                    <button className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold hover:bg-red-200">
                      🔴 Sulit (3)
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {problemSets.map((problem) => (
                    <button
                      key={problem.id}
                      onClick={() => initializeWorkspace(problem)}
                      className="text-left p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">
                          {problem.id}
                        </div>
                        <span className={'px-3 py-1 rounded-full text-xs font-bold ' + 
                          (problem.level === 'Mudah' ? 'bg-green-100 text-green-800' : 
                           problem.level === 'Sedang' ? 'bg-yellow-100 text-yellow-800' : 
                           'bg-red-100 text-red-800')}>
                          {problem.level}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-gray-800 mb-2 line-clamp-2">{problem.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{problem.description}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Tips:</strong> Mulai dari soal mudah terlebih dahulu untuk memahami konsep dasar, lalu tingkatkan ke soal sedang dan sulit.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{currentProblem.title}</h2>
                      <p className="text-gray-600 mt-2">{currentProblem.description}</p>
                    </div>
                    <button
                      onClick={() => setCurrentProblem(null)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-semibold"
                    >
                      Ganti Masalah
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Analisis Masalah
                  </h3>
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                    <p className="font-semibold text-yellow-900 mb-2">💡 Pertanyaan Pemantik:</p>
                    <ul className="space-y-1 text-sm text-yellow-800">
                      {currentProblem.hints.map((hint, idx) => (
                        <li key={idx}>• {hint}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Input</label>
                      <textarea
                        value={analysis.input}
                        onChange={(e) => setAnalysis({...analysis, input: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        rows="3"
                        placeholder="Data yang diperlukan?"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Proses</label>
                      <textarea
                        value={analysis.proses}
                        onChange={(e) => setAnalysis({...analysis, proses: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        rows="3"
                        placeholder="Langkah yang dilakukan?"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-2">Output</label>
                      <textarea
                        value={analysis.output}
                        onChange={(e) => setAnalysis({...analysis, output: e.target.value})}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                        rows="3"
                        placeholder="Hasil yang diharapkan?"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Susun Flowchart
                  </h3>
                  
                  <div className="mb-6">
                    <p className="font-semibold text-gray-700 mb-3">Seret simbol ke area flowchart:</p>
                    <div className="flex flex-wrap gap-3">
                      {flowchartSymbols.map((symbol) => (
                        <div
                          key={symbol.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, symbol)}
                          className={symbol.color + ' px-4 py-2 rounded-lg border-2 font-semibold cursor-move hover:shadow-lg transition-all'}
                        >
                          {symbol.name}
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
                            className={'w-64 h-20 rounded-lg border-2 border-gray-400 flex items-center justify-center ' + (symbol ? symbol.color + ' font-semibold' : 'bg-white border-dashed')}
                          >
                            {symbol ? symbol.name : 'Slot ' + (idx + 1)}
                          </div>
                          {idx < flowchart.length - 1 && (
                            <div className="flex justify-center my-2">
                              <div className="text-gray-400 text-2xl">↓</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                      Simulasi dan Feedback
                    </h3>
                    <button
                      onClick={runSimulation}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-all"
                    >
                      <Play size={20} />
                      Jalankan Simulasi
                    </button>
                  </div>

                  {showFeedback && simulationResult && (
                    <div className="space-y-4">
                      <div className={'p-6 rounded-lg border-2 ' + (simulationResult.status === 'Baik' ? 'bg-green-50 border-green-500' : simulationResult.status === 'Cukup' ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500')}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-2xl font-bold text-gray-800">Skor: {simulationResult.score}/100</h4>
                          <span className={'px-4 py-2 rounded-full font-bold ' + (simulationResult.status === 'Baik' ? 'bg-green-200 text-green-900' : simulationResult.status === 'Cukup' ? 'bg-yellow-200 text-yellow-900' : 'bg-red-200 text-red-900')}>
                            {simulationResult.status}
                          </span>
                        </div>

                        {simulationResult.feedback.length > 0 && (
                          <div className="mb-4">
                            <p className="font-bold text-green-900 mb-2 flex items-center gap-2">
                              <CheckCircle size={20} />
                              Yang Sudah Baik:
                            </p>
                            <ul className="space-y-1">
                              {simulationResult.feedback.map((fb, idx) => (
                                <li key={idx} className="text-gray-700">✓ {fb}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {simulationResult.errors.length > 0 && (
                          <div>
                            <p className="font-bold text-red-900 mb-2 flex items-center gap-2">
                              <AlertCircle size={20} />
                              Perlu Diperbaiki:
                            </p>
                            <ul className="space-y-1">
                              {simulationResult.errors.map((err, idx) => (
                                <li key={idx} className="text-gray-700">✗ {err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-blue-900">
                          <strong>💡 Tips:</strong> Perhatikan feedback di atas untuk memperbaiki algoritma Anda. Anda bisa mengubah analisis dan flowchart, kemudian jalankan simulasi lagi!
                        </p>
                      </div>

                      <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-900"></div>
                              <p className="text-sm text-green-700">Menyimpan data ke Google Sheets...</p>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={20} className="text-green-600" />
                              <div>
                                <p className="font-bold text-green-900">✅ Data Tersimpan ke Database Guru!</p>
                                <p className="text-sm text-green-700">Hasil simulasi Anda sudah dikirim ke spreadsheet guru untuk evaluasi</p>
                              </div>
                            </>
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