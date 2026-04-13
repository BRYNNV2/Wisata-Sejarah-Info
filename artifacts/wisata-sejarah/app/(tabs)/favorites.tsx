import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { SiteCard } from "@/components/SiteCard";
import { HISTORICAL_SITES } from "@/constants/sites";

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favorites } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const favSites = HISTORICAL_SITES.filter((s) => favorites.includes(s.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favSites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: bottomPadding + 16,
        }}
        ListHeaderComponent={
          <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
            <Text style={[styles.title, { color: colors.foreground }]}>Favorit</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {favSites.length} destinasi tersimpan
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SiteCard
            site={item}
            onPress={() => router.push({ pathname: "/site/[id]", params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="heart" size={36} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Belum Ada Favorit
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Ketuk ikon hati pada kartu destinasi untuk menambahkan ke favorit
            </Text>
            <TouchableOpacity
              style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/explore")}
            >
              <Text style={styles.exploreBtnText}>Jelajahi Destinasi</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    marginBottom: 16,
    gap: 4,
  },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14 },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12, paddingHorizontal: 24 },
  emptyIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "700" },
  emptyText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  exploreBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
