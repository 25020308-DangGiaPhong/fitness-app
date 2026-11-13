import {
  BMIAssessment,
  DietGoal,
  MealItem,
  UserBodyStats,
} from './fitmeal.types';

/**
 * 1. Tính chỉ số BMI và đánh giá mức độ (từ Suy dinh dưỡng đến Béo phì độ 1, 2, 3)
 */
export const evaluateBMI = (weightKg: number, heightCm: number): BMIAssessment => {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (bmi < 18.5) {
    return {
      bmiValue: bmi,
      level: 'UNDERWEIGHT',
      label: 'Thiếu cân / Suy dinh dưỡng',
      color: '#3B82F6', // Xanh dương
      advice: 'Cơ thể đang thiếu hụt năng lượng. Bạn nên ưu tiên chế độ Tăng cân (Thặng dư Calo lành mạnh) kết hợp tập kháng lực.',
      recommendedGoal: 'WEIGHT_GAIN',
    };
  } else if (bmi >= 18.5 && bmi < 23) {
    return {
      bmiValue: bmi,
      level: 'NORMAL',
      label: 'Cân đối / Bình thường',
      color: '#10B981', // Xanh lá
      advice: 'Chỉ số cơ thể rất tốt! Bạn có thể chọn Tăng cơ (Lean Bulk) để săn chắc hơn hoặc Duy trì vóc dáng.',
      recommendedGoal: 'MUSCLE_GAIN',
    };
  } else if (bmi >= 23 && bmi < 25) {
    return {
      bmiValue: bmi,
      level: 'OVERWEIGHT',
      label: 'Thừa cân (Tiền béo phì)',
      color: '#F59E0B', // Vàng cam
      advice: 'Bạn đang ở ngưỡng thừa cân nhẹ. Nên áp dụng thực đơn Thâm hụt Calo nhẹ (-300 đến -400 kcal) giàu Protein.',
      recommendedGoal: 'DEFICIT',
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      bmiValue: bmi,
      level: 'OBESE_CLASS_1',
      label: 'Béo phì độ I',
      color: '#F97316', // Cam đậm
      advice: 'Cần ưu tiên chế độ Thâm hụt Calo (-500 kcal/ngày), cắt giảm tinh bột nhanh và tăng cường chất xơ.',
      recommendedGoal: 'DEFICIT',
    };
  } else if (bmi >= 30 && bmi < 35) {
    return {
      bmiValue: bmi,
      level: 'OBESE_CLASS_2',
      label: 'Béo phì độ II',
      color: '#EF4444', // Đỏ
      advice: 'Mức độ béo phì trung bình. Cần kiểm soát chặt lượng Calo nạp vào, ưu tiên đạm nạc (ức gà, cá trắng) và rau xanh.',
      recommendedGoal: 'DEFICIT',
    };
  } else {
    return {
      bmiValue: bmi,
      level: 'OBESE_CLASS_3',
      label: 'Béo phì độ III (Nghiêm trọng)',
      color: '#991B1B', // Đỏ sẫm
      advice: 'Cần thực hiện chế độ ăn thâm hụt an toàn, chia nhỏ bữa ăn để tránh đói và kết hợp vận động nhẹ nhàng.',
      recommendedGoal: 'DEFICIT',
    };
  }
};

/**
 * 2. Tính tổng lượng Calo mục tiêu mỗi ngày dựa trên công thức Mifflin-St Jeor + Mục tiêu
 */
export const calculateTargetCalories = (
  stats: UserBodyStats,
  goal: DietGoal,
  bmiValue: number
): number => {
  const age = stats.age ?? 21;
  const gender = stats.gender ?? 'MALE';
  const activity = stats.activityMultiplier ?? 1.375;

  // Tính BMR (Basal Metabolic Rate)
  const genderOffset = gender === 'MALE' ? 5 : -161;
  const bmr = 10 * stats.weightKg + 6.25 * stats.heightCm - 5 * age + genderOffset;
  const tdee = Math.round(bmr * activity);

  // Điều chỉnh theo mục tiêu & mức độ BMI
  switch (goal) {
    case 'DEFICIT': {
      // Nếu béo phì độ 2-3 thì thâm hụt sâu hơn (-600 kcal), còn lại -450 kcal
      const deficitAmount = bmiValue >= 30 ? 600 : 450;
      return Math.max(1200, tdee - deficitAmount); // Không thấp hơn 1200 kcal để đảm bảo an toàn
    }
    case 'MUSCLE_GAIN':
      return tdee + 250; // Thặng dư nhẹ để tăng cơ hạn chế tích mỡ
    case 'WEIGHT_GAIN':
      return tdee + 500; // Thặng dư cao cho người thiếu cân
    case 'MAINTENANCE':
    default:
      return tdee;
  }
};

/**
 * 3. Tự động quy đổi số gram (g) nguyên liệu và Calo của từng món ăn theo Calo mục tiêu
 */
export const scaleMealsToTargetCalories = (
  meals: MealItem[],
  targetDailyCalories: number
): MealItem[] => {
  const totalBaseCalories = meals.reduce((sum, m) => sum + m.baseCalories, 0);
  if (totalBaseCalories === 0) return meals;

  const scaleFactor = targetDailyCalories / totalBaseCalories;

  return meals.map((meal) => {
    const scaledIngredients = meal.ingredients.map((ing) => ({
      ...ing,
      // Làm tròn số gram đến bội số của 5g cho dễ cân đong khi nấu
      grams: Math.max(5, Math.round((ing.grams * scaleFactor) / 5) * 5),
    }));

    const scaledCalories = Math.round(meal.baseCalories * scaleFactor);

    return {
      ...meal,
      baseCalories: scaledCalories,
      macros: {
        protein: Math.round(meal.macros.protein * scaleFactor),
        carbs: Math.round(meal.macros.carbs * scaleFactor),
        fat: Math.round(meal.macros.fat * scaleFactor),
      },
      ingredients: scaledIngredients,
    };
  });
};