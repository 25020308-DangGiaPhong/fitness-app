# Tiến độ và hạn chế

Ngày 2026-11-07. Kế hoạch GĐ0 đã được duyệt. Lượt hiện tại triển khai foundation/app shell; toàn bộ luồng demo hackathon 08/11/2026 là lát cắt tiếp theo.

## Giai đoạn 0

- [x] Xác nhận root/repo trống; kiểm kê công cụ, skills và agents.
- [x] Đọc Karpathy/Chief of Staff; ghi thiếu dependency và fallback Impeccable.
- [x] AI Engineer phân tích read-only, protocol thiết bị và trust tiers.
- [x] Brief/flows, ownership/contracts, schema sơ bộ, stack/trade-off, design proposal, bootstrap và roadmap.
- [x] Hỏi gộp, cập nhật English/coral/độ tuổi/iPhone13/hackathon ngày mai.
- [x] Code Reviewer đọc proposal; agent chính xử lý ba findings, xem [review](review.md).
- [x] Kiểm tra local links, Markdown fences/whitespace, parse ba agent TOML và đối chiếu SHA-256 không đổi.
- [x] Người dùng duyệt scope 1A/stack/layout và yêu cầu Mobile App Builder → Code Reviewer → agent chính kiểm chứng.

## Foundation/app shell — hoàn tất milestone

- [x] Expo + TS strict + Expo Router/npm được pin theo registry thực tế; giữ `.codex/agents/` và tài liệu.
- [x] Hai tab Train/Progress, màn chi tiết bài mẫu, English/coral, routes mỏng và module public API.
- [x] Code Reviewer hoàn tất read-only sau retry usage; không thấy blocker. Agent chính review/kiểm chứng bổ sung; xem review.md.
- [x] Typecheck/lint, Expo config/dependency check, Metro và bundle iOS/Android.
- [x] README ghi lệnh chạy, native Simulator đã kiểm tra, giới hạn và việc tiếp theo.

Chỉ dựng shell ở lượt này: chưa tạo state machine phiên tập, persistence, backend, AI, camera hoặc XP. Không có nút Start giả cho workflow chưa triển khai.

## Trạng thái chạy/test

Đã có source app shell, dependencies và package-lock. Typecheck/lint PASS trên Node24.22.2; online Expo dependency check PASS; export bundle iOS/Android PASS. Metro mở app bằng Expo Go SDK57 trên iPhone17 Pro Simulator iOS26.2; Train→preview→Back→Progress→Explore Train hoạt động. Chưa test iPhone13 thật/Android runtime, font scale lớn nhất, VoiceOver/TalkBack đầy đủ, camera hoặc backend. Không có unit test session vì chưa triển khai nghiệp vụ phiên tập.

User xác nhận iPhone13/iOS18.6; chưa có Android model. Xcode26.2 thấp hơn yêu cầu của SDK đang xem; Java25 chưa validated; adb/Docker/Supabase/EAS CLI chưa có trong PATH. Không có Apple Developer trả phí; Expo account đã có. Expo Go là đường demo ưu tiên, vẫn cần smoke trên máy thật.

## Definition of done demo 1A (chưa bắt đầu)

- [ ] App mở trên iPhone13, English, Train/Progress; kiểm tra Android khi có máy và báo riêng kết quả.
- [ ] Start/pause/resume/complete/cancel đúng, manual sets/reps; app background/kill/reopen không mất phiên đã persist.
- [ ] Complete/retry không tạo hai history entry; write error không báo saved; reset demo rõ ràng.
- [ ] Double Start/Back→Start/reopen trả cùng active session ID; một snapshot nhất quán, Progress không có history store riêng.
- [ ] Fixture “Sample workout”, local history đúng từ phiên thực; không giả auth/AI/XP verified.
- [ ] Lint/typecheck/domain tests pass; font scaling/reduced motion/safe area/screen reader smoke; rehearsal 3–5 phút.

## Giới hạn phải mang sang lượt sau

Ngày mai không đủ để kiểm chứng toàn bộ tầm nhìn. Pose chưa qua integration; quyền sao chép Bencho chưa xác minh; AI sức khỏe chưa được chuyên gia duyệt; chưa có anti-cheat evidence. Hackathon không đồng nghĩa được trình bày mock như dữ liệu thật. Cổng người dùng chưa thành niên và phát hành vẫn là việc sau demo.

## Sửa mismatch Expo Go — SDK58

Người dùng thử iPhone thật và gửi lỗi Expo Go58/project57. Đã nâng Expo58.0.23, RN0.88.1, React19.3.0 và bộ native modules theo bundledNativeModules; React types19.3.x. Sửa tab icon dùng semantic color string theo focused để phù hợp kiểu RN mới. Dependency check, lint và typecheck PASS. Bundle iOS/Android được kiểm tra lại. Chưa xác nhận runtime SDK58 trên iPhone thật; kết quả Simulator trước đây thuộc SDK57.
