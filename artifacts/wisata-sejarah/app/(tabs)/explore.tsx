import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SiteCard } from "@/components/SiteCard";

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { filteredSites, searchQuery, setSearchQuery } = useApp();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredSites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: bottomPadding + 16,
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={
          <View>
            <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
              <Text style={[styles.title, { color: colors.foreground }]}>Jelajahi</Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Temukan destinasi bersejarah Indonesia
              </Text>
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>
            <CategoryFilter />
            <View style={styles.resultHeader}>
              <Text style={[styles.resultText, { color: colors.foreground }]}>
                {filteredSites.length} destinasi ditemukan
              </Text>
            </View>
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
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Tidak Ada Hasil
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Coba kata kunci yang berbeda
            </Text>
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
    paddingHorizontal: 0,
    marginBottom: 8,
    gap: 6,
  },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { fontSize: 14, marginBottom: 4 },
  resultHeader: {
    paddingVertical: 8,
  },
  resultText: { fontSize: 13, fontWeight: "600" },
  empty: { alignItems: "center", paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "700" },
  emptyText: { fontSize: 14 },
});
