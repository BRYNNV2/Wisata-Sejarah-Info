export interface HistoricalSite {
  id: string;
  name: string;
  nameLocal: string;
  category: "temple" | "palace" | "monument" | "fort" | "museum" | "site";
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    province: string;
  };
  description: string;
  shortDesc: string;
  period: string;
  yearBuilt: string;
  rating: number;
  reviewCount: number;
  openHours: string;
  ticketPrice: string;
  heroImage: ReturnType<typeof require>;
  tags: string[];
  highlights: string[];
  tips: string[];
  isFavorite?: boolean;
}

const borobudurImg = require("../assets/images/hero_borobudur.png");
const prambananImg = require("../assets/images/hero_prambanan.png");

export const HISTORICAL_SITES: HistoricalSite[] = [
  {
    id: "1",
    name: "Borobudur Temple",
    nameLocal: "Candi Borobudur",
    category: "temple",
    location: {
      latitude: -7.6079,
      longitude: 110.2038,
      address: "Jl. Badrawati, Borobudur",
      city: "Magelang",
      province: "Jawa Tengah",
    },
    description:
      "Borobudur adalah candi Buddha Mahayana abad ke-9 di Kabupaten Magelang, Jawa Tengah. Ini adalah candi Buddha terbesar di dunia dan monumen Buddha terbesar di dunia. Dibangun pada masa Dinasti Sailendra, Borobudur terdaftar sebagai Situs Warisan Dunia UNESCO.",
    shortDesc: "Candi Buddha terbesar di dunia & Situs Warisan Dunia UNESCO",
    period: "Era Buddha",
    yearBuilt: "Abad ke-9 (770–842 M)",
    rating: 4.9,
    reviewCount: 48203,
    openHours: "06:00 - 17:00",
    ticketPrice: "Rp 350.000",
    heroImage: borobudurImg,
    tags: ["UNESCO", "Buddhist", "Temple", "World Heritage"],
    highlights: [
      "2.672 panel relief yang menceritakan kisah-kisah Buddhis",
      "72 stupa yang menampung patung Buddha",
      "Pemandangan panorama Gunung Merapi dan Merbabu",
      "Pengalaman menyaksikan matahari terbit",
    ],
    tips: [
      "Kunjungi saat matahari terbit untuk pengalaman terbaik dan lebih sedikit keramaian",
      "Kenakan sepatu yang nyaman untuk menaiki tangga yang curam",
      "Kain batik diperlukan dan disediakan di pintu masuk",
      "Pesan tiket jauh-jauh hari pada musim ramai",
    ],
  },
  {
    id: "2",
    name: "Prambanan Temple",
    nameLocal: "Candi Prambanan",
    category: "temple",
    location: {
      latitude: -7.7520,
      longitude: 110.4914,
      address: "Jl. Raya Solo - Yogyakarta",
      city: "Sleman",
      province: "DI Yogyakarta",
    },
    description:
      "Prambanan adalah kompleks candi Hindu abad ke-9 yang didedikasikan untuk Trimurti (Brahma, Wisnu, dan Siwa). Ini adalah situs candi Hindu terbesar di Indonesia dan terbesar kedua di Asia Tenggara. Candi ini dibangun sekitar 850 M dan merupakan Situs Warisan Dunia UNESCO.",
    shortDesc: "Candi Hindu megah abad ke-9, Situs Warisan Dunia UNESCO",
    period: "Era Hindu",
    yearBuilt: "Abad ke-9 (~850 M)",
    rating: 4.8,
    reviewCount: 36142,
    openHours: "06:00 - 17:00",
    ticketPrice: "Rp 350.000",
    heroImage: prambananImg,
    tags: ["UNESCO", "Hindu", "Temple", "World Heritage"],
    highlights: [
      "Candi Siwa utama setinggi 47 meter",
      "Relief Ramayana yang terpahat dengan detail",
      "Tiga candi utama untuk Brahma, Wisnu, Siwa",
      "Latar belakang matahari terbenam yang spektakuler",
    ],
    tips: [
      "Pemandangan matahari terbenam dari candi sangat spektakuler",
      "Pertunjukan Ballet Ramayana setiap Selasa & Kamis",
      "Gabungkan dengan Candi Borobudur untuk tur satu hari penuh",
      "Kenakan alas kaki yang nyaman untuk berjalan-jalan",
    ],
  },
  {
    id: "3",
    name: "Keraton Yogyakarta",
    nameLocal: "Keraton Ngayogyakarta Hadiningrat",
    category: "palace",
    location: {
      latitude: -7.8052,
      longitude: 110.3642,
      address: "Jl. Rotowijayan Blok No. 1",
      city: "Yogyakarta",
      province: "DI Yogyakarta",
    },
    description:
      "Keraton Yogyakarta adalah istana kerajaan Kesultanan Yogyakarta. Ini adalah kursi pemerintahan Kesultanan Yogyakarta dan museum hidup yang menampilkan budaya, arsitektur, dan tradisi Jawa. Masih ditinggali oleh Sultan dan keluarganya.",
    shortDesc: "Istana kerajaan hidup, jantung budaya Jawa",
    period: "Kerajaan Jawa",
    yearBuilt: "1755–1756 M",
    rating: 4.7,
    reviewCount: 22845,
    openHours: "08:30 - 14:00",
    ticketPrice: "Rp 15.000",
    heroImage: prambananImg,
    tags: ["Palace", "Javanese", "Royal", "Cultural"],
    highlights: [
      "Arsitektur Jawa tradisional yang autentik",
      "Museum kerajaan dengan artefak kuno",
      "Pertunjukan musik gamelan",
      "Koleksi wayang kulit",
    ],
    tips: [
      "Kunjungi pada pagi hari weekday untuk pertunjukan budaya",
      "Berpakaian sopan — kain batik bisa disewa di pintu masuk",
      "Tur berpemandu tersedia dalam Bahasa Inggris",
      "Fotografi diperbolehkan di sebagian besar area",
    ],
  },
  {
    id: "4",
    name: "Fort Rotterdam",
    nameLocal: "Benteng Rotterdam",
    category: "fort",
    location: {
      latitude: -5.1311,
      longitude: 119.4060,
      address: "Jl. Ujung Pandang",
      city: "Makassar",
      province: "Sulawesi Selatan",
    },
    description:
      "Benteng Rotterdam adalah benteng yang dibangun Portugis berlokasi di Makassar, Sulawesi Selatan. Dibangun kembali oleh VOC Belanda pada 1667 setelah Perang Makassar, benteng ini berfungsi sebagai pusat kekuasaan kolonial Belanda di Indonesia timur. Saat ini menampung museum dengan artefak bersejarah.",
    shortDesc: "Benteng kolonial Belanda abad ke-17 di pesisir Makassar",
    period: "Era Kolonial",
    yearBuilt: "1545 M (dibangun ulang 1667)",
    rating: 4.6,
    reviewCount: 15623,
    openHours: "08:00 - 18:00",
    ticketPrice: "Rp 20.000",
    heroImage: borobudurImg,
    tags: ["Fort", "Colonial", "Dutch", "Historical"],
    highlights: [
      "Arsitektur kolonial Belanda yang terpelihara baik",
      "Museum La Galigo di dalam benteng",
      "Lokasi tepi laut dengan pemandangan indah",
      "Tempat penahanan Pangeran Diponegoro",
    ],
    tips: [
      "Kunjungi pada sore hari untuk pemandangan matahari terbenam yang indah",
      "Museum La Galigo memiliki artefak Sulawesi yang sangat baik",
      "Fotografi bagus dari tembok pertahanan benteng",
      "Gabungkan dengan makan malam seafood di tepi laut terdekat",
    ],
  },
  {
    id: "5",
    name: "National Museum of Indonesia",
    nameLocal: "Museum Nasional Indonesia",
    category: "museum",
    location: {
      latitude: -6.1769,
      longitude: 106.8225,
      address: "Jl. Medan Merdeka Barat No.12",
      city: "Jakarta",
      province: "DKI Jakarta",
    },
    description:
      "Museum Nasional Indonesia, juga dikenal sebagai Museum Gajah, adalah museum besar yang berlokasi di Jakarta. Museum ini menyimpan koleksi artefak budaya Indonesia yang luas, benda-benda arkeologi, dan dokumen bersejarah yang mencakup ribuan tahun.",
    shortDesc: "Museum budaya dan arkeologi utama Indonesia",
    period: "Era Kolonial / Modern",
    yearBuilt: "1778 M",
    rating: 4.5,
    reviewCount: 19847,
    openHours: "08:00 - 16:00 (Tutup Senin)",
    ticketPrice: "Rp 5.000",
    heroImage: borobudurImg,
    tags: ["Museum", "National", "Archaeological", "Collection"],
    highlights: [
      "Lebih dari 140.000 artefak budaya",
      "Koleksi perhiasan emas Jawa kuno",
      "Pameran prasejarah dan arkeologi",
      "Peta dan manuskrip era kolonial",
    ],
    tips: [
      "Tutup pada hari Senin — rencanakan kunjungan sesuai",
      "Tur berpemandu tersedia dalam Bahasa Inggris dan Indonesia",
      "Patung gajah perunggu di luar sangat ikonik",
      "Sisihkan setidaknya 2-3 jam untuk menjelajahi dengan baik",
    ],
  },
  {
    id: "6",
    name: "Trowulan Archaeological Site",
    nameLocal: "Situs Trowulan",
    category: "site",
    location: {
      latitude: -7.5539,
      longitude: 112.3794,
      address: "Trowulan, Mojokerto",
      city: "Mojokerto",
      province: "Jawa Timur",
    },
    description:
      "Trowulan adalah ibu kota Kerajaan Majapahit, kerajaan Hindu-Buddha terbesar dalam sejarah Asia Tenggara. Situs arkeologi ini berisi reruntuhan candi, kolam, dan artefak dari abad ke-13 hingga ke-15. Dianggap sebagai salah satu situs arkeologi terpenting di Indonesia.",
    shortDesc: "Ibu kota kuno Kerajaan Majapahit yang perkasa",
    period: "Kerajaan Majapahit",
    yearBuilt: "Abad ke-13 - 15 M",
    rating: 4.4,
    reviewCount: 8934,
    openHours: "07:00 - 17:00",
    ticketPrice: "Rp 15.000",
    heroImage: prambananImg,
    tags: ["Majapahit", "Archaeological", "Empire", "Ancient"],
    highlights: [
      "Reruntuhan kota ibu kota Majapahit",
      "Candi Tikus (pemandian bawah tanah)",
      "Pendopo Agung, pavilion kerajaan",
      "Museum Trowulan dengan artefak Majapahit",
    ],
    tips: [
      "Sewa sepeda untuk menjelajahi area situs yang luas",
      "Kunjungi Museum Trowulan terlebih dahulu untuk konteks sejarah",
      "Kunjungi di musim kemarau untuk kondisi jalan yang lebih baik",
      "Hire pemandu lokal untuk cerita Majapahit yang autentik",
    ],
  },
];

export const CATEGORIES = [
  { id: "all", label: "Semua", icon: "globe" },
  { id: "temple", label: "Candi", icon: "home" },
  { id: "palace", label: "Istana", icon: "star" },
  { id: "fort", label: "Benteng", icon: "shield" },
  { id: "museum", label: "Museum", icon: "book" },
  { id: "site", label: "Situs", icon: "map-pin" },
];
