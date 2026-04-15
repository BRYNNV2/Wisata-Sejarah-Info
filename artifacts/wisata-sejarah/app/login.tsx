import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { BatikHeader } from "@/components/BatikHeader";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Masukkan username dan password");
      return;
    }
    setError("");
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error ?? "Login gagal");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomPadding + 20 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero */}
      <BatikHeader style={{ paddingTop: topPadding + 16, paddingBottom: 32 }}>
        <View style={styles.heroInner}>
          <View style={styles.logoBox}>
            <Feather name="map-pin" size={32} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Wisata Sejarah</Text>
          <Text style={styles.heroSubtitle}>Jelajahi warisan budaya Indonesia</Text>
          {/* Ornament row */}
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Feather name="compass" size={14} color="rgba(255,220,100,0.7)" />
            <View style={styles.ornamentLine} />
          </View>
        </View>
      </BatikHeader>

      {/* Form */}
      <View style={styles.formWrap}>
        <Text style={[styles.formTitle, { color: colors.foreground }]}>Masuk ke Akun</Text>
        <Text style={[styles.formSub, { color: colors.mutedForeground }]}>
          Gunakan akun admin atau pengunjung untuk masuk
        </Text>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: "#FFF0F0", borderColor: "#E53E3E" }]}>
            <Feather name="alert-circle" size={15} color="#E53E3E" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Username</Text>
          <View
            style={[
              styles.inputWrap,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <Feather name="user" size={18} color={colors.mutedForeground} />
            <TextInput
              value={username}
              onChangeText={(t) => { setUsername(t); setError(""); }}
              placeholder="Masukkan username"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground }]}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
          <View
            style={[
              styles.inputWrap,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}
          >
            <Feather name="lock" size={18} color={colors.mutedForeground} />
            <TextInput
              value={password}
              onChangeText={(t) => { setPassword(t); setError(""); }}
              placeholder="Masukkan password"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showPassword}
              style={[styles.input, { color: colors.foreground }]}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.loginBtn,
            { backgroundColor: loading ? colors.mutedForeground : colors.primary },
          ]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.loginBtnText}>Masuk</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        {/* Demo accounts */}
        <View style={[styles.demoBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={styles.demoHeader}>
            <Feather name="info" size={14} color={colors.primary} />
            <Text style={[styles.demoTitle, { color: colors.primary }]}>Akun Demo</Text>
          </View>
          <View style={styles.demoRow}>
            <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.roleBadgeText}>ADMIN</Text>
            </View>
            <Text style={[styles.demoText, { color: colors.foreground }]}>
              admin / admin123
            </Text>
          </View>
          <View style={styles.demoRow}>
            <View style={[styles.roleBadge, { backgroundColor: colors.gold }]}>
              <Text style={styles.roleBadgeText}>USER</Text>
            </View>
            <Text style={[styles.demoText, { color: colors.foreground }]}>
              pengunjung / kunjungi
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    alignItems: "center",
    gap: 8,
  },
  heroInner: {
    alignItems: "center",
    gap: 8,
  },
  ornamentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,220,100,0.35)",
    maxWidth: 60,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  formWrap: {
    padding: 24,
    gap: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "800",
  },
  formSub: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: -8,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  fieldGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  demoBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginTop: 8,
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  demoText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
