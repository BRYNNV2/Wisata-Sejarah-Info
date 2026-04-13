import React from "react";
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
import { useApp } from "@/context/AppContext";

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
  {
    id: "sites",
    icon: "map-pin",
    label: "Kelola Destinasi",
    desc: "Tambah, edit, hapus data destinasi wisata",
    color: "#8B4513",
    badge: "CRUD",
    route: "/admin/sites",
  },
  {
    id: "users",
    icon: "users",
    label: "Manajemen User",
    desc: "Lihat dan kelola akun pengunjung",
    color: "#C4860A",
    badge: null,
    route: null,
  },
  {
    id: "reports",
    icon: "bar-chart-2",
    label: "Laporan Kunjungan",
    desc: "Statistik dan data kunjungan",
    color: "#2D8A6E",
    badge: null,
    route: null,
  },
  {
    id: "media",
    icon: "image",
    label: "Media & Galeri",
    desc: "Kelola foto dan dokumentasi situs",
    color: "#7B5EA7",
    badge: null,
    route: null,
  },
  {
    id: "content",
    icon: "file-text",
    label: "Konten & Informasi",
    desc: "Edit deskripsi dan informasi umum",
    color: "#C1440E",
    badge: null,
    route: null,
  },
  {
    id: "settings",
    icon: "settings",
    label: "Pengaturan Sistem",
    desc: "Konfigurasi dan preferensi aplikasi",
    color: "#4A6FA5",
    badge: null,
    route: null,
  },
];

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { sites } = useApp();

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

  const handleMenu = (item: (typeof MENU_ITEMS)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const totalReviews = sites.reduce((sum, s) => sum + s.reviewCount, 0);
  const avgRating =
    sites.length > 0
      ? (sites.reduce((sum, s) => sum + s.rating, 0) / sites.length).toFixed(1)
      : "—";
  const provinces = new Set(sites.map((s) => s.location.province)).size;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 20 }}
      >
        {/* Header */}
        <View
          style={[styles.header, { backgroundColor: colors.primary, paddingTop: topPadding + 12 }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerGreet}>Panel Administrator</Text>
              <Text style={styles.headerName}>{user?.name}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Feather name="log-out" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="shield" size={12} color="#fff" />
            <Text style={styles.roleBadgeText}>Administrator · Akses Penuh</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Destinasi"
            value={sites.length}
            icon="map-pin"
            color={colors.primary}
          />
          <StatCard
            label="Total Ulasan"
            value={totalReviews.toLocaleString()}
            icon="message-square"
            color={colors.gold}
          />
          <StatCard
            label="Rata-rata Rating"
            value={avgRating}
            icon="star"
            color="#2D8A6E"
          />
          <StatCard
            label="Provinsi"
            value={provinces}
            icon="globe"
            color={colors.terracotta}
          />
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Aksi Cepat</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/admin/site-form")}
              activeOpacity={0.85}
            >
              <Feather name="plus-circle" size={18} color="#fff" />
              <Text style={styles.quickBtnText}>Tambah Destinasi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: colors.secondary, borderWidth: 1, borderColor: colors.border }]}
              onPress={() => router.push("/admin/sites")}
              activeOpacity={0.85}
            >
              <Feather name="list" size={18} color={colors.primary} />
              <Text style={[styles.quickBtnText, { color: colors.primary }]}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Menu Admin</Text>
          <View
            style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            {MENU_ITEMS.map((item, idx) => (
              <View key={item.id}>
                {idx > 0 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
                <TouchableOpacity
                  style={[styles.menuItem, !item.route && styles.menuItemDisabled]}
                  onPress={() => handleMenu(item)}
                  activeOpacity={item.route ? 0.7 : 1}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + "18" }]}>
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={styles.menuText}>
                    <View style={styles.menuLabelRow}>
                      <Text style={[styles.menuLabel, { color: colors.foreground }]}>
                        {item.label}
                      </Text>
                      {item.badge && (
                        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.menuDesc, { color: colors.mutedForeground }]}>
                      {item.desc}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={16}
                    color={item.route ? colors.mutedForeground : colors.border}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Recent sites */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Destinasi Terbaru
            </Text>
            <TouchableOpacity onPress={() => router.push("/admin/sites")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          {sites.slice(-3).reverse().map((site) => (
            <TouchableOpacity
              key={site.id}
              style={[styles.siteRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() =>
                router.push({ pathname: "/admin/site-form", params: { id: site.id } })
              }
              activeOpacity={0.8}
            >
              <View style={[styles.siteIconBox, { backgroundColor: colors.secondary }]}>
                <Feather name="map-pin" size={14} color={colors.primary} />
              </View>
              <View style={styles.siteInfo}>
                <Text style={[styles.siteName, { color: colors.foreground }]} numberOfLines={1}>
                  {site.name}
                </Text>
                <Text style={[styles.siteCity, { color: colors.mutedForeground }]}>
                  {site.location.city} · {site.category}
                </Text>
              </View>
              <View style={styles.siteRating}>
                <Feather name="star" size={12} color={colors.gold} />
                <Text style={[styles.siteRatingText, { color: colors.foreground }]}>
                  {" "}{site.rating.toFixed(1)}
                </Text>
              </View>
              <Feather name="edit-2" size={15} color={colors.mutedForeground} />
            </TouchableOpacity>
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
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, fontWeight: "600" },
  quickRow: { flexDirection: "row", gap: 10 },
  quickBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
  },
  quickBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  menuCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  menuItemDisabled: { opacity: 0.55 },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1 },
  menuLabelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 1 },
  menuLabel: { fontSize: 14, fontWeight: "600" },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  menuDesc: { fontSize: 11 },
  divider: { height: 1, marginLeft: 64 },
  siteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  siteIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  siteInfo: { flex: 1 },
  siteName: { fontSize: 13, fontWeight: "600" },
  siteCity: { fontSize: 11, marginTop: 1 },
  siteRating: { flexDirection: "row", alignItems: "center" },
  siteRatingText: { fontSize: 12, fontWeight: "600" },
});
