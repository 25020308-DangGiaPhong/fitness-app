import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { DietGoal, MealItem, UserBodyStats } from './fitmeal.types';
import {
  evaluateBMI,
  calculateTargetCalories,
  scaleMealsToTargetCalories,
} from './fitmealCalculator';
import { GOAL_LABELS, WEEKLY_MEAL_PLANS } from './fitmealData';
import { useUserBodyStats } from './userBodyStore';

interface FitMealScreenProps {
  userStats?: UserBodyStats;
}

export const FitMealScreen: React.FC<FitMealScreenProps> = ({
  userStats: propStats,
}) => {
  // Lấy dữ liệu đồng bộ thời gian thực từ Store chung (nối với Profile)
  const { userStats: sharedStats, updateUserBodyStats } = useUserBodyStats();
  const activeStats = propStats ?? sharedStats;

  // State cho Modal chỉnh sửa nhanh Chiều cao & Cân nặng
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inputWeight, setInputWeight] = useState(String(activeStats.weightKg));
  const [inputHeight, setInputHeight] = useState(String(activeStats.heightCm));
const [previousStats, setPreviousStats] = useState({
  weightKg: activeStats.weightKg,
  heightCm: activeStats.heightCm,
});

if (
  previousStats.weightKg !== activeStats.weightKg ||
  previousStats.heightCm !== activeStats.heightCm
) {
  setPreviousStats({
    weightKg: activeStats.weightKg,
    heightCm: activeStats.heightCm,
  });
  setInputWeight(String(activeStats.weightKg));
  setInputHeight(String(activeStats.heightCm));
}
  // 1. Tính toán đánh giá BMI tự động mỗi khi weightKg hoặc heightCm thay đổi
  const bmiAssessment = useMemo(
    () => evaluateBMI(activeStats.weightKg, activeStats.heightCm),
    [activeStats.weightKg, activeStats.heightCm]
  );

  // 2. Tự động chuyển mục tiêu đề xuất khi mức BMI thay đổi
const [selectedGoal, setSelectedGoal] = useState<DietGoal>(
  bmiAssessment.recommendedGoal
);
const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
const [activeMealModal, setActiveMealModal] = useState<MealItem | null>(null);

const [previousRecommendedGoal, setPreviousRecommendedGoal] =
  useState(bmiAssessment.recommendedGoal);

if (previousRecommendedGoal !== bmiAssessment.recommendedGoal) {
  setPreviousRecommendedGoal(bmiAssessment.recommendedGoal);
  setSelectedGoal(bmiAssessment.recommendedGoal);
}
  // 3. Tính lại tổng Calo định mức mỗi ngày
  const targetDailyCalories = useMemo(
    () =>
      calculateTargetCalories(
        activeStats,
        selectedGoal,
        bmiAssessment.bmiValue
      ),
    [activeStats, selectedGoal, bmiAssessment.bmiValue]
  );

  // 4. Tự động co giãn số gram (g) nguyên liệu theo Calo mới
  const currentDayMeals = useMemo(() => {
    const plan = WEEKLY_MEAL_PLANS[selectedDayIndex] ?? WEEKLY_MEAL_PLANS[0];
    return scaleMealsToTargetCalories(plan?.meals ?? [], targetDailyCalories);
  }, [selectedDayIndex, targetDailyCalories]);

  const dailyTotals = useMemo(() => {
    return currentDayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.baseCalories,
        protein: acc.protein + meal.macros.protein,
        carbs: acc.carbs + meal.macros.carbs,
        fat: acc.fat + meal.macros.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [currentDayMeals]);

  const handleSaveBodyStats = () => {
    const w = parseFloat(inputWeight.replace(',', '.'));
    const h = parseFloat(inputHeight.replace(',', '.'));
    if (!isNaN(w) && w > 20 && w < 300 && !isNaN(h) && h > 80 && h < 250) {
      updateUserBodyStats({ weightKg: w, heightCm: h });
      setIsEditModalOpen(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <Text style={styles.headerTitle}>FitMeal Dinh Dưỡng</Text>
        <Text style={styles.headerSubtitle}>
          Thực đơn cá nhân hóa theo chỉ số cơ thể của bạn
        </Text>

        {/* THẺ ĐÁNH GIÁ BMI */}
        <View style={styles.bmiCard}>
          <View style={styles.bmiTopRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.bmiStatsText}>
                Chiều cao:{' '}
                <Text style={styles.boldWhite}>{activeStats.heightCm} cm</Text>{' '}
                • Cân nặng:{' '}
                <Text style={styles.boldWhite}>{activeStats.weightKg} kg</Text>
              </Text>
              <View style={styles.badgeAndEditRow}>
                <View
                  style={[
                    styles.bmiBadge,
                    {
                      backgroundColor: bmiAssessment.color + '25',
                      borderColor: bmiAssessment.color,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bmiBadgeText,
                      { color: bmiAssessment.color },
                    ]}
                  >
                    {bmiAssessment.label}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.editStatsBtn}
                  onPress={() => setIsEditModalOpen(true)}
                >
                  <Text style={styles.editStatsBtnText}>✏️ Sửa chỉ số</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.bmiScoreCircle,
                { borderColor: bmiAssessment.color },
              ]}
            >
              <Text style={styles.bmiScoreLabel}>BMI</Text>
              <Text
                style={[styles.bmiScoreValue, { color: bmiAssessment.color }]}
              >
                {bmiAssessment.bmiValue}
              </Text>
            </View>
          </View>
          <Text style={styles.bmiAdviceText}>{bmiAssessment.advice}</Text>
        </View>

        {/* CHỌN MỤC TIÊU DINH DƯỠNG */}
        <Text style={styles.sectionTitle}>1. Chọn chế độ ăn mục tiêu</Text>
        <View style={styles.goalGrid}>
          {(Object.keys(GOAL_LABELS) as DietGoal[]).map((goalKey) => {
            const isSelected = selectedGoal === goalKey;
            const isRecommended = bmiAssessment.recommendedGoal === goalKey;
            return (
              <TouchableOpacity
                key={goalKey}
                style={[styles.goalCard, isSelected && styles.goalCardActive]}
                onPress={() => setSelectedGoal(goalKey)}
              >
                {isRecommended && (
                  <Text style={styles.recommendTag}>Đề xuất theo BMI</Text>
                )}
                <Text
                  style={[
                    styles.goalTitle,
                    isSelected && styles.goalTextActive,
                  ]}
                >
                  {GOAL_LABELS[goalKey].title}
                </Text>
                <Text style={styles.goalSubtitle}>
                  {GOAL_LABELS[goalKey].subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TỔNG QUAN CALO & MACROS MỤC TIÊU TRONG NGÀY */}
        <View style={styles.macroSummaryCard}>
          <View>
            <Text style={styles.macroLabel}>Calo định mức / ngày</Text>
            <Text style={styles.macroCaloriesValue}>
              {dailyTotals.calories} kcal
            </Text>
          </View>
          <View style={styles.macroRow}>
            <View style={styles.macroPill}>
              <Text style={styles.macroPillVal}>{dailyTotals.protein}g</Text>
              <Text style={styles.macroPillLabel}>Đạm</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={styles.macroPillVal}>{dailyTotals.carbs}g</Text>
              <Text style={styles.macroPillLabel}>Tinh bột</Text>
            </View>
            <View style={styles.macroPill}>
              <Text style={styles.macroPillVal}>{dailyTotals.fat}g</Text>
              <Text style={styles.macroPillLabel}>Chất béo</Text>
            </View>
          </View>
        </View>

        {/* CHỌN NGÀY TRONG TUẦN */}
        <Text style={styles.sectionTitle}>2. Thực đơn theo ngày</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
        >
          {WEEKLY_MEAL_PLANS.map((plan, idx) => {
            const active = idx === selectedDayIndex;
            return (
              <TouchableOpacity
                key={plan.dayLabel}
                style={[styles.dayButton, active && styles.dayButtonActive]}
                onPress={() => setSelectedDayIndex(idx)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    active && styles.dayButtonTextActive,
                  ]}
                >
                  {plan.dayLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* DANH SÁCH BỮA ĂN */}
        {currentDayMeals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.mealCard}
            activeOpacity={0.85}
            onPress={() => setActiveMealModal(meal)}
          >
            <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <View style={styles.mealHeaderRow}>
                <Text style={styles.mealTypeTag}>{meal.mealType}</Text>
                <Text style={styles.mealCalorieTag}>
                  🔥 {meal.baseCalories} kcal
                </Text>
              </View>
              <Text style={styles.mealTitle} numberOfLines={2}>
                {meal.title}
              </Text>
              <Text style={styles.mealMacrosText}>
                P: {meal.macros.protein}g • C: {meal.macros.carbs}g • F:{' '}
                {meal.macros.fat}g
              </Text>
              <Text style={styles.tapToViewText}>
                Ấn để xem định lượng (g) & cách nấu →
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL CẬP NHẬT NHANH CÂN NẶNG & CHIỀU CAO */}
      <Modal
        visible={isEditModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.editModalBox}>
            <Text style={styles.editModalTitle}>
              Cập nhật Chiều cao & Cân nặng
            </Text>
            <Text style={styles.editModalDesc}>
              Chỉ số BMI và lượng Calo thực đơn sẽ tự động tính toán lại ngay
              khi lưu.
            </Text>

            <Text style={styles.inputLabel}>Chiều cao (cm)</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={inputHeight}
              onChangeText={setInputHeight}
              placeholder="Ví dụ: 172"
              placeholderTextColor="#64748B"
            />

            <Text style={styles.inputLabel}>Cân nặng (kg)</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={inputWeight}
              onChangeText={setInputWeight}
              placeholder="Ví dụ: 65"
              placeholderTextColor="#64748B"
            />

            <View style={styles.editModalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsEditModalOpen(false)}
              >
                <Text style={styles.cancelBtnText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveBodyStats}
              >
                <Text style={styles.saveBtnText}>Lưu & Tính lại BMI</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL CHI TIẾT NGUYÊN LIỆU (GRAM) & CÁCH CHẾ BIẾN */}
      <Modal
        visible={!!activeMealModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveMealModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {activeMealModal && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: activeMealModal.imageUrl }}
                  style={styles.modalImage}
                />
                <View style={styles.modalBody}>
                  <Text style={styles.modalMealType}>
                    {activeMealModal.mealType}
                  </Text>
                  <Text style={styles.modalTitle}>
                    {activeMealModal.title}
                  </Text>
                  <Text style={styles.modalCalories}>
                    Tổng năng lượng: {activeMealModal.baseCalories} kcal (Đã cân
                    chỉnh theo BMI {bmiAssessment.bmiValue})
                  </Text>

                  <Text style={styles.modalSectionHeading}>
                    🥗 Nguyên liệu chuẩn bị (Định lượng theo gram)
                  </Text>
                  {activeMealModal.ingredients.map((ing, index) => (
                    <View key={index} style={styles.ingredientRow}>
                      <Text style={styles.ingredientName}>• {ing.name}</Text>
                      <Text style={styles.ingredientGrams}>{ing.grams} g</Text>
                    </View>
                  ))}

                  <Text style={styles.modalSectionHeading}>
                    🍳 Hướng dẫn chế biến nhanh
                  </Text>
                  {activeMealModal.cookingSteps.map((step, index) => (
                    <View key={index} style={styles.stepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setActiveMealModal(null)}
                  >
                    <Text style={styles.closeButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 28 : 0,
  },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#F8FAFC' },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 16,
  },
  bmiCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bmiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bmiStatsText: { color: '#CBD5E1', fontSize: 14, marginBottom: 8 },
  boldWhite: { color: '#FFFFFF', fontWeight: '700' },
  badgeAndEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  bmiBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  bmiBadgeText: { fontSize: 13, fontWeight: '700' },
  editStatsBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  editStatsBtnText: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
  bmiScoreCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  bmiScoreLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  bmiScoreValue: { fontSize: 20, fontWeight: '800' },
  bmiAdviceText: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  goalCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  goalCardActive: { borderColor: '#10B981', backgroundColor: '#064E3B' },
  recommendTag: {
    fontSize: 10,
    color: '#34D399',
    fontWeight: '700',
    marginBottom: 4,
  },
  goalTitle: { fontSize: 15, fontWeight: '700', color: '#F1F5F9' },
  goalTextActive: { color: '#FFFFFF' },
  goalSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  macroSummaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  macroLabel: { color: '#94A3B8', fontSize: 12 },
  macroCaloriesValue: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  macroRow: { flexDirection: 'row', gap: 10 },
  macroPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  macroPillVal: { color: '#F8FAFC', fontWeight: '700', fontSize: 13 },
  macroPillLabel: { color: '#64748B', fontSize: 11 },
  daySelector: { marginBottom: 16 },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    marginRight: 10,
  },
  dayButtonActive: { backgroundColor: '#3B82F6' },
  dayButtonText: { color: '#94A3B8', fontWeight: '600' },
  dayButtonTextActive: { color: '#FFFFFF', fontWeight: '700' },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mealImage: { width: 115, height: 125 },
  mealInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  mealHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealTypeTag: { color: '#38BDF8', fontSize: 12, fontWeight: '700' },
  mealCalorieTag: { color: '#FBBF24', fontSize: 12, fontWeight: '700' },
  mealTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginVertical: 4,
  },
  mealMacrosText: { color: '#94A3B8', fontSize: 12 },
  tapToViewText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  editModalBox: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  editModalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  editModalDesc: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  inputLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  editModalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#334155',
  },
  cancelBtnText: { color: '#CBD5E1', fontWeight: '600' },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#10B981',
  },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    overflow: 'hidden',
  },
  modalImage: { width: '100%', height: 210 },
  modalBody: { padding: 20 },
  modalMealType: { color: '#38BDF8', fontSize: 13, fontWeight: '700' },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  modalCalories: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 16,
  },
  modalSectionHeading: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 10,
  },
  ingredientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  ingredientName: { color: '#E2E8F0', fontSize: 14 },
  ingredientGrams: { color: '#34D399', fontSize: 14, fontWeight: '700' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  stepBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, color: '#CBD5E1', fontSize: 14, lineHeight: 20 },
  closeButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  closeButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default FitMealScreen;