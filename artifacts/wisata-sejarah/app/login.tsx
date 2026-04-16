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
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  const topPadding = Platform.OS === "web" ? 60 : insets.top;
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
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace("/(tabs)");
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      setError(result.error ?? "Login gagal");
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      `Login dengan ${provider}`,
      "Fitur ini belum tersedia pada versi demo. Gunakan akun demo di bawah.",
      [{ text: "OK" }],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomPadding + 24 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Batik Hero Header ── */}
      <BatikHeader style={{ paddingTop: topPadding + 20, paddingBottom: 40, paddingHorizontal: 24 }}>
        <View style={styles.heroInner}>
          <View style={styles.logoBox}>
            <Feather name="map-pin" size={30} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Wisata Sejarah</Text>
          <Text style={styles.heroSubtitle}>Jelajahi warisan budaya Indonesia</Text>
          <View style={styles.ornamentRow}>
            <View style={styles.ornamentLine} />
            <Feather name="compass" size={13} color="rgba(255,220,100,0.75)" />
            <View style={styles.ornamentLine} />
          </View>
        </View>
      </BatikHeader>

      {/* ── Form Card ── */}
      <View style={styles.cardWrap}>
        <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.foreground }]}>

          {/* Title */}
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Masuk ke Akun</Text>
          <Text style={[styles.formSub, { color: colors.mutedForeground }]}>
            Pilih metode login yang Anda inginkan
          </Text>

          {/* ── Social Login Buttons ── */}
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => handleSocialLogin("Google")}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
              <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => handleSocialLogin("Facebook")}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons name="facebook" size={20} color="#1877F2" />
              <Text style={[styles.socialBtnText, { color: colors.foreground }]}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* ── Divider ── */}
          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>atau masuk dengan akun</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* ── Error ── */}
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: "#FFF0F0", borderColor: "#E53E3E" }]}>
              <Feather name="alert-circle" size={15} color="#E53E3E" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* ── Username ── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>Username</Text>
            <View style={[styles.inputWrap, { borderColor: error ? "#E53E3E" : colors.border, backgroundColor: colors.background }]}>
              <Feather name="user" size={17} color={colors.mutedForeground} />
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

          {/* ── Password ── */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
            <View style={[styles.inputWrap, { borderColor: error ? "#E53E3E" : colors.border, backgroundColor: colors.background }]}>
              <Feather name="lock" size={17} color={colors.mutedForeground} />
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
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={17} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Login Button ── */}
          <TouchableOpacity
            style={[styles.loginBtn, { backgroundColor: loading ? colors.mutedForeground : colors.primary }]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Masuk</Text>
                <Feather name="arrow-right" size={17} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ── Demo Accounts ── */}
        <View style={[styles.demoBox, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <View style={styles.demoHeader}>
            <Feather name="info" size={13} color={colors.primary} />
            <Text style={[styles.demoTitle, { color: colors.primary }]}>Akun Demo</Text>
          </View>
          <View style={styles.demoGrid}>
            <View style={styles.demoItem}>
              <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.roleBadgeText}>ADMIN</Text>
              </View>
              <Text style={[styles.demoText, { color: colors.foreground }]}>admin / admin123</Text>
            </View>
            <View style={styles.demoItem}>
              <View style={[styles.roleBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.roleBadgeText}>USER</Text>
              </View>
              <Text style={[styles.demoText, { color: colors.foreground }]}>pengunjung / kunjungi</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  heroInner: { alignItems: "center", gap: 6 },
  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#fff" },
  heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.82)" },
  ornamentRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  ornamentLine: { flex: 1, height: 1, backgroundColor: "rgba(255,220,100,0.35)", maxWidth: 56 },

  cardWrap: { padding: 16, gap: 14, marginTop: -20 },
  card: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  formTitle: { fontSize: 20, fontWeight: "800" },
  formSub: { fontSize: 12, lineHeight: 18, marginTop: -8 },

  socialRow: { flexDirection: "row", gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  socialBtnText: { fontSize: 14, fontWeight: "600" },

  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 11, fontWeight: "500", textAlign: "center" },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  errorText: { color: "#E53E3E", fontSize: 13, fontWeight: "500", flex: 1 },

  fieldGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600" },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: { flex: 1, fontSize: 15, padding: 0 },

  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 4,
  },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  demoBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  demoHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  demoTitle: { fontSize: 12, fontWeight: "700" },
  demoGrid: { gap: 8 },
  demoItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  roleBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  demoText: { fontSize: 13, fontWeight: "500" },
});
