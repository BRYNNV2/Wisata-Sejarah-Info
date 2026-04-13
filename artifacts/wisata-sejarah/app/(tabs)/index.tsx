import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SiteCard } from "@/components/SiteCard";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { searchQuery, setSearchQuery, filteredSites, featuredSites } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 20 }}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Header */}
        <View style={[styles.header, { backgroundColor: colors.background, paddingTop: topPadding + 8 }]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Selamat datang di</Text>
              <Text style={[styles.title, { color: colors.foreground }]}>Wisata Sejarah</Text>
            </View>
            <TouchableOpacity
              style={[styles.notifBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            >
              <Feather name="bell" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.searchWrap}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
          <CategoryFilter />
        </View>

        {/* Featured Section */}
        {!searchQuery && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Destinasi Unggulan</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredSites}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.featuredCard, { width: 220 }]}
                  activeOpacity={0.9}
                  onPress={() => router.push({ pathname: "/site/[id]", params: { id: item.id } })}
                >
                  <Image source={item.heroImage} style={styles.featuredImage} />
                  <View style={styles.featuredOverlay}>
                    <View style={[styles.ratingBadge, { backgroundColor: "rgba(0,0,0,0.5)" }]}>
                      <Feather name="star" size={11} color="#FFD700" />
                      <Text style={styles.ratingBadgeText}> {item.rating.toFixed(1)}</Text>
                    </View>
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.featuredLoc}>
                        <Feather name="map-pin" size={11} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.featuredCity}> {item.location.city}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Filtered results */}
        <View style={[styles.section, { marginTop: 8 }]}>
          {searchQuery ? (
            <Text style={[styles.sectionTitle, { color: colors.foreground, paddingHorizontal: 16, marginBottom: 12 }]}>
              Hasil pencarian: "{searchQuery}" ({filteredSites.length} ditemukan)
            </Text>
          ) : (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Semua Destinasi</Text>
              <Text style={[styles.countText, { color: colors.mutedForeground }]}>{filteredSites.length} lokasi</Text>
            </View>
          )}

          {filteredSites.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="search" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Tidak Ditemukan</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Coba kata kunci lain atau ubah filter kategori
              </Text>
            </View>
          ) : (
            <View style={{ paddingHorizontal: 16 }}>
              {filteredSites.map((site) => (
                <SiteCard
                  key={site.id}
                  site={site}
                  onPress={() => router.push({ pathname: "/site/[id]", params: { id: site.id } })}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  greeting: { fontSize: 13, marginBottom: 2 },
  title: { fontSize: 24, fontWeight: "800" },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: { paddingHorizontal: 16, marginBottom: 4 },
  section: { marginTop: 16 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  seeAll: { fontSize: 13, fontWeight: "600" },
  countText: { fontSize: 13 },
  featuredCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 160,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  featuredInfo: {},
  featuredName: { color: "#fff", fontSize: 15, fontWeight: "700", marginBottom: 3 },
  featuredLoc: { flexDirection: "row", alignItems: "center" },
  featuredCity: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  empty: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTitle: { fontSize: 17, fontWeight: "700" },
  emptyText: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
});
