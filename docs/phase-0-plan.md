# Kế hoạch Giai đoạn 0 — đã duyệt

Người dùng đã duyệt ở lượt tiếp theo ngày 2026-11-07 và yêu cầu triển khai **foundation/app shell** trước. Phần dưới giữ bối cảnh đề xuất tại thời điểm khảo sát; trạng thái hiện tại xem [progress](progress.md) và [decisions](decisions.md). Chưa triển khai tất cả tính năng demo trong milestone shell.

Cập nhật 2026-11-07, Asia/Ho_Chi_Minh. **Ưu tiên mới: demo hackathon ngày mai 08/11/2026, chưa phát hành.** Không có ứng dụng được triển khai trong lượt này.

## Quyết định đề nghị

Duyệt một lát cắt demo chạy local bằng Expo Go: chọn buổi tập mẫu → tập/tạm dừng/tiếp tục → hoàn tất → xem lịch sử/tiến độ. UI tiếng Anh, nền trung tính/cam san hô, kiểm tra trước trên iPhone 13 iOS 18.6 và thêm một Android khi team cung cấp. Camera pose là spike riêng có timebox; không đặt backend, AI live hoặc verified XP trên đường bắt buộc của demo ngày mai.

Đây là đề xuất thu hẹp **demo**, không loại bỏ các tính năng trong tầm nhìn. Phạm vi GĐ2–6 và backend cần duyệt riêng sau hackathon. Người dùng đã chọn hướng màu, ngôn ngữ và nền tảng; chưa duyệt stack bổ sung hoặc phạm vi cắt giảm này.

## Điều đã biết và còn thiếu

- Đã biết: React Native + Expo + TS; iPhone 13/iOS18.6; Expo account; không có Apple Developer trả phí; team dùng cả iOS/Android; đối tượng chính 15–30 tuổi, hỗ trợ người lớn tuổi; UI English; demo ngày 08/11/2026.
- Chưa biết: giờ demo; model/OS Android và người cầm máy test; tên ứng dụng; ngân sách nếu bật dịch vụ; môn ưu tiên ngoài spike chống đẩy. Không chặn viết kế hoạch vì các điểm này.
- Giả định demo: adults trong team, dữ liệu tổng hợp/local; tập thể lực tại nhà; dùng tên tạm “Fitness App”; chưa công bố thương mại hoặc trả thưởng.
- Người dùng 15–17 vẫn nằm trong tầm nhìn. Vì hiện là hackathon, không thu dữ liệu thật nhóm này hoặc mở public community/AI sức khỏe trong demo; đánh giá phù hợp trước pilot thực tế.

## Stack và trade-off

| Phần | Đề xuất | Lý do / đánh đổi |
|---|---|---|
| App | Expo + TypeScript strict + Expo Router; React Native theo Expo SDK | Một app hai nền tảng, routes mỏng. Không tự nâng RN ngoài bộ Expo |
| SDK/toolchain | SDK stable được Expo Go thực tế trên iPhone hỗ trợ, pin exact version sau smoke test; SDK58 là ứng viên tài liệu hiện hành | Không nhầm “latest trên web” với “đã chạy”. Native pose phải qua build riêng |
| Package manager | npm + một package-lock; runtime Node LTS patch pin theo template | Ít công cụ, dễ tái tạo. Không đổi global tự động |
| UI/state | React Native primitives, tokens TypeScript, state local theo screen/use case; Expo Router | Không cần UI framework web, Redux hoặc state library trước nhu cầu thật |
| Local data demo | AsyncStorage qua repository sessions, schemaVersion + Zod; một snapshot chứa sessions/current session, một serialized command/write queue | Progress derive cùng snapshot, không lưu history riêng. Đủ demo; không hứa ACID hoặc dùng làm sổ điểm. SQLite xem lại khi offline queue phức tạp |
| Checks | Expo ESLint, tsc, Jest/jest-expo theo SDK cho state machine/persistence | Test hành vi quan trọng, không viết snapshot phủ mọi component |
| Backend sau demo | Supabase Postgres + Auth + Storage + Edge Functions; SQL command transactions | Quan hệ/ledger/capacity phù hợp Postgres; ít vận hành. Đổi lại phải làm RLS/SQL grants đúng và có phụ thuộc nền tảng |
| Auth sau demo | Email/password + verify/reset qua Supabase, SecureStore cho session theo adapter đã kiểm thử | Luồng rõ, ít provider; production cần SMTP/quota/deep links. Không giả login demo là tài khoản thật |
| AI sau demo | Một provider phía server, interface nhỏ, timeout/schema/policy | Có chi phí và latency theo usage; provider/model chưa chốt |
| Camera | VisionCamera V5 + MediaPipe Lite trong development build, sau gate tích hợp | Native integration có rủi ro; không chạy bằng Expo Go, xem protocol |
| Deployment | Demo Metro + Expo Go; dev build local hoặc EAS Android khi cần; backend dev/staging/prod sau này | Không deploy production, không mua gói, không cần App Store cho demo |

Expo hiện hướng dẫn template SDK58; matrix ghi RN0.88, iOS16.4+, Xcode26.4+, Node tối thiểu22.13.x. Host Xcode26.2 chưa đủ cho local native stack đó. Chốt SDK theo template stable/Expo Go hỗ trợ thực tế rồi lock, không dùng canary để cứu deadline. [Bootstrap Expo](https://docs.expo.dev/get-started/create-a-project/), [SDK matrix](https://docs.expo.dev/versions/latest/)

**Đường iPhone không trả phí:** Expo Go cho phần thuần Expo trước. Với native pose, tài khoản Apple miễn phí có thể dùng Xcode Personal Team để cài local lên thiết bị cá nhân, nhưng cần signing/provisioning, Developer Mode và toolchain tương thích. Không coi Expo account là Apple signing account. EAS cloud iOS device distribution/TestFlight không phải đường miễn phí thay thế Personal Team. Chưa test đường cài nào. [Apple account](https://developer.apple.com/help/account/basics/about-your-developer-account), [Expo free/paid Apple accounts](https://expo.dev/blog/apple-developer-program-explained-free-vs-paid)

**Backend alternatives:** Firebase có transactions, không phải “không làm được XP”; nhưng thiết kế đề xuất chọn Postgres để ownership, ledger, join/report và capacity constraints nằm cùng nền quan hệ. Node API + managed Postgres cho tự do runtime cao hơn nhưng thêm deploy/auth integration/on-call; chưa có nhu cầu đủ để chịu chi phí đó. Supabase Edge phù hợp I/O AI/thông báo, không chạy inference video dài hoặc job CPU nặng trong request. [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), [Edge limits](https://supabase.com/docs/guides/functions/limits)

Chi phí: demo đề xuất không dùng paid service, chưa có ngân sách được duyệt. Nếu sau này chọn Supabase: Free có quota và pause khi không hoạt động; Pro từ US$25/tháng, chưa gồm các khoản vượt mức/dịch vụ khác. Expo có free quota, không đồng nghĩa build không giới hạn. AI, SMTP, lưu trữ/egress và Apple membership tính riêng nếu cần. Giá kiểm tra 2026-11-07, cần xem lại trước mua. [Supabase pricing](https://supabase.com/pricing), [Expo pricing](https://expo.dev/pricing)

## Bootstrap an toàn sau khi duyệt

1. Ghi git status và hash `.codex/agents/`; không reset/xóa/ghi đè cấu hình. Repo chưa có commit nên không giả định Git khôi phục được file untracked.
2. Tạo Expo template trong thư mục staging tạm riêng bằng phiên bản generator đã kiểm tra; không chạy generator trực tiếp vào root không rỗng. Ghi version generator/template. Chỉ chuyển danh sách file ứng dụng cần thiết, không `.git`, `.codex`, docs hay AGENTS.md từ template. Nếu trùng file thì merge có chủ đích.
3. Đặt tên tạm, package manager/runtime, strict TS, lint/typecheck; `.gitignore` cho env/build/cache và `.env.example` không secret. Chỉ env thật cần dùng: demo local không cần key; sau backend mới thêm URL/publishable key, secret giữ server.
4. Cài bằng npm và Expo installer phù hợp SDK; lưu lockfile; chạy Expo doctor, lint, typecheck, test state/persistence; mở app trắng trên iPhone trước khi làm nhiều màn hình. Không tự nâng Xcode/JDK hoặc cài global để vượt lỗi.
5. Thêm UI tokens/app shell và luồng local. Camera ở cấu hình/entry development riêng, không để native imports làm Expo Go crash. Ghi lệnh thực sự đã chạy vào README, không giả lệnh chưa có là setup hiện hành.

## Demo ngày mai: scope và thứ tự thực hiện

Chủ thực hiện: agent chính; người dùng/team hỗ trợ cài và thao tác điện thoại. Mốc tương đối bắt đầu **sau khi duyệt**, phụ thuộc thời điểm duyệt/giờ demo. Ước lượng là timebox lập kế hoạch, không bảo đảm triển khai trước một giờ chưa biết.

| Mốc | Đầu ra | Cổng nghiệm thu / fallback |
|---|---|---|
| T+0–2 giờ | Bootstrap, shell, app mở trên iPhone13 qua Expo Go | Nếu chưa mở được, ưu tiên xử lý setup trước; chưa phát triển thêm module |
| T+2–6 giờ | 3–5 bài mẫu, Today/Workout, active session, summary/history | Complete/pause/cancel đúng; kill/reopen phục hồi; write failure không báo saved |
| T+6–8 giờ | Review giao diện, English copy, a11y cơ bản, lỗi/empty; rehearsal | Lint/typecheck/test pass và walkthrough trên iPhone; ghi Android chưa xác minh nếu thiếu máy |
| Sau core pass, tối đa 60–90 phút khảo sát spike | Camera permission/preview hoặc native build smoke nếu toolchain sẵn | Không nâng host lớn để cứu deadline; không đạt thì ghi pending, giữ demo core |
| Trước demo ít nhất 2 giờ (khi biết giờ) | Freeze scope, ghi clip dự phòng từ app thật, script demo 3–5 phút | Clip chỉ là bản dự phòng ghi rõ; không dùng clip để tuyên bố live pose/verified XP |

**Bắt buộc cho demo:** English UI, một luồng tập thực hiện được, persistence local, manual reps, mock label, reset demo có xác nhận, cách mở lại. Hai tab thực hiện `Train` và `Progress`; không tạo tab chết cho tính năng chưa có.

Offline ở demo nghĩa là nghiệp vụ/local data không cần backend sau khi JS bundle đã nạp. Không hứa Expo Go cold-start hoàn toàn offline: rehearsal phải kiểm tra LAN/Metro, cùng Expo account nếu client yêu cầu, reload và điểm phát mạng dự phòng. Không mở public tunnel hoặc upload project nếu chưa nằm trong cách chia sẻ đã được duyệt; clip từ app thật là dự phòng cuối.

**Chỉ khi còn thời gian sau core:** một màn giới thiệu Coach/Community dạng preview ghi “Demo preview — not connected”; không tạo lời khuyên đau/chấn thương, fake AI latency, tài khoản thật hay XP được xác minh. Không cần preview để demo đạt.

**Ngoài demo:** auth/backend thật, chat AI live, social/event mutation, leaderboard thật, XP server, kết luận tư thế và anti-cheat. Nếu hackathon bắt buộc một trong các phần này, cần đổi ưu tiên rõ ràng thay vì cộng vào cùng deadline.

## Lộ trình đầy đủ sau demo

| Giai đoạn | Lát cắt chạy được | Checklist trước khi coi là hoàn tất |
|---|---|---|
| 0 — hiện tại | Tài liệu đọc/review được; không có executable | Kiểm kê, brief/flows/ownership, stack/trade-off, spike protocol, review và quyết định mở |
| 1A — hackathon | App local trên điện thoại theo scope trên | Core tests, restore/retry, English, a11y; iOS đo thật, Android test khi có máy |
| 1B — foundation/spike | Development build iOS+Android, camera/keypoint counter thử nghiệm | Gate A/B trong pose-spike; lock toolchain; chưa có máy = chưa hoàn tất verification |
| 2 — tập luyện thật | Auth/onboarding/catalog/plans/session/history đồng bộ | Hai user isolation; online/offline/retry/reopen; migration từ local demo được lựa chọn rõ, không tự upload fixture |
| 3 — cộng đồng/điểm/events | XP server ledger; friend challenge; tạo/join/withdraw/confirm event | Duplicate/crash/concurrency/RLS/reversal tests; board policy phù hợp, không gắn verified cho tự khai |
| 4 — AI Coach | Context theo consent, đề xuất kiểm tra được và apply có chủ đích | Eval thiếu data/invalid IDs/timeout/provider lỗi/risk routing; chuyên gia duyệt nội dung đau trước mở thật |
| 5 — pose/verification | Chống đẩy trong điều kiện đã kiểm chứng; server eligibility | Gate C, feedback gate riêng, replay/client forgery tests, công bố giới hạn; có thể chỉ đạt camera-assisted |
| 6 — hoàn thiện | Build phân phối phù hợp mục tiêu lúc đó | Review native/a11y/perf/privacy/authorization/regression, setup reproducible, không blocker chưa xử lý |

Lộ trình GĐ2–6 không phải kế hoạch hoàn thành trong một ngày. Chỉ chốt lịch sau khi có kết quả demo/spike và quyết định tiếp tục sản phẩm.

## Những việc chốt sau thử điện thoại

- Pose engine, FPS/resolution/ngưỡng confidence, góc quay hỗ trợ, thermal/battery và dải thiết bị.
- Native toolchain exact versions, cách signing iPhone và APK Android; không suy từ docs thành tương thích đã xác nhận.
- Quyền lợi XP/cap, trust policy từng leaderboard và bằng chứng bổ sung cho giải có thưởng.
- AI model/provider/budget, nội dung chuyên gia, điều kiện phục vụ nhóm tuổi; khả năng phát hành là quyết định sau hackathon.

## Gói duyệt cuối lượt

Đề nghị duyệt **stack demo Expo Router + npm + local persistence**, **scope demo 1A**, và **bố cục đại diện trong design-direction** trên hướng coral đã chọn. Backend Supabase là đề xuất dài hạn, có thể duyệt hướng mà chưa tạo tài khoản/dịch vụ. Nếu muốn pose hoặc AI live là điểm chính bắt buộc của hackathon, cần thay scope core tương ứng; hiện chưa có yêu cầu đó được xác nhận.

Tài liệu kèm: [brief](product-brief.md), [architecture](architecture.md), [pose protocol](pose-spike.md), [design](design-direction.md), [environment](environment.md), [decisions](decisions.md), [progress](progress.md).
