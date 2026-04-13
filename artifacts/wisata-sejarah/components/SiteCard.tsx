import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { HistoricalSite } from "@/constants/sites";
import { useApp } from "@/context/AppContext";

interface SiteCardProps {
  site: HistoricalSite;
  onPress: () => void;
  variant?: "large" | "compact";
}

const CATEGORY_ICONS: Record<string, string> = {
  temple: "home",
  palace: "star",
  fort: "shield",
  museum: "book",
  site: "map-pin",
};

export function SiteCard({ site, onPress, variant = "large" }: SiteCardProps) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(site.id);

  if (variant === "compact") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.compactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        activeOpacity={0.8}
      >
        <Image source={site.heroImage} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.foreground }]} numberOfLines={1}>
            {site.name}
          </Text>
          <View style={styles.compactRow}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[styles.compactCity, { color: colors.mutedForeground }]} numberOfLines={1}>
              {" "}{site.location.city}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <Feather name="star" size={11} color={colors.gold} />
            <Text style={[styles.ratingText, { color: colors.foreground }]}>
              {" "}{site.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.card }]}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image source={site.heroImage} style={styles.heroImage} />
        <View style={styles.imageOverlay} />
        <View style={styles.categoryBadge}>
          <Feather
            name={CATEGORY_ICONS[site.category] as any}
            size={11}
            color="#fff"
          />
          <Text style={styles.categoryText}>{site.category.toUpperCase()}</Text>
        </View>
        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavorite(site.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name={fav ? "heart" : "heart"} size={18} color={fav ? "#E53E3E" : "#fff"} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.siteName, { color: colors.foreground }]} numberOfLines={1}>
          {site.name}
        </Text>
        <Text style={[styles.siteLocal, { color: colors.mutedForeground }]} numberOfLines={1}>
          {site.nameLocal}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color={colors.terracotta} />
            <Text style={[styles.locationText, { color: colors.mutedForeground }]} numberOfLines={1}>
              {" "}{site.location.city}, {site.location.province}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color={colors.gold} />
            <Text style={[styles.ratingValue, { color: colors.foreground }]}>
              {" "}{site.rating.toFixed(1)}
            </Text>
            <Text style={[styles.reviewCount, { color: colors.mutedForeground }]}>
              {" "}({site.reviewCount.toLocaleString()})
            </Text>
          </View>
        </View>
        <View style={styles.tagsRow}>
          {site.tags.slice(0, 2).map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: colors.secondary }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#8B4513",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    height: 180,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    background: "transparent",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(139,69,19,0.85)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  favButton: {
    position: "absolute",
    top: 10,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
    padding: 6,
  },
  cardContent: {
    padding: 14,
  },
  siteName: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  siteLocal: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 11,
  },
  tagsRow: {
    flexDirection: "row",
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
  },
  compactCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 10,
  },
  compactImage: {
    width: 70,
    height: 70,
    resizeMode: "cover",
  },
  compactInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    gap: 3,
  },
  compactName: {
    fontSize: 14,
    fontWeight: "600",
  },
  compactCity: {
    fontSize: 12,
  },
  compactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
