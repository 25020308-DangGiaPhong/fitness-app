import { File } from 'expo-file-system';
import { updateUserBodyStats } from '@/features/home/FitMeal/userBodyStore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '@/modules/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { AppText, Button, Screen, colors, radii, spacing } from '@/ui';

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
};

export function ProfileScreen() {
  const { user, signOut } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [editing, setEditing] = useState(false);

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, date_of_birth, height_cm, weight_kg')
        .eq('id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error('Load profile error:', error.message);
        Alert.alert('Error', 'Could not load your profile.');
      } else {
        const loadedProfile: Profile = data ?? {
          full_name: null,
          avatar_url: null,
          date_of_birth: null,
          height_cm: null,
          weight_kg: null,
        };

        setProfile(loadedProfile);
        setFullName(loadedProfile.full_name ?? '');
        setDateOfBirth(loadedProfile.date_of_birth ?? '');
        setHeight(
          loadedProfile.height_cm != null
            ? String(loadedProfile.height_cm)
            : '',
        );
        setWeight(
          loadedProfile.weight_kg != null
            ? String(loadedProfile.weight_kg)
            : '',
        );
        setAvatarUri(loadedProfile.avatar_url);

        // Đồng bộ dữ liệu ban đầu vừa tải từ Supabase sang FitMeal
        if (loadedProfile.weight_kg != null || loadedProfile.height_cm != null) {
          updateUserBodyStats({
            weightKg: loadedProfile.weight_kg ?? 70,
            heightCm: loadedProfile.height_cm ?? 172,
          });
        }
      }

      setLoading(false);
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleChooseAvatar = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow access to your photo library to choose an avatar.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setNewAvatarUri(result.assets[0].uri);
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setNewAvatarUri(null);

    if (!profile) return;

    setFullName(profile.full_name ?? '');
    setDateOfBirth(profile.date_of_birth ?? '');
    setHeight(
      profile.height_cm != null ? String(profile.height_cm) : '',
    );
    setWeight(
      profile.weight_kg != null ? String(profile.weight_kg) : '',
    );
    setAvatarUri(profile.avatar_url);
  };

  const handleSave = async () => {
    if (!user) return;

    const trimmedName = fullName.trim();

    if (!trimmedName) {
      Alert.alert('Invalid information', 'Please enter your full name.');
      return;
    }

    if (
      dateOfBirth &&
      !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)
    ) {
      Alert.alert(
        'Invalid date',
        'Please enter the date in YYYY-MM-DD format.',
      );
      return;
    }

    const heightValue = height.trim() ? Number(height) : null;
    const weightValue = weight.trim() ? Number(weight) : null;

    if (
      (heightValue !== null &&
        (!Number.isFinite(heightValue) || heightValue <= 0)) ||
      (weightValue !== null &&
        (!Number.isFinite(weightValue) || weightValue <= 0))
    ) {
      Alert.alert(
        'Invalid information',
        'Height and weight must be positive numbers.',
      );
      return;
    }

    try {
      setSaving(true);

      let uploadedAvatarUrl = profile?.avatar_url ?? null;

      if (newAvatarUri) {
        const response = await fetch(newAvatarUri);

        if (!response.ok) {
            throw new Error('Could not read the selected image.');
        }

        const arrayBuffer = await response.arrayBuffer();

        const filePath = `${user.id}/avatar-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        uploadedAvatarUrl = publicUrlData.publicUrl;
        }

      const updatedProfile: Profile = {
        full_name: trimmedName,
        avatar_url: uploadedAvatarUrl,
        date_of_birth: dateOfBirth || null,
        height_cm: heightValue,
        weight_kg: weightValue,
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            ...updatedProfile,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' },
        );

      if (updateError) throw updateError;

      setProfile(updatedProfile);
      setAvatarUri(uploadedAvatarUrl);
      setNewAvatarUri(null);
      setEditing(false);

      // ==========================================
      // ĐỒNG BỘ CÂN NẶNG & CHIỀU CAO SANG FITMEAL TỨC THÌ
      // ==========================================
      if (weightValue !== null && heightValue !== null) {
        updateUserBodyStats({
          weightKg: weightValue,
          heightCm: heightValue,
        });
      }

      Alert.alert('Success', 'Your profile has been updated.');
    } catch (error) {
      console.error('Update profile error:', error);

      Alert.alert(
        'Update failed',
        error instanceof Error
          ? error.message
          : 'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await signOut();
    } catch (error) {
      Alert.alert(
        'Logout failed',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setSigningOut(false);
    }
  };

  const avatarLetter = (
    profile?.full_name || user?.email || 'U'
  )
    .charAt(0)
    .toUpperCase();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText variant="screenTitle">Profile</AppText>
          <AppText tone="secondary">
            Manage your account and personal information.
          </AppText>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.action} />
        ) : (
          <>
            <View style={styles.card}>
              <Pressable
                onPress={editing ? handleChooseAvatar : undefined}
                style={styles.avatar}
                accessibilityRole={editing ? 'button' : undefined}
                accessibilityLabel="Change profile picture"
              >
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <AppText variant="title" style={styles.avatarText}>
                    {avatarLetter}
                  </AppText>
                )}
              </Pressable>

              {editing && (
                <AppText
                  tone="secondary"
                  style={styles.centerText}
                >
                  Tap the picture to change your avatar
                </AppText>
              )}

              <AppText variant="heading" style={styles.centerText}>
                {profile?.full_name || 'FitAI User'}
              </AppText>

              <AppText tone="secondary" style={styles.centerText}>
                {user?.email || 'No email'}
              </AppText>
            </View>

            <View style={styles.card}>
              <AppText variant="heading">
                Personal information
              </AppText>

              {editing ? (
                <>
                  <AppText>Full name</AppText>
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    style={styles.input}
                    placeholderTextColor={colors.textSecondary}
                  />

                  <AppText>Date of birth (YYYY-MM-DD)</AppText>
                  <TextInput
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                    placeholder="2005-01-15"
                    style={styles.input}
                    placeholderTextColor={colors.textSecondary}
                  />

                  <AppText>Height (cm)</AppText>
                  <TextInput
                    value={height}
                    onChangeText={setHeight}
                    placeholder="Enter height"
                    keyboardType="decimal-pad"
                    style={styles.input}
                    placeholderTextColor={colors.textSecondary}
                  />

                  <AppText>Weight (kg)</AppText>
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="Enter weight"
                    keyboardType="decimal-pad"
                    style={styles.input}
                    placeholderTextColor={colors.textSecondary}
                  />

                  <Button
                    label={saving ? 'Saving...' : 'Save changes'}
                    onPress={handleSave}
                    disabled={saving}
                  />

                  <Pressable
                    onPress={handleCancel}
                    disabled={saving}
                    style={styles.cancelButton}
                  >
                    <AppText tone="secondary">
                      Cancel
                    </AppText>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.infoRow}>
                    <AppText tone="secondary">Full name</AppText>
                    <AppText variant="bodyStrong">
                      {profile?.full_name || 'Not provided'}
                    </AppText>
                  </View>

                  <View style={styles.infoRow}>
                    <AppText tone="secondary">Date of birth</AppText>
                    <AppText variant="bodyStrong">
                      {profile?.date_of_birth || 'Not provided'}
                    </AppText>
                  </View>

                  <View style={styles.infoRow}>
                    <AppText tone="secondary">Height</AppText>
                    <AppText variant="bodyStrong">
                      {profile?.height_cm != null
                        ? `${profile.height_cm} cm`
                        : 'Not provided'}
                    </AppText>
                  </View>

                  <View style={styles.infoRow}>
                    <AppText tone="secondary">Weight</AppText>
                    <AppText variant="bodyStrong">
                      {profile?.weight_kg != null
                        ? `${profile.weight_kg} kg`
                        : 'Not provided'}
                    </AppText>
                  </View>

                  <Button
                    label="Edit profile"
                    onPress={() => setEditing(true)}
                  />
                </>
              )}
            </View>
          </>
        )}

        <View style={styles.logout}>
          {signingOut ? (
            <ActivityIndicator color={colors.action} />
          ) : (
            <Button
              label="Logout"
              onPress={handleLogout}
              accessibilityHint="Sign out of your FitAI account"
            />
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  header: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.accentSurface,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: colors.action,
  },
  centerText: {
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.control,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logout: {
    marginTop: spacing.md,
  },
});