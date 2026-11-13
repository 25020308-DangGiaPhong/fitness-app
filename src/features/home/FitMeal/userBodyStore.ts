import { useState, useEffect } from 'react';
import { UserBodyStats } from './fitmeal.types';

// Giá trị khởi tạo mặc định
let currentStats: UserBodyStats = {
  weightKg: 70,
  heightCm: 172,
  age: 21,
  gender: 'MALE',
};

type Listener = (stats: UserBodyStats) => void;
const listeners = new Set<Listener>();

/**
 * Gọi hàm này ở màn hình Profile (khi bấm Lưu) hoặc ở FitMeal
 * để đồng bộ Cân nặng & Chiều cao trên toàn bộ ứng dụng
 */
export const updateUserBodyStats = (newStats: Partial<UserBodyStats>) => {
  currentStats = {
    ...currentStats,
    ...newStats,
  };
  listeners.forEach((listener) => listener(currentStats));
};

/**
 * Hook tự động lắng nghe sự thay đổi Cân nặng & Chiều cao thời gian thực
 */
export const useUserBodyStats = () => {
  const [stats, setStats] = useState<UserBodyStats>(currentStats);

  useEffect(() => {
    const listener: Listener = (updated) => setStats({ ...updated });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return {
    userStats: stats,
    updateUserBodyStats,
  };
};