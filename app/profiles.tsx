import { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppShell from "../src/components/AppShell";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  siteName: string;
  contactName: string;
  phone: string;
  fiberType: string;
  fiberCount: string;
  notes: string;
  createdAt: number;
}

type ProfileDraft = Omit<Profile, "id" | "createdAt">;

const STORAGE_KEY = "@fiberref/profiles";

const FIBER_TYPE_OPTIONS = ["SMF OS2", "OM3", "OM4", "OM5", "Mixed"];

// ─── Storage helpers ──────────────────────────────────────────────────────────

async function loadProfiles(): Promise<Profile[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Profile[]) : [];
}

async function saveProfiles(profiles: Profile[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

// ─── Empty draft ──────────────────────────────────────────────────────────────

function emptyDraft(): ProfileDraft {
  return {
    siteName: "",
    contactName: "",
    phone: "",
    fiberType: "SMF OS2",
    fiberCount: "",
    notes: "",
  };
}

// ─── Form field ───────────────────────────────────────────────────────────────

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "phone-pad" | "numeric";
}) {
  return (
    <View className="mb-3">
      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#333333"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        className="bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white text-sm"
        style={multiline ? { height: 72, textAlignVertical: "top" } : undefined}
      />
    </View>
  );
}

// ─── Fiber type selector ──────────────────────────────────────────────────────

function FiberTypeSelector({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (type: string) => void;
}) {
  return (
    <View className="mb-3">
      <Text className="text-[#555555] text-[10px] font-semibold uppercase tracking-wider mb-1">
        Fiber Type
      </Text>
      <View className="flex-row flex-wrap">
        {FIBER_TYPE_OPTIONS.map((option) => {
          const isSelected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              className={`border rounded-lg px-2.5 py-1.5 mr-2 mb-2 ${
                isSelected
                  ? "border-[#00FFFF] bg-[#00FFFF15]"
                  : "border-[#2A2A2A] bg-[#111111]"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? "text-[#00FFFF]" : "text-[#555555]"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Profile form modal ───────────────────────────────────────────────────────

function ProfileFormModal({
  visible,
  initial,
  onSave,
  onCancel,
}: {
  visible: boolean;
  initial: ProfileDraft;
  onSave: (draft: ProfileDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ProfileDraft>(initial);

  // Sync when modal opens with a new initial value
  useEffect(() => {
    setDraft(initial);
  }, [initial]);

  function set(key: keyof ProfileDraft, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!draft.siteName.trim()) {
      Alert.alert("Required", "Site name is required.");
      return;
    }
    onSave(draft);
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-[#0D0D0D]">
        {/* Modal header */}
        <View className="flex-row items-center px-4 py-3 border-b border-[#1A1A1A]">
          <Pressable onPress={onCancel} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text className="text-[#555555] text-sm">Cancel</Text>
          </Pressable>
          <Text className="text-white text-base font-semibold flex-1 text-center">
            Profile
          </Text>
          <Pressable onPress={handleSave} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text className="text-[#00FFFF] text-sm font-semibold">Save</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          keyboardShouldPersistTaps="handled"
        >
          <FormField
            label="Site Name *"
            value={draft.siteName}
            onChangeText={(v) => set("siteName", v)}
            placeholder="e.g. Acme Corp — Building A"
          />
          <FormField
            label="Contact Name"
            value={draft.contactName}
            onChangeText={(v) => set("contactName", v)}
            placeholder="e.g. Jane Smith"
          />
          <FormField
            label="Phone"
            value={draft.phone}
            onChangeText={(v) => set("phone", v)}
            placeholder="e.g. 555-867-5309"
            keyboardType="phone-pad"
          />
          <FiberTypeSelector
            value={draft.fiberType}
            onSelect={(v) => set("fiberType", v)}
          />
          <FormField
            label="Fiber Count"
            value={draft.fiberCount}
            onChangeText={(v) => set("fiberCount", v)}
            placeholder="e.g. 144F"
            keyboardType="default"
          />
          <FormField
            label="Notes"
            value={draft.notes}
            onChangeText={(v) => set("notes", v)}
            placeholder="Route, splice locations, access notes…"
            multiline
          />
          {/* Bottom padding for keyboard */}
          <View className="h-16" />
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Profile card ─────────────────────────────────────────────────────────────

function ProfileCard({
  profile,
  onEdit,
  onDelete,
}: {
  profile: Profile;
  onEdit: () => void;
  onDelete: () => void;
}) {
  function confirmDelete() {
    Alert.alert(
      "Delete Profile",
      `Delete "${profile.siteName}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  }

  return (
    <View className="mx-3 mb-3 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      <View className="flex-row items-start mb-2">
        <Text className="text-[#00FFFF] text-base font-bold flex-1 mr-2">
          {profile.siteName}
        </Text>
        <View className="border border-[#2A2A2A] rounded px-1.5 py-0.5">
          <Text className="text-[#555555] text-[10px]">{profile.fiberType}</Text>
        </View>
      </View>

      {profile.contactName !== "" && (
        <Text className="text-[#A0A0A0] text-xs mb-0.5">{profile.contactName}</Text>
      )}
      {profile.phone !== "" && (
        <Text className="text-[#555555] text-xs mb-0.5">{profile.phone}</Text>
      )}
      {profile.fiberCount !== "" && (
        <Text className="text-[#555555] text-xs mb-0.5">{profile.fiberCount}</Text>
      )}
      {profile.notes !== "" && (
        <Text className="text-[#444444] text-xs leading-4 mt-1 italic">
          {profile.notes}
        </Text>
      )}

      <View className="flex-row mt-3 pt-3 border-t border-[#242424]">
        <Pressable onPress={onEdit} className="flex-1 items-center py-1" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-[#00FFFF] text-xs font-semibold">Edit</Text>
        </Pressable>
        <View className="w-[1px] bg-[#242424]" />
        <Pressable onPress={confirmDelete} className="flex-1 items-center py-1" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text className="text-[#FF4444] text-xs font-semibold">Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-[#2A2A2A] text-5xl mb-4">◈</Text>
      <Text className="text-[#555555] text-sm font-semibold text-center mb-1">
        No profiles yet
      </Text>
      <Text className="text-[#333333] text-xs text-center mb-6 leading-4">
        Save customer sites, contact info, and fiber plant details for quick
        access in the field.
      </Text>
      <Pressable
        onPress={onAdd}
        className="border border-[#00FFFF] rounded-xl px-5 py-2.5"
      >
        <Text className="text-[#00FFFF] text-sm font-semibold">
          Add First Profile
        </Text>
      </Pressable>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfilesScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfiles().then(setProfiles);
  }, []);

  const persistAndSet = useCallback(async (updated: Profile[]) => {
    setProfiles(updated);
    await saveProfiles(updated);
  }, []);

  function openNew() {
    setEditingProfile(null);
    setModalVisible(true);
  }

  function openEdit(profile: Profile) {
    setEditingProfile(profile);
    setModalVisible(true);
  }

  async function handleSave(draft: ProfileDraft) {
    if (editingProfile) {
      const updated = profiles.map((p) =>
        p.id === editingProfile.id ? { ...editingProfile, ...draft } : p
      );
      await persistAndSet(updated);
    } else {
      const newProfile: Profile = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        ...draft,
      };
      await persistAndSet([newProfile, ...profiles]);
    }
    setModalVisible(false);
  }

  async function handleDelete(id: string) {
    await persistAndSet(profiles.filter((p) => p.id !== id));
  }

  const draft: ProfileDraft = editingProfile
    ? {
        siteName: editingProfile.siteName,
        contactName: editingProfile.contactName,
        phone: editingProfile.phone,
        fiberType: editingProfile.fiberType,
        fiberCount: editingProfile.fiberCount,
        notes: editingProfile.notes,
      }
    : emptyDraft();

  return (
    <AppShell>
      <Stack.Screen
        options={{
          title: "Customer Profiles",
          headerRight: () => (
            <Pressable onPress={openNew} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} className="pr-1">
              <Text className="text-[#00FFFF] text-sm font-semibold">+ Add</Text>
            </Pressable>
          ),
        }}
      />

      {profiles.length === 0 ? (
        <EmptyState onAdd={openNew} />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
        >
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => openEdit(profile)}
              onDelete={() => handleDelete(profile.id)}
            />
          ))}
        </ScrollView>
      )}

      <ProfileFormModal
        visible={modalVisible}
        initial={draft}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
      />
    </AppShell>
  );
}
