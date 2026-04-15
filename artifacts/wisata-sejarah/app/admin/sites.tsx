import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { HistoricalSite } from "@/constants/sites";
import { BatikHeader } from "@/components/BatikHeader";

const CATEGORY_COLORS: Record<string, string> = {
  temple: "#8B4513",
  palace: "#C4860A",
  fort: "#4A6FA5",
  museum: "#2D8A6E",
  site: "#7B5EA7",
  monument: "#C1440E",
};

const CATEGORY_LABELS: Record<string, string> = {
  temple: "Candi",
  palace: "Istana",
  fort: "Benteng",
  museum: "Museum",
  site: "Situs",
  monument: "Monumen",
};

export default function AdminSitesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { sites, deleteSite, resetSites } = useApp();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = sites.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (site: HistoricalSite) => {
    if (Platform.OS === "web") {
      if (window.confirm(`Hapus "${site.name}"? Tindakan ini tidak bisa dibatalkan.`)) {
        setDeleting(site.id);
        deleteSite(site.id).then(() => setDeleting(null));
      }
      return;
    }
    Alert.alert(
      "Hapus Destinasi",
      `Apakah Anda yakin ingin menghapus "${site.name}"?\nTindakan ini tidak bisa dibatalkan.`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            setDeleting(site.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await deleteSite(site.id);
            setDeleting(null);
          },
        },
      ]
    );
  };

  const handleReset = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Reset semua data ke bawaan? Semua perubahan akan hilang.")) {
        resetSites();
      }
      return;
    }
    Alert.alert(
      "Reset Data",
      "Reset semua destinasi ke data bawaan? Semua perubahan yang Anda buat akan hilang.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => resetSites() },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <BatikHeader style={{ paddingTop: topPadding + 10, paddingHorizontal: 16, paddingBottom: 14 }}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: "rgba(255,255,255,0.18)" }]}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Kelola Destinasi</Text>
            <Text style={styles.headerSub}>{sites.length} destinasi terdaftar</Text>
          </View>
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: "rgba(255,255,255,0.18)" }]}
            onPress={handleReset}
          >
            <Feather name="rotate-ccw" size={16} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>

        {/* Search on batik */}
        <View style={[styles.searchBar, { backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.25)" }]}>
          <Feather name="search" size={16} color="rgba(255,255,255,0.7)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari destinasi..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={[styles.searchInput, { color: "#fff" }]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={15} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </View>
      </BatikHeader>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: bottomPadding + 90,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.foreground }]}>
              Tidak ada destinasi
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const catColor = CATEGORY_COLORS[item.category] ?? colors.primary;
          const isBeingDeleted = deleting === item.id;
          return (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: isBeingDeleted ? 0.5 : 1,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={[styles.catBadge, { backgroundColor: catColor + "18" }]}>
                  <Text style={[styles.catText, { color: catColor }]}>
                    {CATEGORY_LABELS[item.category] ?? item.category}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.secondary }]}
                    onPress={() =>
                      router.push({ pathname: "/admin/site-form", params: { id: item.id } })
                    }
                  >
                    <Feather name="edit-2" size={15} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: "#FFF0F0" }]}
                    onPress={() => handleDelete(item)}
                    disabled={isBeingDeleted}
                  >
                    <Feather name="trash-2" size={15} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.siteName, { color: colors.foreground }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.siteLocal, { color: colors.mutedForeground }]} numberOfLines={1}>
                {item.nameLocal}
              </Text>

              <View style={styles.cardMeta}>
                <View style={styles.metaItem}>
                  <Feather name="map-pin" size={12} color={colors.terracotta} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                    {" "}{item.location.city}, {item.location.province}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="star" size={12} color={colors.gold} />
                  <Text style={[styles.metaText, { color: colors.foreground }]}>
                    {" "}{item.rating.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Feather name="tag" size={12} color={colors.mutedForeground} />
                  <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                    {" "}{item.ticketPrice}
                  </Text>
                </View>
              </View>

              <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
                {item.shortDesc}
              </Text>
            </View>
          );
        }}
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/admin/site-form")}
        activeOpacity={0.85}
      >
        <Feather name="plus" size={22} color="#fff" />
        <Text style={styles.fabText}>Tambah Destinasi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: { padding: 9, borderRadius: 10 },
  headerTitles: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 12, marginTop: 1, color: "rgba(255,255,255,0.75)" },
  resetBtn: {
    borderRadius: 10,
    padding: 9,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 12,
    gap: 6,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  catBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    padding: 8,
    borderRadius: 10,
  },
  siteName: { fontSize: 16, fontWeight: "700" },
  siteLocal: { fontSize: 12, fontStyle: "italic" },
  cardMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 12 },
  desc: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  empty: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyText: { fontSize: 16, fontWeight: "600" },
  fab: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
