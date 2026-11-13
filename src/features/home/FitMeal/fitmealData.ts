import { DailyMealPlan, DietGoal } from './fitmeal.types';

export const GOAL_LABELS: Record<DietGoal, { title: string; subtitle: string }> = {
  DEFICIT: { title: 'Giảm cân', subtitle: 'Thâm hụt Calo' },
  MUSCLE_GAIN: { title: 'Tăng cơ', subtitle: 'Giàu Protein' },
  WEIGHT_GAIN: { title: 'Tăng cân', subtitle: 'Thặng dư Calo' },
  MAINTENANCE: { title: 'Giữ dáng', subtitle: 'Cân bằng' },
};

export const WEEKLY_MEAL_PLANS: DailyMealPlan[] = [
  // ==================== THỨ 2 ====================
  {
    dayLabel: 'Thứ 2',
    meals: [
      {
        id: 'mon-b',
        mealType: 'Bữa Sáng',
        title: 'Yến mạch sữa chua Hy Lạp & Trứng luộc',
        imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=800&q=80',
        baseCalories: 420,
        macros: { protein: 28, carbs: 45, fat: 12 },
        ingredients: [
          { name: 'Yến mạch cán dẹt', grams: 50, caloriesPer100g: 389 },
          { name: 'Sữa chua Hy Lạp không đường', grams: 100, caloriesPer100g: 97 },
          { name: 'Trứng gà ta (2 quả)', grams: 100, caloriesPer100g: 155 },
          { name: 'Chuối chín', grams: 80, caloriesPer100g: 89 },
        ],
        cookingSteps: [
          'Ngâm yến mạch với một chút nước ấm trong 3 phút cho mềm rồi trộn đều cùng sữa chua Hy Lạp.',
          'Luộc trứng gà trong 7-8 phút để lòng đỏ vừa chín tới, bóc vỏ cắt đôi.',
          'Thái lát chuối xếp lên mặt bát yến mạch và thưởng thức cùng trứng luộc.',
        ],
      },
      {
        id: 'mon-l',
        mealType: 'Bữa Trưa',
        title: 'Ức gà áp chảo thảo mộc & Khoai lang mật',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        baseCalories: 580,
        macros: { protein: 48, carbs: 62, fat: 14 },
        ingredients: [
          { name: 'Ức gà phi lê (sống)', grams: 180, caloriesPer100g: 165 },
          { name: 'Khoai lang mật', grams: 200, caloriesPer100g: 86 },
          { name: 'Bông cải xanh (Súp lơ)', grams: 150, caloriesPer100g: 34 },
          { name: 'Dầu ô liu', grams: 5, caloriesPer100g: 884 },
        ],
        cookingSteps: [
          'Ướp ức gà với chút muối hồng, tiêu đen và lá hương thảo (rosemary) trong 10 phút.',
          'Luộc hoặc hấp chín khoai lang và bông cải xanh trong 10-12 phút.',
          'Làm nóng chảo với dầu ô liu, áp chảo ức gà mỗi mặt 4-5 phút ở lửa vừa cho vàng đều, cắt miếng vừa ăn.',
        ],
      },
      {
        id: 'mon-s',
        mealType: 'Bữa Phụ',
        title: 'Sinh tố Bơ Đậu Phộng & Whey/Sữa hạt',
        imageUrl: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
        baseCalories: 280,
        macros: { protein: 22, carbs: 20, fat: 11 },
        ingredients: [
          { name: 'Sữa tươi không đường / Sữa hạnh nhân', grams: 200, caloriesPer100g: 42 },
          { name: 'Bơ đậu phộng nguyên chất', grams: 20, caloriesPer100g: 588 },
          { name: 'Bột Whey Protein (hoặc đậu hũ non)', grams: 30, caloriesPer100g: 370 },
        ],
        cookingSteps: [
          'Cho sữa, bơ đậu phộng và bột đạm vào máy xay cùng 4-5 viên đá nhỏ.',
          'Xay nhuyễn trong 30 giây và dùng trước buổi tập 45-60 phút.',
        ],
      },
      {
        id: 'mon-d',
        mealType: 'Bữa Tối',
        title: 'Cá hồi áp chảo măng tây & Cơm gạo lứt',
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
        baseCalories: 540,
        macros: { protein: 38, carbs: 45, fat: 20 },
        ingredients: [
          { name: 'Phi lê cá hồi tươi', grams: 140, caloriesPer100g: 208 },
          { name: 'Cơm gạo lứt chín', grams: 130, caloriesPer100g: 111 },
          { name: 'Măng tây xanh', grams: 120, caloriesPer100g: 20 },
        ],
        cookingSteps: [
          'Thấm khô miếng cá hồi, rắc nhẹ muối tiêu lên 2 mặt.',
          'Áp chảo cá hồi không cần dầu (tận dụng mỡ cá tự nhiên) mỗi mặt 3 phút.',
          'Cho măng tây vào đảo nhanh trên chảo mỡ cá 2 phút, dọn ra đĩa ăn kèm cơm gạo lứt.',
        ],
      },
    ],
  },

  // ==================== THỨ 3 ====================
  {
    dayLabel: 'Thứ 3',
    meals: [
      {
        id: 'tue-b',
        mealType: 'Bữa Sáng',
        title: 'Bánh mì nguyên cám Bơ & Trứng ốp la',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
        baseCalories: 410,
        macros: { protein: 20, carbs: 38, fat: 18 },
        ingredients: [
          { name: 'Bánh mì đen nguyên cám (2 lát)', grams: 70, caloriesPer100g: 250 },
          { name: 'Quả bơ sáp chín', grams: 60, caloriesPer100g: 160 },
          { name: 'Trứng gà (2 quả)', grams: 100, caloriesPer100g: 155 },
        ],
        cookingSteps: [
          'Nướng giòn 2 lát bánh mì nguyên cám trên chảo khô.',
          'Dằm nhuyễn bơ sáp với một chút muối tiêu rồi phết đều lên bánh mì.',
          'Ốp la 2 quả trứng trên chảo chống dính và đặt lên mặt bánh.',
        ],
      },
      {
        id: 'tue-l',
        mealType: 'Bữa Trưa',
        title: 'Bò lúc lắc ớt chuông & Cơm gạo lứt',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        baseCalories: 610,
        macros: { protein: 46, carbs: 65, fat: 16 },
        ingredients: [
          { name: 'Thăn bò nạc (cắt vuông)', grams: 170, caloriesPer100g: 185 },
          { name: 'Cơm gạo lứt chín', grams: 160, caloriesPer100g: 111 },
          { name: 'Ớt chuông & Hành tây', grams: 150, caloriesPer100g: 31 },
          { name: 'Dầu ô liu & Dầu hào', grams: 10, caloriesPer100g: 450 },
        ],
        cookingSteps: [
          'Ướp thịt bò với tỏi băm, 1 thìa cà phê dầu hào trong 10 phút.',
          'Xào nhanh ớt chuông và hành tây ở lửa lớn trong 2 phút cho chín tái giòn.',
          'Trút thịt bò vào đảo đều trên lửa lớn 2-3 phút để bò mềm mọng nước, ăn cùng cơm gạo lứt.',
        ],
      },
      {
        id: 'tue-s',
        mealType: 'Bữa Phụ',
        title: 'Táo tươi & Hạnh nhân rang mộc',
        imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80',
        baseCalories: 230,
        macros: { protein: 6, carbs: 24, fat: 13 },
        ingredients: [
          { name: 'Táo tươi', grams: 150, caloriesPer100g: 52 },
          { name: 'Hạt hạnh nhân rang mộc', grams: 25, caloriesPer100g: 579 },
        ],
        cookingSteps: [
          'Rửa sạch táo với nước muối loãng, cắt múi cau giữ nguyên vỏ.',
          'Dùng trực tiếp kèm hạt hạnh nhân vào khoảng 15h-16h chiều.',
        ],
      },
      {
        id: 'tue-d',
        mealType: 'Bữa Tối',
        title: 'Salad Tôm hấp & Đậu hũ non',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        baseCalories: 450,
        macros: { protein: 42, carbs: 35, fat: 12 },
        ingredients: [
          { name: 'Tôm sú bóc vỏ', grams: 160, caloriesPer100g: 99 },
          { name: 'Đậu hũ non', grams: 150, caloriesPer100g: 76 },
          { name: 'Bắp ngọt (Ngô ngọt) luộc', grams: 100, caloriesPer100g: 86 },
          { name: 'Rau xà lách, cà chua bi & Sốt mè rang', grams: 180, caloriesPer100g: 45 },
        ],
        cookingSteps: [
          'Hấp chín tôm với chút sả hoặc gừng trong 4 phút để giữ vị ngọt.',
          'Cắt khối đậu hũ non, xếp cùng rau xà lách, cà chua bi, bắp ngọt và tôm lên tô.',
          'Rưới nhẹ sốt mè rang rồi trộn đều trước khi ăn.',
        ],
      },
    ],
  },

  // ==================== THỨ 4 ====================
  {
    dayLabel: 'Thứ 4',
    meals: [
      {
        id: 'wed-b',
        mealType: 'Bữa Sáng',
        title: 'Khoai lang mật hấp & Trứng bác cà chua',
        imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
        baseCalories: 390,
        macros: { protein: 22, carbs: 46, fat: 12 },
        ingredients: [
          { name: 'Khoai lang mật', grams: 180, caloriesPer100g: 86 },
          { name: 'Trứng gà (2 quả)', grams: 100, caloriesPer100g: 155 },
          { name: 'Cà chua chín', grams: 100, caloriesPer100g: 18 },
          { name: 'Ức gà xông khói thái hạt lựu', grams: 40, caloriesPer100g: 140 },
        ],
        cookingSteps: [
          'Luộc hoặc hấp chín khoai lang mật trong 12 phút.',
          'Xào mềm cà chua cắt nhỏ với ức gà xông khói, sau đó đập 2 quả trứng vào đảo đều tay trên lửa nhỏ cho trứng chín mềm.',
        ],
      },
      {
        id: 'wed-l',
        mealType: 'Bữa Trưa',
        title: 'Bún gạo lứt trộn Ức gà xé & Rau củ',
        imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
        baseCalories: 560,
        macros: { protein: 45, carbs: 64, fat: 11 },
        ingredients: [
          { name: 'Bún gạo lứt khô', grams: 80, caloriesPer100g: 350 },
          { name: 'Ức gà phi lê luộc xé', grams: 170, caloriesPer100g: 165 },
          { name: 'Dưa leo, cà rốt & giá đỗ', grams: 160, caloriesPer100g: 25 },
          { name: 'Nước tương giảm muối & tỏi ớt', grams: 20, caloriesPer100g: 53 },
        ],
        cookingSteps: [
          'Trụng bún gạo lứt trong nước sôi 4-5 phút rồi xả qua nước lạnh cho sợi bún dai.',
          'Luộc chín ức gà cùng vài lát gừng, vớt ra xé phay.',
          'Xếp bún, gà xé, dưa leo thái sợi vào tô và rưới nước tương tỏi ớt trộn đều.',
        ],
      },
      {
        id: 'wed-s',
        mealType: 'Bữa Phụ',
        title: 'Sữa chua Hy Lạp trộn Hạt điều & Việt quất',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
        baseCalories: 250,
        macros: { protein: 14, carbs: 22, fat: 11 },
        ingredients: [
          { name: 'Sữa chua Hy Lạp', grams: 120, caloriesPer100g: 97 },
          { name: 'Hạt điều rang mộc', grams: 20, caloriesPer100g: 553 },
          { name: 'Quả việt quất (hoặc dâu tây)', grams: 60, caloriesPer100g: 57 },
        ],
        cookingSteps: [
          'Cho sữa chua Hy Lạp ra bát, rắc hạt điều và quả mọng lên trên.',
          'Trộn đều và ăn mát trước giờ tập luyện.',
        ],
      },
      {
        id: 'wed-d',
        mealType: 'Bữa Tối',
        title: 'Cá diêu hồng/Cá basa áp chảo & Rau củ luộc',
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        baseCalories: 490,
        macros: { protein: 40, carbs: 42, fat: 15 },
        ingredients: [
          { name: 'Phi lê cá basa / diêu hồng', grams: 180, caloriesPer100g: 135 },
          { name: 'Cơm gạo lứt chín', grams: 130, caloriesPer100g: 111 },
          { name: 'Đậu cô ve & Cà rốt luộc', grams: 160, caloriesPer100g: 35 },
          { name: 'Dầu ô liu', grams: 5, caloriesPer100g: 884 },
        ],
        cookingSteps: [
          'Ướp phi lê cá với chút muối, tiêu và bột nghệ trong 10 phút.',
          'Áp chảo cá với dầu ô liu mỗi mặt 4 phút cho vàng giòn.',
          'Luộc chín đậu cô ve, cà rốt và dùng kèm cơm gạo lứt.',
        ],
      },
    ],
  },

  // ==================== THỨ 5 ====================
  {
    dayLabel: 'Thứ 5',
    meals: [
      {
        id: 'thu-b',
        mealType: 'Bữa Sáng',
        title: 'Phở bò thăn nạc ít bánh (Healthy Pho)',
        imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
        baseCalories: 440,
        macros: { protein: 32, carbs: 50, fat: 11 },
        ingredients: [
          { name: 'Bánh phở tươi', grams: 120, caloriesPer100g: 140 },
          { name: 'Thăn bò nạc thái mỏng', grams: 120, caloriesPer100g: 185 },
          { name: 'Giá đỗ, hành lá & rau thơm', grams: 100, caloriesPer100g: 25 },
        ],
        cookingSteps: [
          'Chần bánh phở và giá đỗ qua nước sôi rồi cho vào tô.',
          'Xếp thịt thăn bò nạc lên trên, chan nước dùng trong (hớt bỏ váng mỡ) đang sôi để làm chín tái thịt bò.',
        ],
      },
      {
        id: 'thu-l',
        mealType: 'Bữa Trưa',
        title: 'Ức gà xào nấm đùi gà & Cơm gạo lứt',
        imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        baseCalories: 570,
        macros: { protein: 47, carbs: 62, fat: 12 },
        ingredients: [
          { name: 'Ức gà thái miếng', grams: 180, caloriesPer100g: 165 },
          { name: 'Nấm đùi gà thái lát', grams: 150, caloriesPer100g: 35 },
          { name: 'Cơm gạo lứt chín', grams: 160, caloriesPer100g: 111 },
          { name: 'Dầu ô liu & dầu hào', grams: 10, caloriesPer100g: 450 },
        ],
        cookingSteps: [
          'Phi thơm tỏi với dầu ô liu, cho ức gà vào đảo săn.',
          'Cho nấm đùi gà và 1 thìa dầu hào vào xào chung 4-5 phút cho nấm chín ngọt, rắc hành lá tiêu đen.',
          'Dọn ra đĩa ăn nóng cùng cơm gạo lứt.',
        ],
      },
      {
        id: 'thu-s',
        mealType: 'Bữa Phụ',
        title: 'Trứng gà luộc & Chuối chín',
        imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80',
        baseCalories: 240,
        macros: { protein: 14, carbs: 27, fat: 9 },
        ingredients: [
          { name: 'Trứng gà luộc (2 quả)', grams: 100, caloriesPer100g: 155 },
          { name: 'Chuối tiêu chín (1 quả)', grams: 110, caloriesPer100g: 89 },
        ],
        cookingSteps: [
          'Luộc chín trứng gà trong 8 phút, bóc vỏ.',
          'Ăn kèm 1 quả chuối chín trước buổi tập 45 phút để nạp nhanh năng lượng.',
        ],
      },
      {
        id: 'thu-d',
        mealType: 'Bữa Tối',
        title: 'Thăn heo áp chảo & Bí ngòi nướng',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        baseCalories: 500,
        macros: { protein: 42, carbs: 40, fat: 16 },
        ingredients: [
          { name: 'Thăn heo nạc (không mỡ)', grams: 170, caloriesPer100g: 143 },
          { name: 'Khoai lang luộc', grams: 150, caloriesPer100g: 86 },
          { name: 'Bí ngòi xanh cắt khoanh', grams: 160, caloriesPer100g: 17 },
        ],
        cookingSteps: [
          'Ướp thăn heo với muối tiêu, bột tỏi trong 10 phút.',
          'Áp chảo thăn heo và bí ngòi trên chảo chống dính mỗi mặt 4 phút cho chín vàng.',
          'Dùng kèm khoai lang luộc.',
        ],
      },
    ],
  },

  // ==================== THỨ 6 ====================
  {
    dayLabel: 'Thứ 6',
    meals: [
      {
        id: 'fri-b',
        mealType: 'Bữa Sáng',
        title: 'Pancake Yến mạch Chuối Trứng',
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
        baseCalories: 430,
        macros: { protein: 24, carbs: 52, fat: 13 },
        ingredients: [
          { name: 'Bột yến mạch', grams: 60, caloriesPer100g: 389 },
          { name: 'Trứng gà (2 quả)', grams: 100, caloriesPer100g: 155 },
          { name: 'Chuối chín dằm nhuyễn', grams: 100, caloriesPer100g: 89 },
        ],
        cookingSteps: [
          'Trộn đều bột yến mạch, 2 quả trứng và chuối dằm nhuyễn thành hỗn hợp sánh mịn.',
          'Múc từng muỗng đổ lên chảo chống dính ở lửa nhỏ, rán mỗi mặt 2 phút cho chín vàng thơm.',
        ],
      },
      {
        id: 'fri-l',
        mealType: 'Bữa Trưa',
        title: 'Tôm rim tỏi ớt ít dầu & Cơm gạo lứt',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
        baseCalories: 550,
        macros: { protein: 44, carbs: 64, fat: 11 },
        ingredients: [
          { name: 'Tôm tươi bóc vỏ', grams: 200, caloriesPer100g: 99 },
          { name: 'Cơm gạo lứt chín', grams: 170, caloriesPer100g: 111 },
          { name: 'Bông cải trắng luộc', grams: 160, caloriesPer100g: 25 },
          { name: 'Dầu ô liu & Nước mắm', grams: 10, caloriesPer100g: 400 },
        ],
        cookingSteps: [
          'Phi thơm tỏi ớt với chút dầu ô liu, cho tôm vào đảo săn đều.',
          'Nêm 1 thìa nước mắm, đảo lửa vừa 3 phút cho tôm thấm vị.',
          'Ăn kèm cơm gạo lứt và bông cải trắng luộc.',
        ],
      },
      {
        id: 'fri-s',
        mealType: 'Bữa Phụ',
        title: 'Sữa đậu nành không đường & Hạt óc chó',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        baseCalories: 260,
        macros: { protein: 14, carbs: 14, fat: 16 },
        ingredients: [
          { name: 'Sữa đậu nành không đường', grams: 250, caloriesPer100g: 54 },
          { name: 'Nhân hạt óc chó', grams: 20, caloriesPer100g: 654 },
        ],
        cookingSteps: [
          'Uống sữa đậu nành mát kết hợp nhâm nhi hạt óc chó để bổ sung Omega-3 và đạm thực vật.',
        ],
      },
      {
        id: 'fri-d',
        mealType: 'Bữa Tối',
        title: 'Ức gà cuộn rong biển áp chảo & Salad',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        baseCalories: 480,
        macros: { protein: 46, carbs: 38, fat: 13 },
        ingredients: [
          { name: 'Ức gà xay nhuyễn', grams: 180, caloriesPer100g: 165 },
          { name: 'Lá rong biển khô', grams: 10, caloriesPer100g: 300 },
          { name: 'Khoai lang hấp', grams: 130, caloriesPer100g: 86 },
          { name: 'Rau xà lách & Dưa leo', grams: 150, caloriesPer100g: 16 },
        ],
        cookingSteps: [
          'Trộn ức gà xay với tiêu, hành băm rồi cuộn vào lá rong biển.',
          'Áp chảo cuộn gà rong biển trong 6-7 phút cho chín đều bên trong.',
          'Cắt khoanh vừa ăn, dùng kèm khoai lang và salad rau tươi.',
        ],
      },
    ],
  },

  // ==================== THỨ 7 ====================
  {
    dayLabel: 'Thứ 7',
    meals: [
      {
        id: 'sat-b',
        mealType: 'Bữa Sáng',
        title: 'Bánh mì đen kẹp Ức gà & Phô mai lát',
        imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
        baseCalories: 430,
        macros: { protein: 34, carbs: 42, fat: 13 },
        ingredients: [
          { name: 'Bánh mì nguyên cám (2 lát)', grams: 75, caloriesPer100g: 250 },
          { name: 'Ức gà áp chảo thái lát', grams: 100, caloriesPer100g: 165 },
          { name: 'Phô mai lát ít béo (Low-fat cheese)', grams: 25, caloriesPer100g: 250 },
          { name: 'Xà lách & Cà chua thái lát', grams: 80, caloriesPer100g: 18 },
        ],
        cookingSteps: [
          'Áp chảo nóng 2 lát bánh mì nguyên cám.',
          'Lần lượt xếp xà lách, cà chua, ức gà thái lát và phô mai vào giữa 2 lát bánh mì, cắt chéo và thưởng thức.',
        ],
      },
      {
        id: 'sat-l',
        mealType: 'Bữa Trưa',
        title: 'Bò bít tết áp chảo & Khoai tây nghiền',
        imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80',
        baseCalories: 600,
        macros: { protein: 46, carbs: 54, fat: 20 },
        ingredients: [
          { name: 'Thăn nội bò (Beef Tenderloin)', grams: 180, caloriesPer100g: 190 },
          { name: 'Khoai tây hấp nghiền', grams: 200, caloriesPer100g: 87 },
          { name: 'Măng tây & Cà chua bi', grams: 140, caloriesPer100g: 20 },
        ],
        cookingSteps: [
          'Ướp thăn bò với muối biển và tiêu đen 5 phút.',
          'Áp chảo bò trên lửa lớn mỗi mặt 2.5 - 3 phút để đạt độ chín Medium vừa mềm ngọt.',
          'Hấp chín khoai tây, dằm nhuyễn với chút sữa tươi không đường và ăn kèm bò, măng tây.',
        ],
      },
      {
        id: 'sat-s',
        mealType: 'Bữa Phụ',
        title: 'Khoai lang luộc & Sữa hạt hạnh nhân',
        imageUrl: 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=800&q=80',
        baseCalories: 240,
        macros: { protein: 8, carbs: 40, fat: 5 },
        ingredients: [
          { name: 'Khoai lang luộc', grams: 160, caloriesPer100g: 86 },
          { name: 'Sữa hạt hạnh nhân không đường', grams: 220, caloriesPer100g: 40 },
        ],
        cookingSteps: [
          'Dùng khoai lang luộc ấm cùng 1 cốc sữa hạt trước buổi tập chiều.',
        ],
      },
      {
        id: 'sat-d',
        mealType: 'Bữa Tối',
        title: 'Miến trộn Hải sản (Tôm & Mực ống)',
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
        baseCalories: 490,
        macros: { protein: 40, carbs: 56, fat: 10 },
        ingredients: [
          { name: 'Miến dong khô', grams: 65, caloriesPer100g: 332 },
          { name: 'Tôm sú & Mực ống tươi', grams: 190, caloriesPer100g: 95 },
          { name: 'Cải ngọt, cà rốt & hành tây', grams: 160, caloriesPer100g: 25 },
        ],
        cookingSteps: [
          'Trụng miến dong và rau cải ngọt qua nước sôi rồi để ráo.',
          'Hấp hoặc xào nhanh tôm và mực ống với gừng sả trong 3 phút.',
          'Trộn miến, hải sản và rau củ cùng 1 thìa xì dầu tỏi ớt.',
        ],
      },
    ],
  },

  // ==================== CHỦ NHẬT ====================
  {
    dayLabel: 'Chủ Nhật',
    meals: [
      {
        id: 'sun-b',
        mealType: 'Bữa Sáng',
        title: 'Trứng cuộn rau củ (Omelette) & Yến mạch',
        imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80',
        baseCalories: 420,
        macros: { protein: 26, carbs: 40, fat: 16 },
        ingredients: [
          { name: 'Trứng gà (3 quả: 2 nguyên quả + 1 lòng trắng)', grams: 140, caloriesPer100g: 145 },
          { name: 'Yến mạch nấu cháo loãng', grams: 45, caloriesPer100g: 389 },
          { name: 'Ớt chuông, nấm & hành lá băm nhỏ', grams: 80, caloriesPer100g: 28 },
        ],
        cookingSteps: [
          'Đánh tan trứng cùng ớt chuông, nấm và hành lá băm nhỏ, tráng mỏng và cuộn tròn trên chảo chống dính.',
          'Nấu chín yến mạch với nước sôi trong 3 phút, dùng nóng cùng trứng cuộn.',
        ],
      },
      {
        id: 'sun-l',
        mealType: 'Bữa Trưa',
        title: 'Đùi gà bỏ da nướng mật ong & Cơm gạo lứt',
        imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
        baseCalories: 590,
        macros: { protein: 45, carbs: 62, fat: 16 },
        ingredients: [
          { name: 'Thịt đùi gà lọc xương bỏ da', grams: 180, caloriesPer100g: 177 },
          { name: 'Cơm gạo lứt chín', grams: 160, caloriesPer100g: 111 },
          { name: 'Dưa leo & Cà chua', grams: 150, caloriesPer100g: 18 },
          { name: 'Mật ong & Nước tương', grams: 12, caloriesPer100g: 280 },
        ],
        cookingSteps: [
          'Ướp thịt đùi gà bỏ da với 1 thìa cà phê mật ong, nước tương, tỏi băm trong 15 phút.',
          'Nướng bằng nồi chiên không dầu ở 190°C trong 15 phút (hoặc áp chảo lửa vừa) cho mặt thịt xém vàng.',
          'Thái miếng vừa ăn, dùng kèm cơm gạo lứt và dưa leo.',
        ],
      },
      {
        id: 'sun-s',
        mealType: 'Bữa Phụ',
        title: 'Sữa chua không đường & Dâu tây/Quả mọng',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
        baseCalories: 220,
        macros: { protein: 12, carbs: 26, fat: 7 },
        ingredients: [
          { name: 'Sữa chua không đường', grams: 150, caloriesPer100g: 65 },
          { name: 'Dâu tây cắt lát', grams: 100, caloriesPer100g: 32 },
          { name: 'Hạt chia / Hạt điều', grams: 15, caloriesPer100g: 486 },
        ],
        cookingSteps: [
          'Trộn đều sữa chua không đường với dâu tây tươi và hạt chia, để lạnh 10 phút trước khi dùng.',
        ],
      },
      {
        id: 'sun-d',
        mealType: 'Bữa Tối',
        title: 'Canh Đậu hũ non Thịt bằm & Cá áp chảo',
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        baseCalories: 490,
        macros: { protein: 42, carbs: 40, fat: 16 },
        ingredients: [
          { name: 'Đậu hũ non', grams: 150, caloriesPer100g: 76 },
          { name: 'Thịt nạc thăn bằm & Cá phi lê', grams: 150, caloriesPer100g: 155 },
          { name: 'Cơm gạo lứt chín', grams: 120, caloriesPer100g: 111 },
          { name: 'Rau cải cúc / Cải xanh', grams: 150, caloriesPer100g: 20 },
        ],
        cookingSteps: [
          'Nấu sôi nước với thịt nạc bằm, thả đậu hũ non cắt khối và rau cải vào nấu chín trong 3 phút.',
          'Áp chảo miếng cá phi lê cho vàng đều 2 mặt, ăn kèm canh đậu hũ và cơm gạo lứt.',
        ],
      },
    ],
  },
];