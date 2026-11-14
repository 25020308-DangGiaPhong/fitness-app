# Tiến độ và hạn chế

## Đồng bộ palette FitMeal — 2026-11-14

- FitMeal nay dùng token neutral/coral chung cho nền, surface, viền, chữ, trạng thái chọn và hành động; icon tab cũng dùng màu do tab navigator cung cấp thay fallback xanh lá. Màu BMI theo từng mức vẫn giữ vì là tín hiệu trạng thái, không phải màu chrome của tab.
- Thứ tự tab là Home, Train, AI Coach, Progress, FitMeal, rồi Profile.
- `npm run lint` và `npm run typecheck` PASS; chưa thực hiện QA render native cho chỉnh sửa thị giác này.

## Gỡ camera AI — 2026-11-13

- Theo yêu cầu người dùng, khôi phục các file liên quan camera về mốc `44bbe14` (trước commit `7198f3d` và bản sửa `8f63e7b`). Giữ commit GIF `b233c96`, AI Coach, auth/profile và cloud sync đã có trước camera. Không reset Git hoặc thay đổi agents.
- Gỡ route/screen camera, nút Camera AI, `updateAiData`, metadata camera khỏi hợp đồng session/cloud và rule hoàn tất riêng cho camera. Workout-sessions tiếp tục sở hữu phiên tập/persistence; phiên thủ công chỉ hoàn tất khi đủ hiệp như trước.
- Khôi phục package.json/lockfile trước camera, gồm Expo58.0.23 và scripts mở Expo Go. `npm ci --offline` thành công. Gỡ dependency expo-camera/expo-mediapipe-pose và bản vá Swift thử nghiệm trong node_modules bằng cài lại bộ cũ.
- Xóa thư mục `ios/` được sinh khi thử camera, cache build riêng FitnessApp, cache MediaPipe của CocoaPods và bốn mục npm cache camera. Gỡ bản native `com.sontobe.fitnessapp` trên Simulator `new`; vùng dữ liệu này chỉ có hai phiên camera. Không xóa Expo Go, Simulator runtime, công cụ dùng chung hoặc dữ liệu Expo Go.
- Typecheck, 22 tests, diff check và export bundle iOS/Android PASS trên Node26.7.0. Lint còn lỗi dấu nháy JSX có sẵn ở SessionScreen.tsx:155, thuộc thay đổi GIF giữ lại; chưa sửa ngoài phạm vi rollback.
- Dung lượng trống tăng từ khoảng3GB lên khoảng9GB sau dọn build/cache (số đo có thể thay đổi khi máy hoạt động). Chưa kiểm tra lại runtime Expo Go trên điện thoại thật; export không phải device test.

## Sửa lỗi chạy sau pull — 2026-11-11

- Máy thiếu expo-image và expo-image-picker mới được thêm trong package-lock. Chạy npm ci để cài đúng dependency đã khóa. Sửa script ios bị khai báo hai lần và dấu nháy trong JSX của màn kết quả phiên tập làm lint fail.
- Lint, typecheck, 22 tests, diff check và export bundle iOS/Android pass trên Node26.7.0. Chưa kiểm tra lại runtime Simulator hoặc chức năng upload ảnh/cloud sync với Supabase thật.

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

## Core workout — phạm vi mới ngày 2026-11-07

Người dùng thu gọn ưu tiên về vòng tập khép kín, hoãn toàn bộ XP/leaderboard/events/AI/camera. Đang triển khai Train (catalog10 bài và filter), hướng dẫn, phiên tập/set/rest/pause/resume/cancel, kết quả đã lưu và Progress từ cùng snapshot. `workout-sessions` là owner dữ liệu; `exercise-catalog` sở hữu nội dung mẫu; Progress chỉ đọc. Storage boundary kiểm tra schemaVersion/invariants; không tự xóa file khi lỗi.

Dependency mới: expo-file-system58.0.13 (MIT), có trong Expo Go. Không thêm camera dependency. Host kiểm tra lần này Node26.7.0; project vẫn pin .nvmrc24.22.2. Dependency check theo bundled SDK58 PASS ở chế độ offline; chưa coi là kiểm tra online registry.

Simulator iPhone17 Pro/iOS26.2 chỉ có Expo Go57.0.9, đã mở và quan sát báo project cần Expo Go mới hơn. Chưa chạy được UI core SDK58 trong Simulator; chưa xác nhận iPhone13/iOS18.6 hoặc Android thật. Kết quả shell SDK57 trước đó không thay cho kiểm tra core mới.

### Kết quả core

- Hoàn tất Train/library10 bài + filter, detail/hướng dẫn, session timer/set/rest/skip-rest/pause/resume/cancel, summary, lịch sử và tổng tiến độ từ snapshot thật.
- Một phiên hiện hành; Start/re-entry trả cùng phiên. Complete terminal/idempotent; lưu thành công mới publish trạng thái. Read error giữ file và cho retry. Cancel không vào lịch sử hoàn tất.
- 8 domain/persistence tests PASS: reentry/reopen JSON, pause/rest, complete lặp, cancel, schema hỏng, failed-write/retry, concurrent20 starts/finishes, regression pause trước hiệp đầu.
- Typecheck/lint PASS trên Node26.7.0. Export iOS/Android PASS; chưa phải IPA/APK hoặc device smoke. Node test có warning MODULE_TYPELESS_PACKAGE_JSON, không ảnh hưởng kết quả.
- Chưa kiểm chứng runtime SDK58 trên iPhone/Android, đóng app thật trong lúc ghi, font scale lớn nhất/landscape/VoiceOver. Giới hạn Simulator ExpoGo57 nêu trên còn nguyên. Core là local self-report, không XP/AI/camera/sự kiện/leaderboard/backend.

## AI Coach preview — sửa review 2026-11-08

- Tab AI Coach nằm giữa Train và Progress, route mỏng, module sở hữu transcript/draft/intake trong RAM. Không gọi mạng/model hoặc ghi chat vào workout snapshot.
- Sửa gửi/xác nhận/retry liên tiếp: kiểm tra khóa đồng bộ trước khi đổi revision/thêm message. Request cũ sau reset không chèn phản hồi/lỗi hoặc mở khóa request mới; dọn callback khi unmount.
- Resolver dùng getExercise từ public API catalog thay danh sách squat viết cứng; ID không tồn tại không được điều hướng. Chuẩn hóa key fixture invalid_exercise_id.
- Coach dùng color/typography/spacing/radius tokens của app; vùng chạm tối thiểu48, feedback nhấn và reduced-motion cho cuộn. Scenario mới xóa draft để tách dữ liệu mẫu.
- README có walkthrough preview và điểm nối MedGemma; chưa có HTTP adapter/consent/auth server. DTO preview chưa phải contract backend hoàn chỉnh; phải map/validate theo hướng dẫn MedGemma ở bước sau.
- Kiểm chứng trên Node26.7.0, bộ dependency theo package-lock hiện tại: lint/typecheck PASS, 14 tests PASS (8 workout + 6 Coach). Test Coach transpile mã thật rồi chạy callback với hooks/native giả lập; không phải native rendering/E2E. Export bundle iOS/Android PASS ra thư mục tạm; không phải IPA/APK. Warning MODULE_TYPELESS_PACKAGE_JSON của test workout còn nguyên, không làm test fail.
- Chưa kiểm chứng render/keyboard/tab-back-state/font lớn/VoiceOver/TalkBack trên thiết bị của project. Simulator đang mở app khác (Forma Coach), không dùng làm bằng chứng runtime cho source này. Chưa chạy MedGemma hoặc đánh giá chuyên môn.

## AI Coach — bố cục chat ngày 2026-11-09

- Bỏ banner preview, nhãn mẫu và bảng scenario kỹ thuật khỏi màn hình. Giữ một dòng dưới composer cho biết đây là demo và chưa có AI thật.
- Gửi tin nhắn trả ba bài cố định từ Train; chạm hàng bài mở route workout dùng chung. Back trở về tab và cuộc chat nguồn.
- Chat mới và lịch sử đóng/mở do Coach giữ trong RAM. Không lưu qua reload hoặc đóng hẳn app; chưa lưu chat sức khỏe xuống đĩa.

## Home Today’s Activity — 2026-11-10

- Home và Progress đọc cùng snapshot do `workout-sessions` sở hữu. Home dùng ngày hoàn thành theo giờ thiết bị cho lịch và tổng trong ngày, cộng thời lượng phiên đã lưu trước khi làm tròn để hiển thị.
- Đã bỏ kho AsyncStorage riêng của Home. Các phiên từng xuất hiện trong Progress được Home đọc trực tiếp từ snapshot hiện có.
- Lint, typecheck và 12 test pass. Test hồi quy render Home với snapshot giả lập, gồm bài dưới một phút, phiên qua nửa đêm, phiên đã hủy và phiên còn đang chạy. Chưa kiểm tra trên điện thoại thật.
## Benchmark phân loại mức đau tiếng Việt (10/11/2026)

- Notebook [coach-label-benchmark.ipynb](../scripts/coach-label-benchmark.ipynb) dùng 20 câu mẫu, 12 câu hiệu chỉnh và 28 câu thử giả lập tách riêng. So sánh MedGemma 1.5 4B chọn mã trực tiếp với MiniLM đa ngôn ngữ + cosine. Mức mỏi đơn thuần hoặc chưa nêu mức được gán `CHUA_RO` theo quy ước benchmark.
- Đã chạy mốc cosine ký tự bằng Python trên Mac: 17/28 đúng, 2 lần gán mức khi thiếu thông tin và 8 lần trả chưa rõ cho câu đã có nhãn rõ. Đây là số đo của mốc ký tự. Điểm MedGemma và MiniLM chờ chạy notebook Colab với quyền truy cập model.
- Đã kiểm tra cú pháp Python, logic chấm và CSV bằng dữ liệu giả lập. Benchmark chỉ đo nhãn trong câu nhập. AI Coach trong app tiếp tục ở chế độ preview.

## Mobility & Stretching Coach — demo nội bộ (2026-11-10)

- Tab Coach dùng lựa chọn nhanh cho câu mẫu “Mình bị mỏi cổ”, sau đó chọn bài mobility trong Train theo tư thế. Nhánh đau/chấn thương hoặc chưa chắc dừng trước thẻ bài. Body Map để sau.
- Coach sở hữu chat trong RAM và hợp đồng API. Expo dev server giữ key, gọi Groq GPT-OSS 20B và kiểm tra ID theo danh sách đủ điều kiện. Train sở hữu catalog. Khi không gọi được Groq, các lựa chọn nhanh vẫn chọn bài local và báo rõ nguồn kết quả.
- Lint, typecheck, 15 tests và export bundle iOS/Android pass trên Node 26.7.0. Test callback và Groq giả lập chưa thay cho Expo Go trên điện thoại hoặc một lượt gọi Groq thật.
- Kiểm tra HTTP qua Metro local: “mỏi cổ” trả confirm, “đau cổ” trả stop, thiếu key trả 503, tư thế sai trả 400.
- Sửa nhánh hỏi lặp sau khi chọn tư thế. Seated/Standing lọc catalog trực tiếp, còn “Tôi muốn vận động vai” nhận ngay Shoulder Rolls.
- Bổ sung Cat–Cow và Seated Knee Extensions vào Train và danh sách ứng viên của Coach. Yêu cầu rõ nhưng không có bài phù hợp dùng trạng thái riêng thay vì hỏi lại vùng hoặc tư thế.
- Bổ sung 17 bài mobility cho 12 vùng chính. Train → All và Mobility đọc cùng catalog. Coach lấy vùng, tư thế, dụng cụ và thời lượng từ catalog để chọn bài.
- Phân biệt mô tả mỏi với đau trong 12 vùng. Nút tư thế giữ nguyên vùng của lượt xác nhận và chỉ hiển thị tư thế có bài phù hợp. Câu chỉ nói mỏi hỏi thêm vùng.
- 2026-11-11: “Mỏi chân” hỏi tiếp trong nhóm chân bằng các lựa chọn đùi sau, đầu gối, bắp chân và cổ chân. Vùng cụ thể được giữ qua bước chọn tư thế và mở bài trong Train.
- 2026-11-11: Chat tự do gửi tối đa 8 tin nhắn gần nhất của cuộc chat hiện tại cho Groq. Request kiểm tra role và độ dài, response kiểm tra câu trả lời tối đa 400 ký tự. Hiện câu hỏi cụ thể từ model cho thông tin còn thiếu thay vì lặp mẫu clarify. Bỏ shortcut khớp nguyên câu “vận động vai” để các lượt này cũng dùng ngữ cảnh.
- Lint/typecheck, 20 tests và diff check pass. Groq thật hỏi vùng sau “vận động nhẹ”, nhớ đứng sau “Standing stretch”, hỏi lưng trên/dưới sau “Back”. Lượt cuối của lần chạy đầu trả unavailable; khi thử riêng với ngữ cảnh đầy đủ, “Upper back” trả Wall Slides và lý do chọn bài. Chưa kiểm tra lại giao diện native. Khi câu hiện tại chỉ rõ một vùng, server chỉ gửi các bài thuộc vùng đó để giảm lượng token.
- Sửa lỗi dịch vụ bị gom thành một thông báo unavailable: phân biệt quota, thiếu cấu hình, timeout và lỗi provider. Tăng thời gian chờ Groq từ 7 lên 18 giây, client 22 giây. Nút Try again gửi lại nguyên câu và ngữ cảnh, không thêm user turn hoặc chuyển sang vùng vai. Câu trả lời thời lượng ngắn dùng vùng từ hội thoại để giảm catalog gửi đi. Groq thật với “10 minutes” và ngữ cảnh lưng dưới trả Cat–Cow 3 phút, phù hợp ngân sách thời gian. Lint/typecheck và 22 tests pass; chưa kiểm tra lại UI Simulator.


## Empathy Coach và lượng tập — 2026-11-13

- Sửa textBoundary nhận mỏi lưng chung, thêm upper/lower back và giữ nhánh đau ưu tiên. Client/server dùng cùng boundary và không để check-in mệt bypass ngữ cảnh đau trước đó.
- Welcome check-in mới, lựa chọn tired/stressed/usual/energized/rest; nghỉ được tôn trọng. Tired với vùng tập trước đó giữ vùng đó khi có bài trong catalog. Prompt Groq nhấn mạnh đồng cảm, tự chủ và không suy đoán chu kỳ. Lượng tập là quy tắc demo giới hạn ở client, không tuyên bố là model đánh giá thể lực.
- Coach truyền mục tiêu sets/amount qua route sang Train, người dùng có thể chỉnh trước Start. Workout-sessions sở hữu targetAmount/totalSets và adjustVolume/finish-early qua writer tuần tự. URL/input/storage được kiểm tra số nguyên/giới hạn; optional fields tương thích snapshot schemaVersion1 cũ. Catalog giữ đơn vị và default. Cloud metadata mang target_amount/ended_early; chưa kiểm chứng Supabase thật.
- Trong phiên cho chỉnh tay và Finish early có xác nhận; không giảm totalSets dưới setsDone hoặc sửa phiên terminal. Kết thúc có hiệp thực lưu endedEarly, chưa có hiệp thì cancelled. Đây là mục tiêu tự khai; không ghi số rep hoàn thành giả. Chat giữa hiệp, voice và AI mutate active session hoãn.
- Không thêm dependency, bài tập hay camera. Chỉ lưu mục tiêu phiên, check-in vẫn trong RAM. Thử mở Simulator qua CUA bị timeout nên chưa xác minh render/touch/device thật. Tests dùng callback/hook/fetch giả lập; không phải E2E hoặc đánh giá chuyên môn. Xem kết quả kiểm tra cuối lượt bên dưới.

Kiểm chứng cuối lượt: lint/typecheck/diff check PASS; 28 tests PASS; export bundle iOS và Android PASS trên Node26.7.0. Không thêm native build hoặc dependency. Chưa chạy Groq thật với prompt mới và chưa QA giao diện native vì CUA timeout.

## AI Coach: chỉnh qua chat, danh sách bài và wheel picker — 2026-11-14

- [x] Check-in tired/usual/energized hỏi vùng trước; chọn Hips trả hai lựa chọn từ catalog. Nhánh mỏi/đau vẫn giữ xác nhận và ưu tiên dừng khi có đau trong hội thoại.
- [x] Contract suggest đổi từ exerciseId sang exerciseIds (1–5 ID hợp lệ, không trùng). Guided/offline trả danh sách cùng vùng/tư thế; Groq được hướng dẫn đưa nhiều lựa chọn, giữ ràng buộc cụ thể. Thẻ hiển thị cả tư thế/dụng cụ. Danh sách là lựa chọn thay thế, chưa có phiên nhiều bài.
- [x] Chat cập nhật mục tiêu thật trong RAM: số tuyệt đối, tăng/giảm có số, tiếng Anh/Việt, chỉnh cả danh sách hoặc bài được gọi tên. Mục tiêu mới trên thẻ và route Train dùng chung giá trị. Không cho reps đổi đơn vị bài giữ theo giây; số ngoài giới hạn không sửa mục tiêu. Yêu cầu số cụ thể ưu tiên hơn baseline theo check-in; baseline energized tăng cả sets và amount.
- [x] Bỏ bốn nút tăng/giảm trong Workout preview. Chạm set/amount/rest ở đầu màn mở bộ cuộn có highlight giữa, Cancel/Done, adjustable accessibility actions và reduced motion. Rest tùy chỉnh được truyền qua public start API, kiểm tra số nguyên 0–180 và lưu vào restMs; không đổi schema storage. Resume hiển thị mục tiêu của phiên hiện hành.
- [x] Owner không đổi: catalog giữ nội dung/đơn vị/default; Coach giữ transcript và gợi ý RAM; workout-sessions giữ phiên/persistence. Không thêm dependency, camera hoặc sửa cấu hình agents. Các thay đổi có sẵn trước lượt này được giữ nguyên.

Kiểm chứng trên Node26.7.0, Expo58.0.23/RN0.88.1/React19.3.0: lint, typecheck, 34 tests và diff check PASS. Export iOS/Android PASS, artifact tạm tại `/private/tmp/fitness-coach-20261114`. Tests Coach dùng callback/hook/fetch giả lập, gồm sửa set/rep thật, tên bài, thay vùng, validation, safety history và list contract; chưa phải native E2E.

QA native bằng CUA trên Expo Go, Simulator iPhone17 Pro (tên `new`, iOS26.2, UDID B24E11A8-C442-438A-85A9-25F46B4ECC61): chọn tired → hỏi vùng → Hips hiển thị hai bài; gửi số 2 sets/12 reps cập nhật cả hai thẻ; mở Seated Hip March nhận 2 sets/12 each side; wheel set tăng 2→3 qua adjustable action và Done áp dụng; kéo amount 12→13 và Done áp dụng; rest mở đúng bước5 và Cancel giữ15s. Một lần nhập tiếng Việt bằng bàn phím tự động bị rơi dấu ở Simulator; test callback dùng nguyên văn tiếng Việt. Không Start phiên hoặc ghi kết quả thử vào lịch sử người dùng. Ảnh màn Workout sau Cancel lưu tạm `/private/tmp/fitness-coach-picker-20261114.png`.

Groq thật qua HTTP local với câu mẫu không chứa dữ liệu cá nhân: request hip mobility ban đầu vẫn trả một bài; sau chỉnh prompt không tự giả định standing/no-equipment, kiểm tra lại trả `standing-hip-circle` và `seated-hip-march`. Đây là smoke với một câu mẫu, chưa phải eval độ ổn định của model. Chưa thử Android runtime, iPhone thật, font lớn/landscape, VoiceOver/TalkBack đầy đủ, hoặc kiểm chứng cloud/Supabase. Warning MODULE_TYPELESS_PACKAGE_JSON có sẵn trong tests không làm fail.

## Resolve conflict PR #4 — 2026-11-14

- Merge origin/feature/fitmeal-integration tại 4293869 vào feature/ai-coach tại 29eb0a2; conflict chỉ ở package.json và package-lock.json. Giữ nguyên code FitMeal/Profile của nhánh đích, code Coach/catalog/session của nhánh nguồn. Không sửa cấu hình agents hoặc đổi data owner.
- Expo exact58.0.25, giữ expo-dev-client58.0.20 từ FitMeal; giữ gỡ expo-camera/MediaPipe và chỉ định --go trong các scripts mở app. Lockfile seed từ nhánh FitMeal rồi npm install --package-lock-only --ignore-scripts; manifest/root-lock dependencies khớp hoàn toàn. npm ci --ignore-scripts thành công (792 packages).
- Lint/typecheck/34 tests/diff check PASS trên Node26.7.0. Export iOS/Android PASS ra /private/tmp/fitness-fitmeal-merge-20261114. Đây là kiểm tra build và regression hiện có, chưa kiểm thử runtime bản ghép trên Simulator/thiết bị thật hoặc cloud. Warning module type có sẵn không làm fail.
- Cập nhật nhánh nguồn để PR #4 hết conflict; không tự merge PR vào feature/fitmeal-integration.

## Session: Pause để chỉnh và ảnh bài tập — 2026-11-14

- [x] Bỏ bốn nút tăng/giảm và các thao tác kết thúc khỏi màn đang chạy. Pause mới hiện hai ô chỉnh manual, Ask AI Coach và Finish early/End. Writer reject adjustVolume khi active; completed/cancelled vẫn bất biến. Manual không giảm dưới setsDone; timer/rest tiếp tục giữ trạng thái Pause.
- [x] Panel Coach scoped bài hiện tại: đề xuất numeric bằng parser dùng chung, câu tự do gọi Groq qua POST /api/session-coach, kiểm tra catalog ID, đơn vị, whole-number bounds và completed sets. Người dùng Apply mới lưu; không tự resume. Đóng/Resume/đổi target unmount panel và abort request; writer chặn stale apply sau Resume. Lỗi mạng có retry bằng Ask coach hoặc chỉnh manual. Không gửi profile, không lưu chat xuống đĩa.
- [x] Cover Workout dùng exerciseImages giống Train; GIF trong session giữ lại và ngừng autoplay khi Pause. TargetPicker chuyển nguyên primitive sang src/ui để dùng chung, không thêm dependency.
- [x] Lint/typecheck/39 tests/diff check PASS trên Node26.7.0, Expo58.0.25/RN0.88.1/React19.3.0. Tests gồm bounds/unit/ID/AI invalid output, pause-only writer/race, save failure, callback active→Pause→manual/AI Apply→Resume và cover-image identity. Test callbacks không thay native renderer/E2E.
- [x] Export bundle iOS/Android PASS ra /private/tmp/fitness-paused-session-20261114. HTTP local gọi Groq thật với dữ liệu giả lập Squat3sets/10reps/1setDone và câu mệt trả đề xuất2sets/8reps. Chưa eval độ ổn định model, chưa test cloud thật.
- [x] CUA Expo Go trên iPhone17 Pro Simulator (new, iOS26.2): quan sát ảnh Squat; Start phiên thử 0hiệp, active không có controls chỉnh; Pause, manual10→9reps; Ask2sets/8reps trả proposal, Apply cập nhật nhưng vẫn paused; Resume ẩn controls và giữ8reps; Pause/End hủy phiên thử, không thêm completed workout. Không sửa/xóa các phiên trước đó. Chưa thử Android/runtime máy thật, VoiceOver/TalkBack hoặc font lớn/landscape.

## Khôi phục Camera AI + Coach mới — 2026-11-14

- [x] Khôi phục app/camera-session.tsx, đăng ký Stack, nút Camera AI cho Squat và NativeCameraSessionScreen từ FitMeal4293869. CameraSessionScreen bọc kiểm tra ExpoMediaPipePose + lazy import để không làm Expo Go lỗi khởi tạo. Không tạo phiên camera khi module thiếu; /session cũng dispatch phiên camera hiện hữu về màn tương ứng.
- [x] Giữ FitMeal và mọi thay đổi Coach/Pause/ảnh/GIF ở working tree. Tách PausedSessionTargets dùng chung giữa camera/manual, vẫn dùng shared TargetPicker. Cả hai mode chỉ chỉnh khi paused; Apply trước Resume, không mất rep đã ghi hoặc reset lúc re-entry.
- [x] Khôi phục workoutMode/repsCompleted/formFeedback trong model/storage/cloud; optional fields tương thích schemaVersion1. Ghi camera qua serialized writer, validate số nguyên hữu hạn và feedback; bỏ update giảm rep, stale frame sau Pause/terminal. Chỉ map field cho phép, không spread payload vào session. Camera finish không bịa completed sets và không lưu completed rỗng mới; lịch sử camera cũ vẫn đọc.
- [x] Npm exact expo-camera58.0.14, expo-mediapipe-pose0.4.0, giữ Expo58.0.25/dev-client58.0.20; engineNode24+; npm ci --ignore-scripts PASS (799 packages), manifest/engines khớp lockfile; package licenses MIT và bundled MediaPipe notices Apache2 đã đọc. Không thêm patch Swift, native build artifact hoặc đổi global tools/.codex/agents.
- [x] Lint/typecheck/42 tests/diff check PASS trên Node26.7.0. Tests thêm camera+Coach target persistence, re-entry, Pause/race/terminal, invalid counter payload, whitelist, native-module-absent fallback và camera launch giữ mục tiêu từ Coach. Các tests native path vẫn dùng mocks, không đánh giá độ chính xác pose.
- [x] Export iOS/Android PASS tại /private/tmp/fitness-camera-coach-restored-20261114. Expo config introspect PASS; camera permission hiện hữu, iOS mic description bị bỏ, Android RECORD_AUDIO có tools:node=remove; không thêm ghi âm/video upload.
- [ ] Chưa chạy native build/dev-client, chưa kiểm tra permission/preview/squat inference trên máy thật hoặc cloud sync. Host Xcode26.2; không tự nâng macOS/toolchain. CUA lấy Simulator bị timeout hai lần, nên chưa QA UI bản camera khôi phục. QA Pause/Coach ở lượt trước không thay kiểm chứng native Camera AI hiện tại.
