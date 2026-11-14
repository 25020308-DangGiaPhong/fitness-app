# Nhật ký quyết định

## Gỡ camera AI — 2026-11-13

Người dùng yêu cầu gỡ toàn bộ tích hợp camera AI và quay lại cách chạy trước khi pull camera, giữ macOS hiện tại. Khôi phục code/config/dependency liên quan về `44bbe14`, loại route và native camera; giữ GIF và tính năng khác. Trở lại Expo Go trên iOS/Android. Tài liệu camera/pose cũ là lịch sử đề xuất, không mô tả tính năng hiện có. Không nâng hệ điều hành, không gỡ công cụ dùng chung hoặc xóa dữ liệu Expo Go.

Không coi đề xuất của agent là quyết định của người dùng. Context dự án chỉ lưu tại đây/docs, không dùng decision memory global của Chief of Staff.

## Đã xác nhận

| ID | Ngày | Quyết định/yêu cầu | Chủ / xem lại |
|---|---|---|---|
| D01 | 2026-11-07 | React Native + Expo + TS; modular monolith; bảo trì/ownership/validation | Agent chính / mỗi giai đoạn |
| D02 | 2026-11-07 | Lượt này khảo sát+tài liệu; tối đa AI Engineer rồi Code Reviewer, chỉ phân tích; lượt sau không tự gọi agent | Agent chính / mỗi tin nhắn |
| D03 | 2026-11-07 | UI tiếng Anh; nhóm chính 15–30, hỗ trợ người trung niên/cao tuổi | Người dùng / trước pilot |
| D04 | 2026-11-07 | Nền trung tính, coral, ấm và thân thiện | Người dùng / duyệt màn đại diện |
| D05 | 2026-11-07 | iOS+Android; iPhone13 iOS18.6; Expo account; không Apple Developer trả phí; Android chưa rõ model | Người dùng/team / trước device test |
| D06 | 2026-11-07 | Hackathon, demo 08/11/2026; chưa cần phát hành | Người dùng / scope demo |
| D07 | 2026-11-07 | Duyệt kế hoạch; lượt này triển khai foundation/app shell theo thứ tự Mobile App Builder → Code Reviewer → agent chính kiểm chứng | Agent chính / bàn giao shell |

## Phương án đã được duyệt và các cổng còn lại

Người dùng đã duyệt kế hoạch ở lượt foundation. P01/P02/P04 là hướng triển khai; milestone hiện tại chỉ gồm shell, không phải toàn bộ demo. P03/P05 được giữ làm hướng dài hạn, chưa tạo backend hoặc chốt rule/verification cụ thể.

| ID | Phương án | Đánh đổi / lúc chốt |
|---|---|---|
| P01 | Demo local Expo Go, Router/npm/AsyncStorage; 2 tab, core workout→progress | Đã duyệt hướng; shell trước, session/persistence ở lát cắt tiếp theo |
| P02 | Pose tách development spike sau core, không bắt buộc ngày mai | Đã duyệt hướng; không hứa camera live khi toolchain/signing chưa qua |
| P03 | Supabase cho GĐ2+ | Quan hệ/transaction thuận lợi, cần RLS và SQL review; chưa provision/mua dịch vụ |
| P04 | Coral/system type/set ticks và bốn màn đại diện | Đã duyệt hướng/layout; triển khai shell Train/Progress trước và kiểm tra render |
| P05 | T0/T1 không tự có điểm thi đấu, server ledger/eligibility theo board | Camera-assisted không được quảng bá anti-cheat; chốt policy sau spike |

## Tổng hợp Chief of Staff

Độ phức tạp 4/5: sản phẩm, native/AI, dữ liệu/phân quyền và deadline giao nhau. Không gọi board/cố vấn khác vì người dùng giới hạn hai agent, theo thứ tự. Phần context-engine/agent-protocol thiếu nên lấy brief đã xác nhận làm context và dùng nhật ký cục bộ.

Điểm thống nhất giữa yêu cầu và phân tích AI: camera phải tùy chọn; dữ liệu/client pose không tự chứng minh thi đấu; native stack cần test thật; mở rộng theo lát cắt. Mâu thuẫn cần người dùng quyết định là **bề rộng tính năng và deadline một ngày**, không phải bất đồng giả giữa hai agent. Đề nghị bảo vệ core workout demo; nếu AI/pose là tiêu chí hackathon bắt buộc, cần thay đổi scope.

Tối đa năm hành động tiếp theo: (1) người dùng duyệt scope trước bootstrap; (2) agent chính dựng smoke Expo Go trong 0–2 giờ sau duyệt; (3) agent chính hoàn tất local flow trong timebox kế tiếp; (4) người dùng/team test iPhone + cung cấp Android trước freeze; (5) agent chính chốt QA/rehearsal, ghi giới hạn trước demo. Các mốc là ước lượng, không background automation hay cam kết giờ cố định.

## Raw reasoning / thay đổi đề xuất

Ban đầu chưa biết deadline/đối tượng nên cân nhắc pilot dài hơn. Sau phản hồi đã chuyển UI English, người dùng 15–30+, coral. Sau phản hồi tiếp theo đã chuyển ưu tiên sang hackathon 08/11/2026, giữ backend/AI/verification là roadmap. Không giữ giả định cũ “tiếng Việt, chỉ 18+” như yêu cầu sản phẩm.

AI Engineer read-only xác nhận cần phân biệt rep/feedback/verification; protocol gốc 72 phiên được giữ làm gate mở rộng, chia thêm smoke/pilot nhỏ để phù hợp GĐ1. Đây là điều chỉnh của agent chính, không tuyên bố AI Engineer đã test hoặc đồng ý một kết quả chưa đo.

Code Reviewer đã đọc bản đề xuất sau khi soạn; ba findings được agent chính xử lý: snapshot local thống nhất, start/re-entry idempotent cho phiên hiện hành, tên bảng challenge tách theo owner. Chi tiết tại [review](review.md). Không có xác nhận code/test vì chưa triển khai.

## Kết quả foundation

Đã chọn SDK57.0.32/RN0.86.3/Router57.0.30 theo template và registry thực tế, Node24.22.2 trong .nvmrc. Cố định optional peer dependencies theo bộ SDK để tránh npm kéo phiên bản mới không tương thích. Milestone shell đã review và chạy native Simulator; workflow session/persistence còn ở lát cắt sau. Không thay đổi global Node/Xcode hoặc cấu hình agents.

## Sửa Expo Go mismatch trên iPhone

Ảnh người dùng xác nhận Expo Go SDK58 còn project SDK57. Nâng đồng bộ Expo và native dependency theo bundledNativeModules SDK58; giữ app shell và cấu hình agents. Nguồn sự thật compatibility là Expo Go thực tế trên máy; kiểm tra Simulator SDK57 trước đây không thay cho iPhone thật.

## Điều chỉnh ưu tiên — core trước (2026-11-07)

Người dùng đã cho phép chủ động triển khai demo, sau đó thu gọn ngay về vòng tập khép kín: chọn bài → phiên tập/hiệp/nghỉ/pause/resume → hoàn tất → kết quả → lịch sử và Progress local. Hoãn XP/leaderboard, sự kiện, Coach và camera. Giữ hai tab Train/Progress và module hiện có. Dùng expo-file-system tương thích SDK58 cho snapshot local thay vì thêm backend. Không đổi cấu hình agents/global.

## AI Coach preview — sửa sau review (2026-11-08)

Sau khi yêu cầu tài liệu tạo tab trước rồi mới tích hợp MedGemma, người dùng cung cấp mã tab và yêu cầu kiểm tra, sau đó yêu cầu sửa findings. Phạm vi sửa: khóa gửi/xác nhận/retry và bỏ callback cũ, dùng catalog/tokens thật, test hồi quy và cập nhật bàn giao. Ba tab Train/AI Coach/Progress; Coach chỉ dùng fixture trong RAM, không backend/model/thu dữ liệu sức khỏe thật. Chưa cấp quyền triển khai MedGemma, dịch vụ cloud hoặc mở tư vấn y tế.

## Mobility & Stretching Coach — demo nội bộ (2026-11-10)

Người dùng duyệt một luồng demo hackathon dành cho người lớn với Groq GPT-OSS 20B qua Expo API route. Coach chọn bài mobility trong Train, có thể hỏi thêm bằng nút chọn và dừng gợi ý khi người dùng báo đau, chấn thương hoặc chưa chắc. Giữ key trên dev server, dùng câu mẫu, giữ chat trong RAM. Body Map và phát hành nằm ngoài lượt này.

## Empathy Coach và lượng tập — 2026-11-13

Người dùng duyệt sửa hỏi lưng trên/dưới; thêm check-in chủ động trong chat, lời đáp đồng cảm và bài kèm lượng tập có thể chỉnh. Chat giữa hiệp có thể để sau. Lượt này dùng catalog hiện có, chưa cần thêm bài; lượng tập theo quy tắc demo nhẹ/thường/năng động, giới hạn1–5 hiệp,1–60 đơn vị theo catalog. Người dùng xem/sửa trên Train trước khi áp dụng. Cho chỉnh tay trong phiên và kết thúc sớm có xác nhận, không tự hoàn thành hiệp chưa tập. Không suy đoán chu kỳ, không chẩn đoán, không dùng hưng phấn làm chỉ định tập tối đa. Nhánh đau/chấn thương ưu tiên dừng.

## AI Coach: chat chỉnh lượng tập và bộ cuộn số — 2026-11-14

Theo yêu cầu người dùng: chọn cảm nhận chỉ hỏi vùng muốn tập; sau vùng hiển thị danh sách bài phù hợp. Chat chỉnh mục tiêu sets/amount cho cả danh sách hoặc bài được gọi tên. Mục tiêu trên thẻ và truyền sang Train dùng cùng giá trị; yêu cầu số cụ thể ưu tiên hơn mặc định theo cảm nhận.

Chạm các ô set, lượng mỗi hiệp và rest ở đầu màn Workout để mở wheel picker có Cancel/Done; bỏ bốn nút tăng/giảm cuối màn. Giữ giới hạn hiện có 1–5 sets, 1–60 mỗi hiệp; rest 0–180 giây, bước 5 giây. Coach giữ gợi ý trong RAM; workout-sessions tiếp tục sở hữu phiên đã Start. Không thêm multi-exercise session, chat giữa hiệp, dependency hoặc đánh giá thể lực từ hồ sơ.

## Resolve PR #4: AI Coach → FitMeal — 2026-11-14

Người dùng yêu cầu xử lý conflict giữa feature/ai-coach và feature/fitmeal-integration. Ghép nhánh FitMeal vào nhánh nguồn AI Coach để cập nhật PR, giữ nguyên tính năng FitMeal/Profile của nhánh đích và code Coach hiện tại. Chọn Expo exact58.0.25 từ nhánh FitMeal; giữ expo-dev-client mới thêm, scripts chỉ định --go để giữ đường Expo Go. Không khôi phục expo-camera/expo-mediapipe-pose vì camera AI đã được yêu cầu gỡ và FitMeal không import hai package này. Tái tạo lockfile bằng npm từ manifest đã resolve, không ghép thủ công version/integrity. Không đổi data owner hoặc tự merge PR vào nhánh đích.
