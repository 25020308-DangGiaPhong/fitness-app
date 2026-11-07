# Spike chống đẩy trên điện thoại

Tổng hợp phân tích AI Engineer ngày 2026-11-07. **Protocol chưa chạy; mọi ngưỡng dưới đây là mục tiêu đề xuất, không phải kết quả đo.**

## Kết luận và stack ứng viên

Khả thi để thử đếm rep trong điều kiện kiểm soát. Chưa đủ bằng chứng hứa tương thích, phản hồi kỹ thuật đáng tin hoặc chống gian lận. GĐ1 cần development build có native code; Expo Go chỉ dùng cho app shell không import native pose. [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)

Ứng viên đầu: VisionCamera 5.2.4 + MediaPipe Pose Landmarker Lite, adapter native mỏng, API app chỉ nhận landmark/confidence/timestamp. VisionCamera V5 dùng `useFrameOutput`, không ghép code V4 `useFrameProcessor`. Nitro, camera-worklets và react-native-worklets phải pin theo bộ đã build được; devDependency của thư viện không phải ma trận chứng nhận Expo. [Release V5.2.4](https://github.com/margelo/react-native-vision-camera/releases/tag/v5.2.4), [Frame Output](https://visioncamera.margelo.com/docs/frame-output)

MediaPipe có 33 landmark/live stream native; Android API24+, iOS15+ theo docs engine, nhưng app phải đáp ứng mức tối thiểu cao hơn của Expo/native dependencies. iOS docs hiện dùng SPM, nên tích hợp build/config plugin là một giả định cần thử. [Pose](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker), [Android setup](https://developers.google.com/edge/mediapipe/solutions/setup_android), [iOS setup](https://developers.google.com/edge/mediapipe/solutions/setup_ios)

ML Kit là fallback sau khi chứng minh tích hợp MediaPipe bị chặn, không cài cả hai từ đầu. Pose vẫn beta, hạn chế bảo đảm tương thích và cần mặt hiện diện; phải thử riêng góc chống đẩy. [ML Kit](https://developers.google.com/ml-kit/vision/pose-detection)

License đã xem: camera và camera-worklets tại tag 5.2.4 khai MIT; MediaPipe repo và model card BlazePose GHUM khai Apache 2.0. Trước tích hợp phải lưu version/checksum model và notices toàn bộ dependency resolve; ML Kit chịu terms riêng, không suy từ sample Apache. [Camera package](https://raw.githubusercontent.com/margelo/react-native-vision-camera/v5.2.4/packages/react-native-vision-camera/package.json), [worklets package](https://raw.githubusercontent.com/margelo/react-native-vision-camera/v5.2.4/packages/react-native-vision-camera-worklets/package.json), [MediaPipe license](https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE), [model card](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf), [ML Kit terms](https://developers.google.com/ml-kit/terms)

## Pipeline tối giản

Camera cố định, một người, góc nghiêng bên, toàn thân với vai–khuỷu–cổ tay–hông–gối–cổ chân nhìn rõ. Preview mục tiêu 30fps, inference khởi đầu 10–15fps. Frame native/worklet → chuẩn hóa orientation/crop/mirror → engine → keypoint và timestamp → bộ đếm → UI. Không chuyển ảnh base64 qua JS, không inference trên JS render thread.

Một inference đang chạy; bỏ frame cũ thay vì xếp queue tăng latency; giải phóng buffer đúng vòng đời. Adapter engine không biết XP, user profile hay leaderboard. Bộ đếm có state `ready → down → up → rep`, hysteresis, thời gian tối thiểu và kết hợp góc khuỷu/chuyển động thân. Ngưỡng tune trên calibration set rồi khóa trước evaluation.

Thiếu landmark, đổi người, frame quá cũ hoặc sai góc: dừng đếm ngay khi không đủ điều kiện; sau tối đa 500ms mất liên tục hủy chu kỳ dở và trở lại ready. Không nối rep qua mất tracking, không kết luận “sai tư thế” từ việc không nhìn rõ. Pause/background dừng camera và hủy chu kỳ dở; resume yêu cầu reacquire.

Không cần mic, video upload hoặc backend cho spike. Frame chỉ trong RAM. Log kỹ thuật pseudonymous chứa phiên, build/model/config, timestamp và kết quả. Video tham chiếu chỉ khi người tham gia đồng ý riêng, lưu ngoài Git/analytics với truy cập hạn chế; đề xuất xóa sau chấm nhãn trong 7 ngày, thời hạn phải được chấp thuận trước thu.

## Cổng thử nghiệm theo quy mô

**A — GĐ1, chứng minh tích hợp:** ít nhất một iPhone và một Android model/OS đã ghi nhận. Build sạch, install, mở camera, infer offline, rotate/mirror, deny/grant permission và background/resume đều qua. Không có thiết bị thì trạng thái “chưa xác minh”, không gọi là pass.

**B — GĐ1, pilot nhỏ:** 4 người trưởng thành tự nguyện × 2 điện thoại × 3 phiên ngắn (24 phiên, tối đa 10 rep/phiên; có nghỉ, dừng khi khó chịu). Hai người calibration, hai người held-out. Phiên chuẩn, chậm/nhanh và lệch góc/ánh sáng phân bổ cân bằng. Thêm mỗi máy 6 ca âm tính 60 giây: không người, plank, nửa biên độ, rời/che khung rồi trở lại, hai người, camera nhìn video phát lại. Đây chỉ là cổng chọn kỹ thuật, không chứng minh accuracy cho toàn bộ người dùng hoặc người cao tuổi.

**C — trước GĐ5 mở rộng:** protocol AI Engineer đề xuất 12 người trưởng thành × 3 máy × 2 phiên = 72 phiên, mỗi phiên tối đa 10 rep; 4 người calibration, 8 held-out, không chia frame cùng người giữa hai tập. Có Android yếu nhất dự định hỗ trợ, Android tầm trung/mới và iPhone. Đa dạng vóc dáng, trang phục, ánh sáng, kinh nghiệm; thống kê nhóm tự nguyện, không suy thuộc tính từ ảnh. Phải bổ sung mẫu phù hợp người lớn tuổi và quy trình riêng cho 15–17 tuổi trước tuyên bố hỗ trợ các nhóm đó.

Ground truth B/C: hai người chấm độc lập không nhìn kết quả app, rubric định trước, đồng bộ thời gian và giải quyết bất đồng. So khớp rep event một-một ±500ms; không chỉ so tổng đếm vì lỗi thừa/thiếu có thể triệt tiêu. Không có video đồng ý thì ghi rõ ground truth trực tiếp kém mạnh hơn, không nâng mức tuyên bố.

## Gate pass/fail đề xuất

| Hạng mục | Ngưỡng | Cách đo |
|---|---|---|
| Rep trong điều kiện hỗ trợ | Precision và recall ≥95%; ≥90% phiên lệch ≤1/10 rep | Báo từng máy/người/điều kiện, khoảng bất định theo phiên |
| Availability | ≥90% thời gian chuẩn có tín hiệu dùng được | Không đạt bằng cách luôn từ chối đánh giá |
| Mất tracking | Ngừng đếm ≤500ms, không nối chu kỳ; 0 rep giả ở ca không người/plank | Timeline và quan sát độc lập |
| Latency | Capture→landmark p95 ≤200ms | Log capture/inference/callback; log UI riêng |
| FPS | Inference ≥10 và preview ≥24 trong ≥95% cửa sổ 1 giây | Không dùng FPS trung bình che stall |
| Bền | Không crash/hang; 5 phút cuối giảm inference FPS ≤20% so đầu và vẫn đạt latency | Bài test liên tục 15 phút |
| Pin/nhiệt | Median ≤8 điểm % pin/15 phút; thêm ≤4 điểm % so camera-only; không cảnh báo thermal serious/critical | Mỗi máy 3 lượt pose + 3 lượt camera-only, brightness/pin/môi trường tương đương, không sạc, nghỉ nguội |

Dùng build tối ưu có instrumentation cho benchmark; development build để debug. Battery gauge có sai số, nhiệt pin Android không phải nhiệt SoC. Báo sai số và tỷ lệ từ chối từng nhóm; chênh >10 điểm % là tín hiệu cần điều tra, mẫu nhỏ không đủ kết luận công bằng. Không yêu cầu người tập chống đẩy liên tục 15 phút: bài đo bền dùng chu kỳ hoạt động/nghỉ có người theo dõi hoặc fixture thử riêng, ghi đúng điều kiện.

Pass A/B chỉ cho phép tiếp tục phát triển trên **đúng thiết bị/góc/điều kiện thử**. Fail thì tối ưu, thu hẹp phạm vi hoặc giữ ghi rep thủ công; không đổi ngưỡng sau khi xem test để tuyên bố pass. Các số ngưỡng có thể được duyệt lại trước một vòng test mới.

## Ba loại kết luận độc lập

| Năng lực | Camera có thể hỗ trợ | Không chứng minh |
|---|---|---|
| Rep | Chuỗi xuống–lên theo rubric | Rep đạt mọi chuẩn kỹ thuật |
| Feedback | Biên độ/nhịp/đường thân trong góc đã thử | An toàn khớp, tải trọng, chẩn đoán hoặc kỹ thuật mọi góc |
| Verification | Tóm tắt tín hiệu quan sát mà client báo | Liveness, danh tính hoặc dữ liệu không bị sửa |

Mỗi câu feedback cần nhãn chuyên môn riêng và evaluation held-out riêng (mục tiêu precision ≥90%, recall ≥80%, đủ số trường hợp dương/âm được công bố). Không đủ dữ liệu thì giữ tắt; không lấy rep accuracy thay thế. Confidence landmark không phải xác suất tập đúng. [Hạn chế model](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20BlazePose%20GHUM%203D.pdf)

**No-go hiện tại cho verified competition:** video replay, giả landmarks, sửa count/timestamp/model version và client mod có thể vượt pose. Hash/chữ ký bằng secret nhúng trong app không chứng minh sự thật. App/device attestation chỉ là tín hiệu bổ sung; không xác nhận người thật đang tập. [Play Integrity](https://developer.android.com/google/play/integrity/overview)

GĐ5 phải thử gửi lại evidence, chuyển sang session/tài khoản khác, expired challenge, synthetic landmarks, video replay và client đã sửa. T0 tự khai chỉ XP cá nhân theo trần; T1 camera-assisted vẫn không có điểm thi đấu; T2 đủ điều kiện board rủi ro thấp chỉ sau policy server + thử nghiệm; T3 giải thưởng cần trọng tài/ban tổ chức và bằng chứng bổ sung, cơ chế tranh chấp. Nếu không chặn được replay thì không tự nâng T1 lên T2/T3.
