# Quy tắc cộng tác

## Phạm vi và nguồn sự thật

- Project root: `/Users/minh/Projects/fitness-app`. Đây là ứng dụng React Native + Expo + TypeScript mới hoàn toàn.
- Đọc `docs/phase-0-plan.md`, `docs/decisions.md`, `docs/progress.md` trước khi làm việc. Đề xuất chưa được duyệt không phải quyết định đã chốt.
- Người dùng đã duyệt kế hoạch Giai đoạn 0. Phạm vi lượt triển khai hiện tại: foundation Expo + TypeScript, navigation Train/Progress, app shell, review và hướng dẫn chạy; chưa triển khai toàn bộ session/persistence, backend hoặc pose.
- Bối cảnh mới nhất: hackathon demo 08/11/2026, chưa phát hành; UI English, neutral/coral; iPhone13 iOS18.6, team có Android chưa rõ model; Expo account có, Apple Developer trả phí không có. Demo local 1A đã được duyệt; không coi roadmap production là scope ngày mai.
- Giữ nguyên `.codex/agents/`; không thay đổi cấu hình global hoặc cài hệ sinh thái skill/cố vấn. Không ghi bối cảnh dự án vào `~/.claude/`.

## Karpathy Guidelines — mọi giai đoạn

Đọc skill thực tế `/Users/minh/.agents/skills/karpathy-guidelines/SKILL.md` khi bắt đầu áp dụng.

1. Think Before Coding: nêu giả định, phạm vi ảnh hưởng, quyết định còn thiếu và cách kiểm chứng trước mỗi thay đổi.
2. Simplicity First: chọn giải pháp nhỏ nhất đáp ứng yêu cầu; không tạo service, framework, abstraction hoặc module rỗng để dự phòng.
3. Surgical Changes: chỉ đổi file liên quan, giữ thay đổi của người dùng; không dọn code ngoài phạm vi.
4. Goal-Driven Execution: định nghĩa tiêu chí xong, chạy kiểm tra phù hợp, báo kết quả thật và phần chưa kiểm chứng.

Sau khi phạm vi được duyệt, chủ động hoàn tất trong phạm vi đó; chỉ hỏi lại quyết định lớn hoặc dữ liệu bắt buộc. Không tự nhận đã kiểm tra điện thoại, camera, backend hoặc dịch vụ nếu chỉ đọc tài liệu/mock/simulator.

## Agents và token

- Mặc định agent chính làm việc. Chỉ mở subagent khi người dùng yêu cầu rõ trong **tin nhắn hiện tại**; việc liệt kê vai trò hoặc gọi Chief of Staff không cấp quyền.
- Mỗi subagent có nhiệm vụ hẹp, đầu ra, tiêu chí hoàn thành và context tối thiểu. Không tổ chức nhiều agent cho việc đơn giản.
- Ngoại lệ chỉ cho lượt khảo sát 2026-11-07: tối đa hai agent theo thứ tự AI Engineer phân tích pose → agent chính soạn đề xuất → Code Reviewer đọc đề xuất. Cả hai chỉ phân tích, không sửa mã/file, không mở agent con.
- Lượt foundation kế tiếp cùng ngày: người dùng yêu cầu Mobile App Builder khởi tạo/sửa mã trong phạm vi app shell, sau đó Code Reviewer chỉ đọc thay đổi; agent chính xử lý findings và kiểm chứng. Không mở agent con hoặc tái sử dụng quyền này ở lượt khác.
- Lượt sau cần yêu cầu rõ mới; không tái sử dụng ngoại lệ này làm quyền thường trực.

## Skills

- `chief-of-staff`: hỗ trợ ưu tiên/tổng hợp; dùng bối cảnh và quyết định trong `docs/`. Các phụ thuộc thiếu được ghi tại `docs/environment.md`; không tự cài.
- `ui-ux-pro-max` cho UX/design system; `impeccable` cho phản biện/tinh chỉnh. Tên skill là **impeccable**, thư mục là `impeccable2`.
- `apple-design` và `design-system`: chỉ đọc sâu khi có nhu cầu cụ thể. Một design system thống nhất; ưu tiên yêu cầu người dùng, React Native và quyết định đã duyệt khi skill mâu thuẫn.
- Mọi gợi ý web/hover/CSS phải được đánh giá lại cho native touch. Kiểm tra license và phiên bản trước khi lấy code bên ngoài.

## Kiến trúc và bất biến

- Modular monolith; mỗi domain có chủ dữ liệu duy nhất. Theo bản đồ trong `docs/architecture.md`; chỉ tạo module khi cần cho lát cắt hiện tại.
- Routes chỉ điều hướng/ghép screen. Domain xuất `index.ts`/hợp đồng công khai; không deep import implementation domain khác. UI không truy cập DB/provider trực tiếp.
- TypeScript strict; validation tại API, storage, provider, evidence và migration boundaries. Không dùng type assertion thay validation.
- Shared chỉ chứa UI tokens/primitives hoặc utility thực sự dùng chung, không chứa nghiệp vụ XP/phiên tập.
- Migrations được version hóa; không sửa migration đã áp dụng. Kiểm tra quyền backend; không xem feature flag/UI là biện pháp phân quyền.
- Server quyết định verification, XP và điểm thi đấu. Client không ghi ledger, eligibility, kết quả đã duyệt hoặc leaderboard. Điểm cá nhân khác điểm thi đấu.
- Retry/đồng thời phải dựa trên transaction và unique business key, không chỉ idempotency key từ client. Ledger append-only; điều chỉnh/thu hồi có nguồn gốc.
- Camera là tùy chọn; raw video không lưu/upload mặc định. Pose confidence không đồng nghĩa chống gian lận hoặc an toàn y khoa.
- AI key chỉ ở server; output phải tham chiếu bài tập có thật, được kiểm tra phù hợp. Nội dung đau/chấn thương phải qua chuyên gia trước phát hành.

## Kiểm chứng và bàn giao

- Cập nhật tài liệu cùng thay đổi: scope, contract/data owner, quyết định, checklist, README setup và giới hạn.
- Chạy lint, typecheck và test phù hợp sau khi có code; ưu tiên state machine, RLS, idempotency, race, retry, AI failure và luồng E2E.
- Lưu model/OS, phiên bản dependency/build, phương pháp đo, kết quả và giới hạn khi test thiết bị thật. Không suy rộng một điện thoại thành hỗ trợ mọi thiết bị.
- Không commit secret, token, raw video hay thông tin sức khỏe vào Git/log. `.env.example` chỉ chứa tên biến và placeholder.
