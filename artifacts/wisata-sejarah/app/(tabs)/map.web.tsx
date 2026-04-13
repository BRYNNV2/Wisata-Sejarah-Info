import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { HISTORICAL_SITES } from "@/constants/sites";
import { SiteCard } from "@/components/SiteCard";

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const topPadding = 67;
  const bottomPadding = 34;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          { paddingTop: topPadding + 8, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.mapTitle, { color: colors.foreground }]}>
          Peta Wisata Sejarah
        </Text>
        <Text style={[styles.mapSubtitle, { color: colors.mutedForeground }]}>
          {HISTORICAL_SITES.length} destinasi tersedia
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: topPadding + 64,
          paddingBottom: bottomPadding + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.webMapPlaceholder,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          <View style={[styles.mapIconBg, { backgroundColor: colors.muted }]}>
            <Feather name="map" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.webMapText, { color: colors.foreground }]}>
            Peta Interaktif GIS
          </Text>
          <Text style={[styles.webMapSub, { color: colors.mutedForeground }]}>
            Peta interaktif tersedia di aplikasi mobile iOS/Android.{"\n"}
            Scan QR code dari Expo Go untuk pengalaman lengkap.
          </Text>
        </View>

        <Text style={[styles.listTitle, { color: colors.foreground }]}>
          Semua Lokasi Destinasi
        </Text>

        {HISTORICAL_SITES.map((site) => (
          <View key={site.id}>
            <SiteCard
              site={site}
              onPress={() =>
                router.push({ pathname: "/site/[id]", params: { id: site.id } })
              }
            />
            <View
              style={[
                styles.coordRow,
                {
                  backgroundColor: colors.muted,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="navigation" size={12} color={colors.mutedForeground} />
              <Text style={[styles.coordText, { color: colors.mutedForeground }]}>
                {site.location.latitude.toFixed(4)}°,{" "}
                {site.location.longitude.toFixed(4)}°
              </Text>
              <Text
                style={[styles.addressText, { color: colors.mutedForeground }]}
                numberOfLines={1}
              >
                · {site.location.address}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  mapTitle: { fontSize: 20, fontWeight: "800" },
  mapSubtitle: { fontSize: 12, marginTop: 2 },
  webMapPlaceholder: {
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  mapIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  webMapText: { fontSize: 18, fontWeight: "700" },
  webMapSub: { fontSize: 13, textAlign: "center", lineHeight: 20 },
  listTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  coordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: -10,
    marginBottom: 12,
  },
  coordText: { fontSize: 11, fontWeight: "500" },
  addressText: { fontSize: 11, flex: 1 },
});
