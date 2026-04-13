import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { HistoricalSite } from "@/constants/sites";

interface RecommendationCardProps {
  site: HistoricalSite;
}

const RECOMMENDATIONS: Record<string, string[]> = {
  "1": [
    "Kunjungi saat sunrise pukul 05:30 untuk pengalaman tak terlupakan",
    "Gabungkan dengan Prambanan Temple untuk tur Yogyakarta 1 hari penuh",
    "Menginap di Magelang untuk akses mudah dan lebih dekat",
    "Bawa kamera dengan lensa wide-angle untuk foto panorama terbaik",
  ],
  "2": [
    "Saksikan pertunjukan Sendratari Ramayana di malam hari",
    "Kunjungi pada musim kemarau (Mei–September) untuk cuaca terbaik",
    "Kombinasikan dengan Candi Borobudur dalam satu paket wisata",
    "Datang menjelang sore untuk menikmati siluet sunset yang indah",
  ],
  "3": [
    "Kunjungi saat pagi hari untuk menghindari keramaian turis",
    "Ikuti tur keliling Malioboro setelah mengunjungi Keraton",
    "Coba kuliner khas Jogja di sekitar area Keraton",
    "Sewa becak tradisional untuk pengalaman otentik Yogyakarta",
  ],
  "4": [
    "Nikmati pemandangan sunset terbaik dari benteng",
    "Kunjungi Museum La Galigo untuk sejarah lengkap Sulawesi",
    "Cicipi makanan laut segar di Pantai Losari setelah berkunjung",
    "Datang di akhir pekan untuk melihat pertunjukan budaya",
  ],
  "5": [
    "Datang di hari Selasa–Minggu karena museum tutup hari Senin",
    "Gunakan jasa pemandu wisata untuk penjelasan mendalam",
    "Kombinasikan dengan kunjungan ke Monas yang berdekatan",
    "Bawa air minum karena museum cukup luas untuk dijelajahi",
  ],
  "6": [
    "Sewa sepeda untuk menjelajahi area situs yang luas",
    "Kunjungi Museum Trowulan terlebih dahulu untuk konteks sejarah",
    "Kunjungi di musim kemarau untuk kondisi jalan yang lebih baik",
    "Hire pemandu lokal untuk cerita Majapahit yang autentik",
  ],
};

export function RecommendationCard({ site }: RecommendationCardProps) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const recs = RECOMMENDATIONS[site.id] || site.tips;

  const handleExpand = () => {
    if (!expanded) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setExpanded(true);
      }, 800);
    } else {
      setExpanded(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
      <TouchableOpacity
        onPress={handleExpand}
        style={styles.header}
        activeOpacity={0.8}
      >
        <View style={styles.titleRow}>
          <View style={[styles.iconBg, { backgroundColor: colors.primary }]}>
            <Feather name="zap" size={14} color="#fff" />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Rekomendasi AI</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Feather
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.mutedForeground}
          />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.recs}>
          {recs.map((rec, i) => (
            <View key={i} style={styles.recRow}>
              <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
              <Text style={[styles.recText, { color: colors.foreground }]}>{rec}</Text>
            </View>
          ))}
        </View>
      )}
      {!expanded && !loading && (
        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          Ketuk untuk rekomendasi personal berbasis AI
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    paddingLeft: 38,
  },
  recs: {
    marginTop: 12,
    gap: 10,
  },
  recRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  recText: {
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
});
