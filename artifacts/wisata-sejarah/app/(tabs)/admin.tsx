import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { HISTORICAL_SITES } from "@/constants/sites";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colors = useColors();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card }]}>
      <View style={[styles.statIcon, { backgroundColor: color + "22" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const MENU_ITEMS = [
  { id: "sites", icon: "map-pin", label: "Kelola Destinasi", desc: "Tambah, edit, hapus data destinasi", color: "#8B4513" },
  { id: "users", icon: "users", label: "Manajemen User", desc: "Lihat dan kelola akun pengunjung", color: "#C4860A" },
  { id: "reports", icon: "bar-chart-2", label: "Laporan Kunjungan", desc: "Statistik dan data kunjungan", color: "#2D8A6E" },
  { id: "media", icon: "image", label: "Media & Galeri", desc: "Kelola foto dan dokumentasi", color: "#7B5EA7" },
  { id: "content", icon: "file-text", label: "Konten & Informasi", desc: "Edit deskripsi dan informasi situs", color: "#C1440E" },
  { id: "settings", icon: "settings", label: "Pengaturan Sistem", desc: "Konfigurasi aplikasi", color: "#4A6FA5" },
];

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const [expandedSites, setExpandedSites] = useState(false);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogout = () => {
    if (Platform.OS === "web") {
      logout().then(() => router.replace("/login"));
      return;
    }
    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleMenuItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (id === "sites") setExpandedSites((v) => !v);
  };

  const totalReviews = HISTORICAL_SITES.reduce((sum, s) => sum + s.reviewCount, 0);
  const avgRating = (HISTORICAL_SITES.reduce((sum, s) => sum + s.rating, 0) / HISTORICAL_SITES.length).toFixed(1);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 20 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPadding + 12 }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerGreet}>Panel Admin</Text>
              <Text style={styles.headerName}>{user?.name}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Feather name="log-out" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="shield" size={12} color="#fff" />
            <Text style={styles.roleBadgeText}>Administrator</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Destinasi" value={HISTORICAL_SITES.length} icon="map-pin" color={colors.primary} />
          <StatCard label="Total Ulasan" value={totalReviews.toLocaleString()} icon="message-square" color={colors.gold} />
          <StatCard label="Rata-rata Rating" value={avgRating} icon="star" color="#2D8A6E" />
          <StatCard label="Provinsi" value={5} icon="globe" color={colors.terracotta} />
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Menu Admin</Text>
          <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {MENU_ITEMS.map((item, idx) => (
              <View key={item.id}>
                {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuItem(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                    <Text style={[styles.menuDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
                  </View>
                  <Feather
                    name={item.id === "sites" && expandedSites ? "chevron-up" : "chevron-right"}
                    size={16}
                    color={colors.mutedForeground}
                  />
                </TouchableOpacity>
                {item.id === "sites" && expandedSites && (
                  <View style={[styles.expanded, { borderTopColor: colors.border }]}>
                    {HISTORICAL_SITES.map((site) => (
                      <TouchableOpacity
                        key={site.id}
                        style={styles.siteRow}
                        onPress={() => router.push({ pathname: "/site/[id]", params: { id: site.id } })}
                        activeOpacity={0.7}
                      >
                        <Feather name="map-pin" size={13} color={colors.terracotta} />
                        <View style={styles.siteInfo}>
                          <Text style={[styles.siteName, { color: colors.foreground }]}>{site.name}</Text>
                          <Text style={[styles.siteCity, { color: colors.mutedForeground }]}>{site.location.city}</Text>
                        </View>
                        <View style={styles.siteActions}>
                          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]}>
                            <Feather name="edit-2" size={13} color={colors.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFF0F0" }]}>
                            <Feather name="trash-2" size={13} color={colors.destructive} />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={[styles.addBtn, { backgroundColor: colors.primary }]}
                      onPress={() => {}}
                    >
                      <Feather name="plus" size={16} color="#fff" />
                      <Text style={styles.addBtnText}>Tambah Destinasi Baru</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Recent activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Aktivitas Terkini</Text>
          {[
            { action: "Destinasi baru ditambahkan", site: "Candi Mendut", time: "2 jam lalu", icon: "plus-circle" },
            { action: "Ulasan dihapus (spam)", site: "Borobudur Temple", time: "5 jam lalu", icon: "trash-2" },
            { action: "Info diperbarui", site: "Keraton Yogyakarta", time: "1 hari lalu", icon: "edit-2" },
          ].map((act, i) => (
            <View
              key={i}
              style={[styles.activityRow, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.actIcon, { backgroundColor: colors.secondary }]}>
                <Feather name={act.icon as any} size={14} color={colors.primary} />
              </View>
              <View style={styles.actText}>
                <Text style={[styles.actAction, { color: colors.foreground }]}>{act.action}</Text>
                <Text style={[styles.actSite, { color: colors.mutedForeground }]}>{act.site}</Text>
              </View>
              <Text style={[styles.actTime, { color: colors.mutedForeground }]}>{act.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerGreet: { color: "rgba(255,255,255,0.7)", fontSize: 13 },
  headerName: { color: "#fff", fontSize: 22, fontWeight: "800" },
  logoutBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 20,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 14,
    padding: 14,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 22, fontWeight: "800" },
  statLabel: { fontSize: 12 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  menuCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: "600" },
  menuDesc: { fontSize: 11, marginTop: 1 },
  divider: { height: 1, marginLeft: 64 },
  expanded: {
    borderTopWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  siteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  siteInfo: { flex: 1 },
  siteName: { fontSize: 13, fontWeight: "600" },
  siteCity: { fontSize: 11 },
  siteActions: { flexDirection: "row", gap: 6 },
  actionBtn: { padding: 7, borderRadius: 8 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  actIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  actText: { flex: 1 },
  actAction: { fontSize: 13, fontWeight: "600" },
  actSite: { fontSize: 11, marginTop: 1 },
  actTime: { fontSize: 11 },
});
