import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { HISTORICAL_SITES, HistoricalSite } from "@/constants/sites";
import { SiteCard } from "@/components/SiteCard";

const MapViewLib = require("react-native-maps");
const MapView = MapViewLib.default;
const { Marker, PROVIDER_DEFAULT } = MapViewLib;

const INITIAL_REGION = {
  latitude: -5.5,
  longitude: 110.0,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedSite, setSelectedSite] = useState<HistoricalSite | null>(null);
  const mapRef = useRef<any>(null);

  const topPadding = insets.top;
  const bottomPadding = insets.bottom;

  const focusSite = (site: HistoricalSite) => {
    setSelectedSite(site);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: site.location.latitude,
          longitude: site.location.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        },
        500
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsCompass
      >
        {HISTORICAL_SITES.map((site) => (
          <Marker
            key={site.id}
            coordinate={{
              latitude: site.location.latitude,
              longitude: site.location.longitude,
            }}
            onPress={() => focusSite(site)}
          >
            <View style={styles.markerOuter}>
              <View
                style={[
                  styles.markerDot,
                  {
                    backgroundColor:
                      selectedSite?.id === site.id ? colors.primary : colors.terracotta,
                    transform: [{ scale: selectedSite?.id === site.id ? 1.3 : 1 }],
                  },
                ]}
              >
                <Feather name="map-pin" size={12} color="#fff" />
              </View>
              <View
                style={[
                  styles.markerTail,
                  {
                    borderTopColor:
                      selectedSite?.id === site.id ? colors.primary : colors.terracotta,
                  },
                ]}
              />
            </View>
          </Marker>
        ))}
      </MapView>

      <View
        style={[
          styles.topBar,
          { paddingTop: topPadding + 8, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.mapTitle, { color: colors.foreground }]}>Peta Wisata Sejarah</Text>
        <Text style={[styles.mapSubtitle, { color: colors.mutedForeground }]}>
          {HISTORICAL_SITES.length} destinasi tersedia
        </Text>
      </View>

      <View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: colors.background,
            paddingBottom: bottomPadding + 10,
          },
        ]}
      >
        {selectedSite ? (
          <View>
            <View style={styles.sheetHandle}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
            </View>
            <SiteCard
              site={selectedSite}
              onPress={() =>
                router.push({ pathname: "/site/[id]", params: { id: selectedSite.id } })
              }
            />
            <TouchableOpacity onPress={() => setSelectedSite(null)} style={styles.closeBtn}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.sheetHandle}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
            </View>
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Semua Lokasi</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.siteList}
            >
              {HISTORICAL_SITES.map((site) => (
                <TouchableOpacity
                  key={site.id}
                  style={[
                    styles.miniChip,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                  onPress={() => focusSite(site)}
                  activeOpacity={0.8}
                >
                  <Feather name="map-pin" size={13} color={colors.terracotta} />
                  <Text
                    style={[styles.miniChipText, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {site.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
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
  },
  mapTitle: { fontSize: 20, fontWeight: "800" },
  mapSubtitle: { fontSize: 12, marginTop: 2 },
  markerOuter: { alignItems: "center" },
  markerDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    paddingHorizontal: 16,
  },
  sheetHandle: { alignItems: "center", paddingVertical: 10 },
  handle: { width: 40, height: 4, borderRadius: 2 },
  sheetTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  siteList: { gap: 10, paddingBottom: 4 },
  miniChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    maxWidth: 160,
  },
  miniChipText: { fontSize: 13, fontWeight: "600" },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 0,
    padding: 8,
  },
});
