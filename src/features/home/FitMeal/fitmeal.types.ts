export type BMILevel =
  | 'UNDERWEIGHT'     // Suy dinh dưỡng / Thiếu cân
  | 'NORMAL'          // Bình thường
  | 'OVERWEIGHT'      // Thừa cân (Tiền béo phì)
  | 'OBESE_CLASS_1'   // Béo phì độ I
  | 'OBESE_CLASS_2'   // Béo phì độ II
  | 'OBESE_CLASS_3';  // Béo phì độ III (Nguy hiểm)

export type DietGoal = 'DEFICIT' | 'MUSCLE_GAIN' | 'WEIGHT_GAIN' | 'MAINTENANCE';

export interface UserBodyStats {
  weightKg: number;      // Cân nặng có sẵn của user (kg)
  heightCm: number;      // Chiều cao có sẵn của user (cm)
  age?: number;          // Tuổi (mặc định 22 nếu chưa có)
  gender?: 'MALE' | 'FEMALE';
  activityMultiplier?: number; // Hệ số vận động (mặc định 1.375 - tập nhẹ 3-4 buổi/tuần)
}

export interface BMIAssessment {
  bmiValue: number;
  level: BMILevel;
  label: string;
  color: string;
  advice: string;
  recommendedGoal: DietGoal;
}

export interface Ingredient {
  name: string;
  grams: number;         // Khối lượng tính bằng gram (g)
  caloriesPer100g: number;
}

export interface MealItem {
  id: string;
  mealType: 'Bữa Sáng' | 'Bữa Trưa' | 'Bữa Phụ' | 'Bữa Tối';
  title: string;
  imageUrl: string;
  baseCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Ingredient[];
  cookingSteps: string[];
}

export interface DailyMealPlan {
  dayLabel: string; // 'Thứ 2', 'Thứ 3',...
  meals: MealItem[];
}