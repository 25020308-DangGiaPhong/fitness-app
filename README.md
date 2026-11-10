# Fitness App — local workout demo

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
2. Mở **AI Coach** và gửi câu mẫu `Mình bị mỏi cổ`. Chọn **Gentle movement → Seated** để xem **Shoulder Rolls**, một bài vận động vai và lưng trên trong Train. Thử lại với **Pain or recent injury** và **Not sure** để kiểm tra Coach dừng ở bước đó.
3. Thử câu wellness tự do như `Mình có 5 phút ở văn phòng, muốn vận động vai khi đứng, không dụng cụ`. Khi Groq khả dụng, Coach chọn từ catalog. Khi thiếu key, quá thời gian chờ hoặc mất kết nối, Coach báo AI tạm gián đoạn và luồng chọn nhanh vẫn hoạt động sau khi app đã mở.
4. Chạm thẻ bài để mở Train, rồi Back để về chat. Lịch sử chat chỉ ở RAM và mất khi đóng hẳn hoặc reload app.

Coach sở hữu transcript và request/response của `POST /api/coach`. Train sở hữu catalog và hướng dẫn bài. Request tự do được gửi tới Groq để chọn từ danh sách ID giới hạn. Luồng xác nhận cho câu “mỏi cổ” chạy local và chỉ gửi lựa chọn tư thế khi cần chọn bài. Dùng câu mẫu và dữ liệu giả lập trong demo dành cho người lớn. Endpoint demo chưa có xác thực hoặc giới hạn lượt gọi.

Test Coach dùng callback và fetch giả lập để kiểm tra gửi trùng, đổi chat khi đang đợi, nhánh dừng, offline và kiểm tra ID. Cần chạy lại walkthrough bằng Expo Go với key thật để xác nhận Groq và hành vi trên điện thoại.
