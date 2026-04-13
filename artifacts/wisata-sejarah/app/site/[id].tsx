import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Share,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { InfoRow } from "@/components/InfoRow";
import { RecommendationCard } from "@/components/RecommendationCard";

export default function SiteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getSiteById, isFavorite, toggleFavorite, addRecentlyViewed } = useApp();

  const site = getSiteById(id ?? "");

  React.useEffect(() => {
    if (id) addRecentlyViewed(id);
  }, [id]);

  if (!site) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>Destinasi tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 15 }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fav = isFavorite(site.id);
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(site.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Kunjungi ${site.name} (${site.nameLocal}) di ${site.location.city}, ${site.location.province}. ${site.shortDesc}`,
        title: site.name,
      });
    } catch {}
  };

  const handleDirections = () => {
    const url = `https://maps.google.com/?q=${site.location.latitude},${site.location.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 80 }}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image source={site.heroImage} style={styles.hero} />
          <View style={styles.heroOverlay} />

          {/* Back */}
          <TouchableOpacity
            style={[styles.backBtn, { top: (Platform.OS === "web" ? 67 : insets.top) + 8 }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Actions */}
          <View style={[styles.heroActions, { top: (Platform.OS === "web" ? 67 : insets.top) + 8 }]}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleFavorite}>
              <Feather name="heart" size={20} color={fav ? "#E53E3E" : "#fff"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
              <Feather name="share-2" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Hero info */}
          <View style={styles.heroInfo}>
            <View style={[styles.categoryBadge, { backgroundColor: "rgba(139,69,19,0.85)" }]}>
              <Text style={styles.categoryText}>{site.category.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroName}>{site.name}</Text>
            <Text style={styles.heroLocal}>{site.nameLocal}</Text>
            <View style={styles.heroMeta}>
              <Feather name="map-pin" size={13} color="rgba(255,255,255,0.8)" />
              <Text style={styles.heroLocation}> {site.location.city}, {site.location.province}</Text>
              <View style={styles.divider} />
              <Feather name="star" size={13} color="#FFD700" />
              <Text style={styles.heroRating}> {site.rating.toFixed(1)} ({site.reviewCount.toLocaleString()})</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tentang</Text>
            <Text style={[styles.description, { color: colors.foreground }]}>{site.description}</Text>
          </View>

          {/* Info */}
          <View style={[styles.section, styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Informasi</Text>
            <InfoRow icon="clock" label="Jam Operasional" value={site.openHours} />
            <InfoRow icon="tag" label="Tiket Masuk" value={site.ticketPrice} />
            <InfoRow icon="calendar" label="Dibangun" value={site.yearBuilt} />
            <InfoRow icon="archive" label="Periode" value={site.period} />
          </View>

          {/* Highlights */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Keistimewaan</Text>
            {site.highlights.map((h, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: colors.gold }]} />
                <Text style={[styles.bulletText, { color: colors.foreground }]}>{h}</Text>
              </View>
            ))}
          </View>

          {/* AI Recommendations */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tips & Rekomendasi</Text>
            <RecommendationCard site={site} />
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            {site.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View
        style={[
          styles.bottomCTA,
          {
            backgroundColor: colors.background,
            paddingBottom: bottomPadding + 12,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.directionsBtn, { borderColor: colors.border }]}
          onPress={handleDirections}
        >
          <Feather name="navigation" size={18} color={colors.primary} />
          <Text style={[styles.directionsBtnText, { color: colors.primary }]}>Peta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: colors.primary, flex: 1 }]}
          onPress={() => {}}
        >
          <Feather name="bookmark" size={18} color="#fff" />
          <Text style={styles.bookBtnText}>Rencanakan Kunjungan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 16 },
  heroContainer: { position: "relative", height: 320 },
  hero: { width: "100%", height: "100%", resizeMode: "cover" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  heroActions: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 8,
  },
  heroInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  categoryText: { color: "#fff", fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  heroName: { color: "#fff", fontSize: 24, fontWeight: "800", marginBottom: 2 },
  heroLocal: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontStyle: "italic", marginBottom: 8 },
  heroMeta: { flexDirection: "row", alignItems: "center" },
  heroLocation: { color: "rgba(255,255,255,0.85)", fontSize: 12 },
  divider: { width: 1, height: 12, backgroundColor: "rgba(255,255,255,0.4)", marginHorizontal: 8 },
  heroRating: { color: "#fff", fontSize: 12, fontWeight: "600" },
  content: { padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  description: { fontSize: 14, lineHeight: 22 },
  infoCard: { borderRadius: 16, padding: 16 },
  bulletRow: { flexDirection: "row", gap: 10, marginBottom: 10, alignItems: "flex-start" },
  bullet: { width: 7, height: 7, borderRadius: 4, marginTop: 6 },
  bulletText: { fontSize: 14, lineHeight: 20, flex: 1 },
  tagsSection: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: "600" },
  bottomCTA: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  directionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  directionsBtnText: { fontWeight: "700", fontSize: 14 },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
