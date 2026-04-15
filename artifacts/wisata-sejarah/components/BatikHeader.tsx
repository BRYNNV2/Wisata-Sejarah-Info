import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";

/* ─────────────────────────────────────────────
   Kawung circle — 4 ellipse arcs via border
───────────────────────────────────────────── */
function KawungDot({ x, y }: { x: number; y: number }) {
  const s = 16;
  return (
    <>
      {/* top petal */}
      <View
        style={{
          position: "absolute",
          left: x - s * 0.38,
          top: y - s,
          width: s * 0.76,
          height: s,
          borderRadius: s * 0.38,
          borderWidth: 0.8,
          borderColor: "rgba(255,255,255,0.17)",
        }}
      />
      {/* bottom petal */}
      <View
        style={{
          position: "absolute",
          left: x - s * 0.38,
          top: y,
          width: s * 0.76,
          height: s,
          borderRadius: s * 0.38,
          borderWidth: 0.8,
          borderColor: "rgba(255,255,255,0.17)",
        }}
      />
      {/* left petal */}
      <View
        style={{
          position: "absolute",
          left: x - s,
          top: y - s * 0.38,
          width: s,
          height: s * 0.76,
          borderRadius: s * 0.38,
          borderWidth: 0.8,
          borderColor: "rgba(255,255,255,0.17)",
        }}
      />
      {/* right petal */}
      <View
        style={{
          position: "absolute",
          left: x,
          top: y - s * 0.38,
          width: s,
          height: s * 0.76,
          borderRadius: s * 0.38,
          borderWidth: 0.8,
          borderColor: "rgba(255,255,255,0.17)",
        }}
      />
      {/* centre jewel */}
      <View
        style={{
          position: "absolute",
          left: x - 2,
          top: y - 2,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: "rgba(255,220,110,0.4)",
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   Truntum square diamond
───────────────────────────────────────────── */
function TruntumDiamond({ x, y, s = 6 }: { x: number; y: number; s?: number }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x - s,
        top: y - s,
        width: s * 2,
        height: s * 2,
        transform: [{ rotate: "45deg" }],
        borderWidth: 0.7,
        borderColor: "rgba(255,220,100,0.22)",
        backgroundColor: "rgba(255,220,100,0.06)",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Diagonal parang stroke — thin rotated rect
───────────────────────────────────────────── */
function ParangLine({ x, y }: { x: number; y: number }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 30,
        height: 1,
        backgroundColor: "rgba(255,255,255,0.10)",
        transform: [{ rotate: "-30deg" }],
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Batik decorative pattern canvas
───────────────────────────────────────────── */
function BatikPattern() {
  const cols = 12;
  const rows = 9;
  const gapX = 38;
  const gapY = 38;

  const kawung: [number, number][] = [];
  const diamonds: [number, number][] = [];
  const parangs: [number, number][] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * gapX;
      const y = r * gapY;
      kawung.push([x, y]);
      // offset diamonds at cell centres
      diamonds.push([x + gapX * 0.5, y + gapY * 0.5]);
      // parang on even rows
      if (r % 2 === 0) parangs.push([x + 5, y + 14]);
    }
  }

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Decorative top border line (gold) */}
      <View style={{ position: "absolute", top: 5, left: 0, right: 0, height: 1, backgroundColor: "rgba(255,220,100,0.30)" }} />
      <View style={{ position: "absolute", top: 8, left: 0, right: 0, height: 0.5, backgroundColor: "rgba(255,255,255,0.12)" }} />

      {/* Kawung motif grid */}
      {kawung.map(([x, y], i) => (
        <KawungDot key={`k${i}`} x={x} y={y} />
      ))}

      {/* Truntum diamonds at offsets */}
      {diamonds.map(([x, y], i) => (
        <TruntumDiamond key={`d${i}`} x={x} y={y} />
      ))}

      {/* Parang diagonal lines */}
      {parangs.map(([x, y], i) => (
        <ParangLine key={`p${i}`} x={x} y={y} />
      ))}

      {/* Decorative bottom border line */}
      <View style={{ position: "absolute", bottom: 6, left: 0, right: 0, height: 1, backgroundColor: "rgba(255,220,100,0.25)" }} />
    </View>
  );
}

/* ─────────────────────────────────────────────
   Public BatikHeader component
───────────────────────────────────────────── */
interface BatikHeaderProps {
  children: React.ReactNode;
  gradientColors?: [string, string, ...string[]];
  style?: ViewStyle | ViewStyle[];
}

export function BatikHeader({ children, gradientColors, style }: BatikHeaderProps) {
  const theme = useColors();
  const gradient: [string, string, ...string[]] = gradientColors ?? [
    "#5E2108",
    theme.primary,
    "#9A5520",
  ];

  return (
    <View style={[styles.wrapper, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <BatikPattern />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
  },
});
