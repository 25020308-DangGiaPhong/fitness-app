# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Stack

React Native + Expo + TypeScript là yêu cầu người dùng. Backend, SDK chính xác và công cụ bổ sung đang chờ duyệt trong [kế hoạch](docs/phase-0-plan.md).

## Users

Nhóm chính 15–30 tuổi; người trung niên và cao tuổi cũng dùng được. UI tiếng Anh. Team test có cả iPhone và Android; chủ dự án dùng iPhone13/iOS18.6, có Expo account, không có Apple Developer trả phí. Android model/OS chưa rõ. Hackathon demo 08/11/2026, chưa cần phát hành; giờ demo chưa chốt.

## Product Purpose

Giúp chọn buổi tập, hoàn thành và theo dõi tiến bộ, sau đó mở rộng bằng AI Coach, camera tùy chọn, hoạt động cộng đồng và thi đấu có quy tắc minh bạch.

## Capabilities and Constraints

Luồng và phạm vi chi tiết nằm tại [product brief](docs/product-brief.md). Camera không bắt buộc; raw video không lưu/upload mặc định. Server quyết định điểm. Tách tự khai, camera hỗ trợ và đủ điều kiện thi đấu. Nội dung đau/chấn thương cần chuyên gia duyệt. Phát hành cho 15–17 tuổi cần cổng đánh giá privacy/AI/community riêng theo thị trường.

## Brand Commitments

Người dùng chọn nền trung tính, cam san hô, ấm và thân thiện. Mobile-first, năng động, đáng tin cậy. Bencho là nguồn tham khảo micro-interactions, chưa có quyền sao chép code được xác minh.

## Evidence on Hand

Đã có app shell Expo SDK57 và kiểm tra navigation trên iOS Simulator. Chưa có backend, phép đo camera hoặc kết quả thử điện thoại thật. Không tạo số liệu thành tích/người dùng giả như bằng chứng thật.

## Product Principles

- Tập thông thường vẫn hoàn chỉnh khi không dùng camera hoặc AI.
- Mỗi trạng thái dữ liệu có ý nghĩa rõ, không đánh đồng độ tin cậy pose với chống gian lận.
- Module sở hữu dữ liệu rõ ràng, mở rộng theo lát cắt kiểm chứng được.
- Động lực lành mạnh; không thưởng vô hạn cho tập quá sức.

## Accessibility & Inclusion

Font scaling, reduced motion, contrast, safe area, keyboard và screen reader; touch target phù hợp mỗi OS. Không dùng tuổi để tự suy ra khả năng vận động. Tránh chữ nhỏ, màu sắc đơn lẻ hoặc gesture bắt buộc.
