import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";
import { HistoricalSite } from "@/constants/sites";
import { BatikHeader } from "@/components/BatikHeader";

const CATEGORIES: { value: HistoricalSite["category"]; label: string }[] = [
  { value: "temple", label: "Candi" },
  { value: "palace", label: "Istana" },
  { value: "fort", label: "Benteng" },
  { value: "museum", label: "Museum" },
  { value: "site", label: "Situs" },
  { value: "monument", label: "Monumen" },
];

interface FormState {
  name: string;
  nameLocal: string;
  category: HistoricalSite["category"];
  address: string;
  city: string;
  province: string;
  latitude: string;
  longitude: string;
  description: string;
  shortDesc: string;
  period: string;
  yearBuilt: string;
  rating: string;
  reviewCount: string;
  openHours: string;
  ticketPrice: string;
  tags: string;
  highlights: string;
  tips: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  nameLocal: "",
  category: "temple",
  address: "",
  city: "",
  province: "",
  latitude: "",
  longitude: "",
  description: "",
  shortDesc: "",
  period: "",
  yearBuilt: "",
  rating: "4.5",
  reviewCount: "0",
  openHours: "08:00 - 17:00",
  ticketPrice: "Rp 0",
  tags: "",
  highlights: "",
  tips: "",
};

function siteToForm(site: HistoricalSite): FormState {
  return {
    name: site.name,
    nameLocal: site.nameLocal,
    category: site.category,
    address: site.location.address,
    city: site.location.city,
    province: site.location.province,
    latitude: site.location.latitude.toString(),
    longitude: site.location.longitude.toString(),
    description: site.description,
    shortDesc: site.shortDesc,
    period: site.period,
    yearBuilt: site.yearBuilt,
    rating: site.rating.toString(),
    reviewCount: site.reviewCount.toString(),
    openHours: site.openHours,
    ticketPrice: site.ticketPrice,
    tags: site.tags.join(", "),
    highlights: site.highlights.join("\n"),
    tips: site.tips.join("\n"),
  };
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  required?: boolean;
  hint?: string;
}

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType, required, hint }: FieldProps) {
  const colors = useColors();
  return (
    <View style={fieldStyles.wrap}>
      <View style={fieldStyles.labelRow}>
        <Text style={[fieldStyles.label, { color: colors.foreground }]}>{label}</Text>
        {required && <Text style={{ color: colors.destructive, fontSize: 13 }}>*</Text>}
      </View>
      {hint && <Text style={[fieldStyles.hint, { color: colors.mutedForeground }]}>{hint}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType ?? "default"}
        style={[
          fieldStyles.input,
          {
            color: colors.foreground,
            backgroundColor: colors.card,
            borderColor: colors.border,
            textAlignVertical: multiline ? "top" : "center",
            minHeight: multiline ? 90 : 46,
          },
        ]}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  label: { fontSize: 14, fontWeight: "600" },
  hint: { fontSize: 11, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
});

export default function SiteFormScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getSiteById, addSite, updateSite } = useApp();

  const isEdit = !!id;
  const existingSite = id ? getSiteById(id) : undefined;

  const [form, setForm] = useState<FormState>(
    existingSite ? siteToForm(existingSite) : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) newErrors.name = "Nama harus diisi";
    if (!form.nameLocal.trim()) newErrors.nameLocal = "Nama lokal harus diisi";
    if (!form.city.trim()) newErrors.city = "Kota harus diisi";
    if (!form.province.trim()) newErrors.province = "Provinsi harus diisi";
    if (!form.description.trim()) newErrors.description = "Deskripsi harus diisi";
    if (!form.shortDesc.trim()) newErrors.shortDesc = "Deskripsi singkat harus diisi";
    if (!form.period.trim()) newErrors.period = "Periode harus diisi";
    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = "Koordinat tidak valid";
    if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = "Koordinat tidak valid";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const siteData: Omit<HistoricalSite, "id"> = {
        name: form.name.trim(),
        nameLocal: form.nameLocal.trim(),
        category: form.category,
        location: {
          latitude: parseFloat(form.latitude) || 0,
          longitude: parseFloat(form.longitude) || 0,
          address: form.address.trim(),
          city: form.city.trim(),
          province: form.province.trim(),
        },
        description: form.description.trim(),
        shortDesc: form.shortDesc.trim(),
        period: form.period.trim(),
        yearBuilt: form.yearBuilt.trim(),
        rating: Math.min(5, Math.max(0, parseFloat(form.rating) || 4.5)),
        reviewCount: parseInt(form.reviewCount) || 0,
        openHours: form.openHours.trim(),
        ticketPrice: form.ticketPrice.trim(),
        heroImage: require("../../assets/images/hero_borobudur.png"),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        highlights: form.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
        tips: form.tips.split("\n").map((t) => t.trim()).filter(Boolean),
      };

      if (isEdit && id) {
        await updateSite(id, siteData);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await addSite(siteData);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.back();
    } catch (e) {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <BatikHeader style={[styles.header, { paddingTop: topPadding + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: "rgba(255,255,255,0.18)" }]}
        >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>
            {isEdit ? "Edit Destinasi" : "Tambah Destinasi"}
          </Text>
          <Text style={styles.headerSub}>
            {isEdit ? "Perbarui informasi destinasi" : "Tambah destinasi wisata baru"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: saving ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.22)" }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Simpan</Text>
          )}
        </TouchableOpacity>
      </BatikHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPadding + 30 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section: Identitas */}
        <SectionHeader title="Identitas Destinasi" icon="info" colors={colors} />

        <Field label="Nama" value={form.name} onChangeText={set("name")} placeholder="Candi Borobudur" required />
        {errors.name && <ErrorText msg={errors.name} />}

        <Field label="Nama Lokal" value={form.nameLocal} onChangeText={set("nameLocal")} placeholder="Candi Borobudur" required />
        {errors.nameLocal && <ErrorText msg={errors.nameLocal} />}

        {/* Category picker */}
        <View style={{ marginBottom: 16 }}>
          <Text style={[fieldStyles.label, { color: colors.foreground, marginBottom: 8 }]}>Kategori *</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: form.category === cat.value ? colors.primary : colors.card,
                    borderColor: form.category === cat.value ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setForm((f) => ({ ...f, category: cat.value }))}
              >
                <Text
                  style={[
                    styles.catChipText,
                    { color: form.category === cat.value ? "#fff" : colors.foreground },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Field
          label="Deskripsi Singkat"
          value={form.shortDesc}
          onChangeText={set("shortDesc")}
          placeholder="Penjelasan singkat tentang destinasi"
          required
        />
        {errors.shortDesc && <ErrorText msg={errors.shortDesc} />}

        <Field
          label="Deskripsi Lengkap"
          value={form.description}
          onChangeText={set("description")}
          placeholder="Ceritakan sejarah dan keunikan destinasi ini..."
          multiline
          required
        />
        {errors.description && <ErrorText msg={errors.description} />}

        {/* Section: Lokasi */}
        <SectionHeader title="Lokasi" icon="map-pin" colors={colors} />

        <Field label="Alamat" value={form.address} onChangeText={set("address")} placeholder="Jl. Badrawati, Borobudur" />
        <Field label="Kota / Kabupaten" value={form.city} onChangeText={set("city")} placeholder="Magelang" required />
        {errors.city && <ErrorText msg={errors.city} />}
        <Field label="Provinsi" value={form.province} onChangeText={set("province")} placeholder="Jawa Tengah" required />
        {errors.province && <ErrorText msg={errors.province} />}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field
              label="Latitude"
              value={form.latitude}
              onChangeText={set("latitude")}
              placeholder="-7.6079"
              keyboardType="decimal-pad"
            />
            {errors.latitude && <ErrorText msg={errors.latitude} />}
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Field
              label="Longitude"
              value={form.longitude}
              onChangeText={set("longitude")}
              placeholder="110.2038"
              keyboardType="decimal-pad"
            />
            {errors.longitude && <ErrorText msg={errors.longitude} />}
          </View>
        </View>

        {/* Section: Sejarah */}
        <SectionHeader title="Informasi Sejarah" icon="archive" colors={colors} />
        <Field label="Periode / Era" value={form.period} onChangeText={set("period")} placeholder="Era Buddha" required />
        {errors.period && <ErrorText msg={errors.period} />}
        <Field label="Tahun Dibangun" value={form.yearBuilt} onChangeText={set("yearBuilt")} placeholder="Abad ke-9 (770–842 M)" />

        {/* Section: Operasional */}
        <SectionHeader title="Informasi Kunjungan" icon="clock" colors={colors} />
        <Field label="Jam Buka" value={form.openHours} onChangeText={set("openHours")} placeholder="08:00 - 17:00" />
        <Field label="Harga Tiket" value={form.ticketPrice} onChangeText={set("ticketPrice")} placeholder="Rp 50.000" />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field label="Rating (0-5)" value={form.rating} onChangeText={set("rating")} placeholder="4.5" keyboardType="decimal-pad" />
          </View>
          <View style={{ width: 12 }} />
          <View style={{ flex: 1 }}>
            <Field label="Jumlah Ulasan" value={form.reviewCount} onChangeText={set("reviewCount")} placeholder="1000" keyboardType="numeric" />
          </View>
        </View>

        {/* Section: Konten */}
        <SectionHeader title="Konten & Tag" icon="file-text" colors={colors} />
        <Field
          label="Tag"
          value={form.tags}
          onChangeText={set("tags")}
          placeholder="UNESCO, Hindu, Temple"
          hint="Pisahkan dengan koma (,)"
        />
        <Field
          label="Keistimewaan / Highlights"
          value={form.highlights}
          onChangeText={set("highlights")}
          placeholder={"Panorama indah\nRelief bersejarah\nSunrise terbaik"}
          multiline
          hint="Satu highlight per baris"
        />
        <Field
          label="Tips Kunjungan"
          value={form.tips}
          onChangeText={set("tips")}
          placeholder={"Datang pagi-pagi\nBawa air minum\nKenakan baju sopan"}
          multiline
          hint="Satu tip per baris"
        />

        {/* Save button bottom */}
        <TouchableOpacity
          style={[styles.saveBottomBtn, { backgroundColor: saving ? colors.mutedForeground : colors.primary }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name={isEdit ? "check" : "plus"} size={18} color="#fff" />
              <Text style={styles.saveBtnText}>
                {isEdit ? "Simpan Perubahan" : "Tambah Destinasi"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, icon, colors }: { title: string; icon: string; colors: any }) {
  return (
    <View style={sectionStyles.wrap}>
      <View style={[sectionStyles.iconBox, { backgroundColor: colors.secondary }]}>
        <Feather name={icon as any} size={15} color={colors.primary} />
      </View>
      <Text style={[sectionStyles.title, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

function ErrorText({ msg }: { msg: string }) {
  return (
    <Text style={{ color: "#E53E3E", fontSize: 12, marginTop: -10, marginBottom: 10 }}>
      {msg}
    </Text>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    marginTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8D5B7",
  },
  iconBox: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 15, fontWeight: "700" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: { padding: 9, borderRadius: 10 },
  headerTitles: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#fff" },
  headerSub: { fontSize: 12, marginTop: 1, color: "rgba(255,255,255,0.75)" },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    minWidth: 70,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  catRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  catChipText: { fontSize: 13, fontWeight: "600" },
  row: { flexDirection: "row" },
  saveBottomBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
  },
});
