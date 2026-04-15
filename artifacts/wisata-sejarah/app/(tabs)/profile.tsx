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
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { HISTORICAL_SITES } from "@/constants/sites";
import { BatikHeader } from "@/components/BatikHeader";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout, isAdmin } = useAuth();
  const { favorites, recentlyViewed } = useApp();

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

  const recentSites = recentlyViewed
    .slice(0, 3)
    .map((id) => HISTORICAL_SITES.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 20 }}
      >
        {/* Header */}
        <BatikHeader style={{ alignItems: "center", paddingTop: topPadding + 16, paddingHorizontal: 24, paddingBottom: 28, gap: 6 }}>
          <View style={styles.avatarWrap}>
            <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </Text>
            </View>
            <View style={[styles.onlineDot, { backgroundColor: "#48BB78" }]} />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userHandle}>@{user?.username}</Text>
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: isAdmin ? "rgba(255,255,255,0.22)" : "rgba(196,134,10,0.3)" },
            ]}
          >
            <Feather name={isAdmin ? "shield" : "user"} size={11} color="#fff" />
            <Text style={styles.roleText}>{isAdmin ? "Administrator" : "Pengunjung"}</Text>
          </View>
        </BatikHeader>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statVal, { color: colors.primary }]}>{favorites.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Favorit</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statVal, { color: colors.primary }]}>{recentlyViewed.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Dikunjungi</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statVal, { color: colors.primary }]}>{HISTORICAL_SITES.length}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Destinasi</Text>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Informasi Akun</Text>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              { icon: "user", label: "Nama Lengkap", value: user?.name ?? "" },
              { icon: "at-sign", label: "Username", value: user?.username ?? "" },
              { icon: "mail", label: "Email", value: user?.email ?? "" },
              { icon: "shield", label: "Role", value: isAdmin ? "Administrator" : "Pengunjung" },
            ].map((item, i, arr) => (
              <View key={item.label}>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIcon, { backgroundColor: colors.secondary }]}>
                    <Feather name={item.icon as any} size={15} color={colors.primary} />
                  </View>
                  <View style={styles.infoText}>
                    <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>{item.value}</Text>
                  </View>
                </View>
                {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              </View>
            ))}
          </View>
        </View>

        {/* Riwayat */}
        {recentSites.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Riwayat Kunjungan</Text>
            <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {recentSites.map((site, i) => (
                <View key={site!.id}>
                  <TouchableOpacity
                    style={styles.recentRow}
                    onPress={() => router.push({ pathname: "/site/[id]", params: { id: site!.id } })}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.infoIcon, { backgroundColor: colors.secondary }]}>
                      <Feather name="map-pin" size={15} color={colors.terracotta} />
                    </View>
                    <View style={styles.infoText}>
                      <Text style={[styles.infoValue, { color: colors.foreground }]}>{site!.name}</Text>
                      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{site!.location.city}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  </TouchableOpacity>
                  {i < recentSites.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Logout */}
        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: colors.destructive }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={18} color={colors.destructive} />
            <Text style={[styles.logoutText, { color: colors.destructive }]}>Keluar dari Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 6,
  },
  avatarWrap: { position: "relative", marginBottom: 4 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "800" },
  onlineDot: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: { color: "#fff", fontSize: 22, fontWeight: "800" },
  userHandle: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 2,
  },
  roleText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statVal: { fontSize: 24, fontWeight: "800" },
  statLbl: { fontSize: 12 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  infoCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  recentRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: "500", marginBottom: 1 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginLeft: 62 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  logoutText: { fontSize: 15, fontWeight: "700" },
});
