# Fitness App — local workout demo

Camera AI đã được khôi phục ngày 14/11/2026 từ nhánh FitMeal trước PR #4, giữ cả nâng cấp AI Coach, Pause để chỉnh set/rep và ảnh đại diện bài tập. Camera AI hỗ trợ Bodyweight Squat, cần development build có MediaPipe. Các lệnh npm start / npm run ios / npm run android vẫn mở bằng Expo Go cho tập thường, FitMeal và Coach; Expo Go không đếm pose.

React Native + Expo SDK58 + TypeScript. UI English, neutral/coral. Luồng tập và Progress lưu local. Demo không cần camera, sự kiện hoặc leaderboard.

Tab **AI Coach** hướng dẫn mobility và stretching. Demo có thể dùng Groq qua Expo dev server hoặc dùng lựa chọn nhanh trên thiết bị.

## Mở trên iPhone

```sh
cd /Users/minh/Projects/fitness-app
npm ci
npm start -- --clear
```

Dùng Node24.22.2 theo `.nvmrc` (Node26.7.0 cũng đáp ứng engines). Máy tính và điện thoại cùng Wi-Fi. Mở Expo Go hỗ trợ **SDK58**, quét QR mới. Giữ Metro chạy; cho phép Local Network nếu iOS hỏi. Không cần API key hoặc Apple Developer trả phí. Nếu port8081 đã có Metro, dừng terminal cũ bằng Ctrl+C trước khi chạy lại.

Sau khi pull thay đổi có cập nhật `package-lock.json`, dừng Metro rồi chạy `npm ci` trước khi mở app lại. Trên iOS Simulator, dùng `npm run ios -- --clear`.

Dữ liệu chỉ lưu trong vùng dữ liệu của project trên máy bằng `expo-file-system`. Xóa Expo Go/xóa dữ liệu project có thể mất lịch sử. Chỉ hiện kết quả đã lưu sau khi ghi thành công; lỗi ghi có thể thử lại. Không hứa cold-start offline bằng Expo Go: cần Metro để tải bundle.

## Kiểm tra

```sh
npm run typecheck
npm run lint
npm test
npx expo install --check
npx expo export --platform all
```

## Demo khoảng 3 phút

1. Train: xem mục tiêu và chọn một bài trong thư viện; mở hướng dẫn và số hiệp/lần.
2. Bắt đầu phiên: timer chạy; hoàn thành hiệp đầu, xem nghỉ; pause/resume. Có thể bỏ qua thời gian nghỉ khi trình diễn.
3. Hoàn thành hiệp cuối rồi kết thúc; xem kết quả đã lưu.
4. Mở Progress và kiểm tra buổi tập xuất hiện đúng một lần. Mở Home và kiểm tra lịch đánh dấu ngày hoàn thành, Today’s Activity cộng thời lượng đã lưu, kể cả bài dưới một phút.
5. Reload hoặc đóng/mở app qua Expo Go: lịch sử còn. Thử bắt đầu một phiên rồi Back → Resume để thấy app giữ cùng phiên.

Bài tập/hướng dẫn là nội dung mẫu; set hoàn thành do người dùng tự xác nhận. Timer, lifecycle, lưu kết quả và Progress tính từ phiên local là chức năng thật. Chưa đo camera, chưa xác minh thành tích, chưa phải hướng dẫn cá nhân hóa.

## Cấu trúc

`app/` chỉ ghép screen/điều hướng. `exercise-catalog` sở hữu catalog mẫu; `workout-sessions` sở hữu snapshot versioned và lifecycle; Home và Progress đọc cùng snapshot. Home nhóm phiên theo ngày hoàn thành trên thiết bị và dùng cùng cách tính thời lượng với Progress. `src/ui` chỉ tokens và primitives. Các module nhập nhau qua public `index`.

Chi tiết trạng thái và giới hạn kiểm chứng: [docs/progress.md](docs/progress.md).

## Thử AI Coach

1. Để bật live AI, tạo `.env.local` ở root và thêm `GROQ_API_KEY` từ tài khoản Groq. Khởi động lại Metro. Key là biến server, còn `EXPO_PUBLIC_COACH_ORIGIN` chỉ dùng nếu cần chỉ định URL server khác. Demo dùng mạng nội bộ tin cậy. Giữ endpoint dev trong LAN.
2. Mở **AI Coach** và gửi câu mẫu `Tôi bị mỏi hông`. Chọn **Gentle movement → Seated** để xem **Seated Hip March** trong Train. Với `Mình bị mỏi cổ`, luồng tương tự mở **Chin Tucks**. Thử lại với **Pain or recent injury** và **Not sure** để kiểm tra Coach dừng ở bước đó.
3. Thử câu wellness tự do như `Mình có 5 phút ở văn phòng, muốn vận động vai khi đứng, không dụng cụ`. Khi Groq khả dụng, Coach chọn từ catalog. Khi thiếu key, quá thời gian chờ hoặc mất kết nối, Coach báo AI tạm gián đoạn và luồng chọn nhanh vẫn hoạt động sau khi app đã mở.
4. Chạm thẻ bài để mở Train, rồi Back để về chat. Lịch sử chat chỉ ở RAM và mất khi đóng hẳn hoặc reload app.

Coach sở hữu transcript và request/response của `POST /api/coach`. Train sở hữu catalog và hướng dẫn bài. Các yêu cầu tự do ngoài mẫu đơn giản được gửi tới Groq để chọn từ danh sách ID giới hạn. Luồng căng mỏi xác nhận tại máy rồi dùng cả vùng và tư thế đã chọn để lọc catalog, kể cả khi Groq gián đoạn. Dùng câu mẫu và dữ liệu giả lập trong demo dành cho người lớn. Endpoint demo chưa có xác thực hoặc giới hạn lượt gọi.

Trong **Train → All** và **Mobility**, các bài mobility bao phủ cổ, vai, lưng trên, lưng dưới, cổ tay, ngực, core, hông, đầu gối, đùi sau, bắp chân và cổ chân. Coach dùng vùng tập, tư thế, dụng cụ và thời lượng từ cùng catalog.

Khi chat tự do, Coach gửi tối đa 8 tin nhắn gần nhất trong cuộc chat hiện tại để hiểu các câu tiếp nối như “Standing stretch” rồi “Back”. Model trả câu hỏi cụ thể cho thông tin còn thiếu. Chat mới bắt đầu với ngữ cảnh rỗng.

Khi chat tự do gặp lỗi, thông báo cho biết quá thời gian chờ, chạm quota hoặc không kết nối được. Nút **Try again** gửi lại câu vừa hỏi với ngữ cảnh cũ. Các lựa chọn nhanh về vùng và tư thế đã chọn vẫn có thể lọc bài trên máy.

Test Coach dùng callback và fetch giả lập để kiểm tra gửi trùng, đổi chat khi đang đợi, nhánh dừng, offline và kiểm tra ID. Cần chạy lại walkthrough bằng Expo Go với key thật để xác nhận Groq và hành vi trên điện thoại.

## Check-in và lượng tập

Coach mở chat bằng câu hỏi cảm nhận trong ngày: tired/stressed, usual, energized hoặc rest. “Tôi bị mỏi lưng” hỏi tiếp upper/lower back bằng lựa chọn tại máy. Đề xuất hiển thị sets và số lần/thời gian mỗi hiệp; mở Train để xem và chỉnh trước khi Start. Đơn vị theo catalog (reps, mỗi bên, vòng hoặc giây), không đổi bài giữ thành bài đếm reps.

Demo dùng quy tắc lượng tập có giới hạn: nhẹ = 1 hiệp và khoảng nửa lượng mỗi hiệp; thường = catalog; năng động = thêm 1 hiệp và khoảng 20% mỗi hiệp, tối đa 5 hiệp/60 đơn vị. Yêu cầu số cụ thể trong chat ưu tiên hơn mặc định này. Đây là mục tiêu do người dùng tự chọn, không phải phép đo khả năng hoặc giáo án chuyên môn. Lời đáp tự do vẫn có thể dùng Groq, còn các check-in và lựa chọn nhanh hoạt động local. Không suy đoán chu kỳ hoặc chẩn đoán từ tâm trạng.

Trong phiên, chỉ khi Pause mới có thể chỉnh mục tiêu hoặc chọn Finish early. Giảm hiệp không xóa hiệp đã hoàn thành; kết thúc sớm giữ số hiệp thực đã đánh dấu và nhãn endedEarly. Chưa hoàn thành hiệp nào thì kết thúc sẽ hủy phiên. Khi Pause có thể Ask AI Coach rồi Apply đề xuất cho bài hiện tại; khi đang chạy, chỉnh mục tiêu bị khóa cả ở UI và writer; không tự bật mic hoặc gửi dữ liệu phiên cho AI. Check-in chỉ ở chat RAM; session lưu mục tiêu, không lưu tâm trạng hoặc thông tin chu kỳ.

## AI Coach: chỉnh mục tiêu qua chat và cuộn số

- Chọn **tired / usual / energized** → Coach hỏi vùng muốn tập → chọn **Hips** để xem Standing Hip Circles và Seated Hip March. Danh sách là các lựa chọn thay thế; từng bài vẫn mở phiên riêng. Khi có yêu cầu tư thế/dụng cụ cụ thể, số lựa chọn phụ thuộc catalog.
- Gửi `Tôi muốn 2 set`, rồi `12 reps` để cập nhật mục tiêu trên cả danh sách. Gửi `Seated Hip March 3 sets` để đổi riêng bài đó; `Giảm 1 set` giảm một hiệp trên các bài hiện tại. Thẻ mới và màn Train dùng cùng mục tiêu.
- Nếu danh sách có bài giữ theo giây, ghi tên bài và đơn vị `seconds`/`giây`; Coach không đổi reps thành giây. Giới hạn demo: 1–5 hiệp, 1–60 lần/giây mỗi hiệp.
- Ở đầu màn Workout, chạm số **sets**, **per set**, **rest**; cuộn số kiểu alarm, **Done** áp dụng, **Cancel** giữ nguyên. Rest chọn 0–180 giây, bước 5 giây. Start dùng các giá trị đã chọn; Resume hiển thị mục tiêu phiên đang có.
- Contract `POST /api/coach`: suggest dùng `exerciseIds: string[]` (1–5 ID thật, không trùng). Client/server phải chạy cùng bản. Coach giữ transcript và mục tiêu gợi ý trong RAM; workout-sessions lưu phiên đã Start với totalSets, targetAmount và restMs.

## Bản ghép AI Coach + FitMeal (14/11/2026)

Expo được khóa ở 58.0.25; package-lock.json đã đồng bộ với package.json. Giữ expo-dev-client từ nhánh FitMeal, nhưng các lệnh npm start / npm run ios / npm run android chỉ định --go để tiếp tục mở bằng Expo Go. Chạy npm ci sau khi pull để cài đúng bộ dependency. Camera AI/MediaPipe được khôi phục trong phần dưới; FitMeal không phụ thuộc chúng.

## Điều chỉnh trong Pause (14/11/2026)

Màn đang tập chỉ giữ các thao tác tập, nghỉ và Pause. Sau Pause, chạm ô total sets / per remaining set để mở bộ cuộn số; mục Ask AI Coach cho nhập yêu cầu cho chính bài hiện tại, rồi Apply suggested targets để lưu. Resume không tự áp dụng đề xuất chưa lưu. Đề xuất cũ bị bỏ khi đóng panel, đổi mục tiêu hoặc Resume; không xóa hiệp đã hoàn thành. Tổng set bao gồm hiệp đã tập, lượng mỗi hiệp áp dụng cho phần còn lại. Khi AI lỗi vẫn chỉnh tay được. Chat này chỉ ở RAM và không gửi hồ sơ/cân nặng/chiều cao/lịch sử phiên; chỉ gửi câu hỏi và mục tiêu của bài hiện tại tới API Coach đã cấu hình.

API POST /api/session-coach do AI Coach sở hữu nhận text, exerciseId, sets, amount, setsDone; trả message và target tùy chọn gồm sets/amount đã kiểm tra. Server chỉ đề xuất, không ghi phiên. Workout-sessions tiếp tục là owner lưu mục tiêu qua serialized writer và chỉ chấp nhận adjustVolume khi paused. Màn chi tiết dùng cùng ảnh PNG với danh sách Train; GIF hướng dẫn trong session giữ nguyên. Không cần thêm dependency hoặc biến môi trường.

## Camera AI + AI Coach — bản khôi phục 14/11/2026

- Nguồn Camera AI: commit4293869 của feature/fitmeal-integration trước khi merge PR #4. Giữ các nâng cấp Coach, mục tiêu set/amount/rest, ảnh PNG từng bài, GIF và FitMeal. Nút Start session with Camera AI xuất hiện ở Bodyweight Squat.
- Camera yêu cầu native module ExpoMediaPipePose. Nếu chưa có, nhấn nút sẽ báo cần development build và không tạo/hủy phiên hiện tại; mở route camera trực tiếp cũng có màn giải thích, không làm crash Expo Go. Tập thường và chat Coach vẫn dùng được.
- Node24+ theo yêu cầu package MediaPipe (project pin .nvmrc24.22.2). Dependency exact: expo-camera58.0.14 và expo-mediapipe-pose0.4.0; Expo giữ58.0.25. Package license MIT; notices/model MediaPipe Apache2 đi kèm package. Không sửa node_modules bằng patch riêng.
- Để tạo development build trên máy có native toolchain phù hợp: npm run build:android hoặc npm run build:ios. Sau khi đã cài build có MediaPipe, chạy npm run start:dev. Đây là các lệnh setup; lượt khôi phục này chưa build APK/IPA hoặc ký/cài lên thiết bị thật. Xcode26.2 trên host thấp hơn yêu cầu SDK58 đã ghi trong docs/environment.md; không tự nâng macOS/Xcode hoặc cài Android toolchain.
- Camera xin quyền camera, không xin microphone/ghi âm. Frame xử lý trên máy; không thêm lưu/upload raw video. Bộ đếm Squat là ước tính theo góc gối như bản trước, chưa xác minh độ chính xác hoặc tư thế an toàn.
- Phiên camera lưu workoutMode, repsCompleted và formFeedback cùng totalSets/targetAmount/restMs. Resume không reset rep. Chỉ ghi rep khi active; update trễ sau Pause/kết thúc hoặc update làm giảm rep bị bỏ. Pause mới chỉnh tay hoặc Ask AI Coach → Apply, dùng chung controls với phiên thường. Không đổi rep/hiệp đã ghi khi đổi mục tiêu.
- Mark set complete trong camera vẫn do người dùng đánh dấu; số rep camera là tổng ước tính, không tự suy ra số hiệp. Camera có thể Finish & save khi có rep đã ghi hoặc đủ hiệp thủ công; không tạo phiên hoàn tất rỗng mới. Snapshot camera cũ được đọc tương thích schemaVersion1.
