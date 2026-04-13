import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface MapMarkerProps {
  selected?: boolean;
  onPress?: () => void;
  label?: string;
}

export function MapMarker({ selected, onPress, label }: MapMarkerProps) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.outer, selected && { transform: [{ scale: 1.3 }] }]}>
        <View
          style={[
            styles.marker,
            {
              backgroundColor: selected ? colors.primary : colors.terracotta,
            },
          ]}
        >
          <Feather name="map-pin" size={14} color="#fff" />
        </View>
        <View
          style={[
            styles.tail,
            {
              borderTopColor: selected ? colors.primary : colors.terracotta,
            },
          ]}
        />
      </View>
      {selected && label && (
        <View style={[styles.label, { backgroundColor: colors.primary }]}>
          <Text style={styles.labelText} numberOfLines={1}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    maxWidth: 120,
  },
  labelText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
