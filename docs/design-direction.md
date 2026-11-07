# Hướng thiết kế — coral trên nền trung tính

Người dùng đã duyệt hướng màu, bố cục và kế hoạch. Bản dưới mô tả hướng đã duyệt cho demo đầy đủ; lượt foundation hiện tại chỉ dựng Train/Progress và chi tiết mẫu, chưa có workflow phiên tập. Dùng `ui-ux-pro-max` cho hướng dẫn native, `impeccable` để phản biện. Chưa áp dụng thêm apple-design/design-system để tránh chồng hướng dẫn.

## Bối cảnh và lựa chọn

Người dùng đặt điện thoại ở bàn/sàn khi tập, thường nhìn nhanh giữa các set. UI cần đọc từ xa, thao tác ít, hợp người trẻ lẫn lớn tuổi. Tiếng Anh là ngôn ngữ sản phẩm; tài liệu dự án tiếp tục tiếng Việt. Bố cục ưu tiên tác vụ, không lấy landing page/grid quảng cáo làm app.

Đề xuất dùng nền stone sáng, chữ charcoal, coral ở hành động chính và chỉ báo set. Cá tính nằm ở nhịp số lớn, các vạch tiến độ set và giọng copy khích lệ vừa phải. Tránh bảng thành tích giả, glass/blur quanh số rep, neon hoặc nhiều gradient. Card chỉ nhóm nội dung có ranh giới thật; settings dùng list.

## Điều hướng và màn đại diện

Demo: hai tab **Train**, **Progress**. Workout detail → active session dùng stack/full-screen task, có exit rõ; không giấu Back hệ thống. Profile/settings vào từ header khi thực sự có chức năng. Bản đầy đủ có thể mở bốn điểm đến **Train / Coach / Community / Progress**, chỉ thêm khi luồng chạy được. Events ở Community, không thêm tab thứ năm.

Khi có phiên active/paused, Train đổi CTA thành “Resume workout”; Back không tự hoàn tất hoặc hủy. Start lặp mở cùng phiên, không tạo buổi mới. Muốn bỏ phiên phải chọn hành động hủy rõ ràng.

| Màn | Nội dung nhìn đầu tiên | Hành động và trạng thái |
|---|---|---|
| Train | “Ready for a short session?”; một buổi mẫu, thời lượng/thiết bị; danh sách bài dưới | “Start workout”; dữ liệu “Sample workout”; không giả cá nhân hóa |
| Workout | Tên bài, chỉ dẫn ngắn, set hiện tại `1 of 3`, số rep lớn và timer nghỉ | “Finish set”, “Pause”; khi paused đổi “Resume”; “End workout” là hành động riêng |
| Summary | “Workout saved on this device”; số set/thời gian; “Self-reported” | “View progress”; lỗi lưu giữ summary và có Retry, không báo saved trước khi persist |
| Progress | Lịch sử thực từ phiên local, empty state hữu ích | Chưa có lịch sử: “Your first workout starts here”; không seed chart như thành tích thật |

Sơ đồ bố cục text để duyệt, không phải screenshot hoặc UI đã kiểm thử:

```text
TRAIN                         WORKOUT
Train                  [..]   [Back]       Workout       [..]
Ready for a short session?    Bodyweight squat
                             Set 1 of 3        [1][ ][ ]
Sample workout               10 reps
Full-body basics             One short instruction
12 min · No equipment        [ Finish set                 ]
3 exercises                  [ Pause                      ]
[ Start workout           ]  End workout
Exercises...
[Train]          [Progress]
```

Tên bài và con số trong sketch chỉ minh họa layout; nội dung tập cuối phải chọn từ catalog mẫu, không mặc định bài này phù hợp mọi người. Spike chống đẩy tách riêng khỏi buổi demo thông thường.

## Design system tối thiểu

| Vai trò | Đề xuất |
|---|---|
| Light canvas / surface / text | `#F5F3F0` / `#FFFFFF` / `#242424` |
| Primary action / on-action | Coral đậm `#B94736` / `#FFFFFF`; coral nhạt chỉ làm nền phụ |
| Secondary text | `#625E5A`, cần đo trên từng surface |
| Dark palette khi triển khai | Canvas `#1F1D1B`, surface `#2A2724`, text `#F7F4EF`, action `#F28C79`, on-action `#241B18` |
| Type | System font theo OS; body khoảng 17, label 14–16, heading 28–32, rep display 56–72 theo layout; allow font scaling |
| Spacing | Nhịp 4/8; gutter 20, khoảng nhóm 24–32; không ép chiều cao text container |
| Touch | iOS ≥44pt, Android ≥48dp; CTA chính khoảng 52–56, hit area không chồng nhau |
| Icon | Một bộ vector tương thích Expo cho app; back/picker/switch theo native; không dùng package DOM icon của web |
| Motion | Press feedback ngay; set completion đổi trạng thái ngắn; transition shared token; reduced-motion dùng opacity/static |

Tokens TypeScript có semantic roles `surface`, `textPrimary`, `action`, `onAction`, `warning`, `error`; không tạo framework token ba tầng cho mọi component từ ngày đầu. Một nguồn token cho các màn. Dark palette chưa coi là đạt vì chưa render/contrast audit; demo ưu tiên light rõ ràng, không để OS tự invert thành dark lỗi.

Đã tính contrast tĩnh theo relative luminance sRGB: text/canvas 14.02:1, secondary/canvas 5.80:1, white/coral action 5.23:1; dark text/canvas 15.32:1 và dark on-action/coral 7.07:1. Đây là kiểm tra cặp màu đề xuất, chưa kiểm tra UI render, opacity, disabled/error hoặc nền camera.

## Bencho và tương tác

Đã xem [Bencho](https://bencho.dev/), [Progress tracker](https://bencho.dev/blocks/progress-tracker), [Jelly tabs](https://bencho.dev/blocks/jelly-tabs) và [trang licence](https://bencho.dev/licence). Công cụ đọc trang licence chỉ trả tiêu đề, chưa đọc được điều khoản cấp phép; **chưa xác minh quyền sao chép source**. Chỉ dùng ý tưởng phản hồi trạng thái, không chép code/asset. Không kết luận MIT.

Chuyển ý tưởng sang native: tap cho selected/pressed state; vạch set đổi màu và check khi hoàn tất; haptic tùy chọn đúng một lần theo hành động; không hover, magnetic pointer hoặc jelly bounce lớn làm xao lãng. Animation không chặn touch/Back, không thay đổi số rep khi chỉ animate. `Reduced Motion` vẫn có phản hồi bằng chữ/màu/icon.

## Checklist thiết kế theo phạm vi

- Demo: loading bootstrap, catalog sample rõ; empty history; error/retry persistence; local/offline label; no permission request khi chưa dùng camera. Không giả đang sync nếu không có backend.
- Khi bật camera: giải thích trước prompt; deny có “Continue without camera”; chất lượng thấp ghi “Unable to assess — adjust camera”, không đếm tưởng tượng.
- VoiceOver/TalkBack: label/role/state, focus hợp lý, không đọc timer mỗi giây; báo kết thúc set thay vì spam. Text không bị cắt ở font lớn; không dùng màu duy nhất cho tự khai/verified/error.
- Contrast body ≥4.5:1, large text và meaningful controls ≥3:1; đo palette và trạng thái thực. Safe area, keyboard, Back và orientation không che CTA. Không bắt buộc swipe/drag.
- Review iPhone13 và Android khi có máy; chưa test thì ghi rõ. GĐ6 mở rộng thiết bị, largest text, dark/light và usability nhóm tuổi phù hợp. Không tuyên bố tất cả người lớn tuổi dùng tốt chỉ từ font lớn.
