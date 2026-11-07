# Sản phẩm và luồng sử dụng

Trạng thái: yêu cầu đã nhận; các lựa chọn có chữ **đề xuất** chưa được duyệt. Demo hackathon ngày 08/11/2026, chưa phát hành; tên sản phẩm, giờ demo và ngân sách dịch vụ còn mở.

## Cách hiểu sản phẩm

Một ứng dụng giúp người dùng chọn buổi tập phù hợp, tập và nhìn thấy tiến bộ; AI Coach, bạn bè, sự kiện và cơ chế thi đấu mở rộng trải nghiệm đó. Camera là công cụ hỗ trợ tùy chọn. Niềm tin vào dữ liệu phải được thể hiện rõ: tự khai, hỗ trợ bằng camera, được kiểm tra theo chính sách, được ban tổ chức xác nhận là các khái niệm khác nhau.

Đã xác nhận trong lượt khảo sát: UI tiếng Anh; hỗ trợ iPhone và Android vì team dùng cả hai; người dùng chính 15–30 tuổi, người trung niên và cao tuổi cũng sử dụng được. Người dùng có Expo account, dùng iPhone13/iOS18.6 và không có Apple Developer trả phí; Android chưa rõ model. Hướng thị giác đã chọn: nền trung tính, cam san hô, ấm và thân thiện. Đây là hackathon, demo ngày mai 08/11/2026, chưa cần phát hành.

Giả định phạm vi demo: tập tại nhà, điện thoại cá nhân, người trưởng thành trong team làm thử nghiệm kỹ thuật, chưa xử lý thanh toán hoặc trả thưởng thật. Không thu hẹp đối tượng sản phẩm thành 18+; phát hành cho 15–17 tuổi là cổng riêng cần quyết định privacy/AI/community theo thị trường, nguồn chuyên môn và rà soát phù hợp. Không đưa người chưa thành niên vào thử nghiệm camera ban đầu khi chưa có quy trình đồng ý/tham gia phù hợp.

Thành công đầu tiên: người dùng hoàn tất một phiên không cần camera, không mất dữ liệu khi tạm dừng/mở lại, thấy đúng một bản ghi trong lịch sử sau retry. Chưa dùng XP hay AI để che lấp luồng cốt lõi chưa hoàn chỉnh.

## Luồng tập đầu tiên đề xuất

1. Đăng ký/đăng nhập → hồ sơ mục tiêu, trình độ, môn thích, thiết bị, thời gian rảnh và giới hạn vận động tự cung cấp; quyền riêng tư và cho phép AI dùng dữ liệu được tách riêng.
2. Chọn kế hoạch mẫu được ghi nhãn, xem bài tập thật trong catalog cùng hướng dẫn, set/rep/nghỉ/lỗi thường gặp. Bản đầu chọn 3–5 bài đã có nội dung được rà soát, không tự tuyên bố phù hợp người đang đau.
3. Bắt đầu → tập → đánh dấu set, nghỉ, tạm dừng/tiếp tục. Camera mặc định tắt. Trở lại app sau background phải thấy trạng thái rõ ràng.
4. Hoàn tất → xem tóm tắt/chỉnh số tự khai trước gửi → lưu. Nếu offline hiển thị “Đã lưu trên máy — chờ đồng bộ”; nếu lỗi có retry, không dựng thành công giả.
5. Xem lịch sử/tiến độ; badge “Tự khai”. XP chưa triển khai thì không hiển thị số như đã được server cấp. Hủy trước hoàn tất không tạo thành tích; sửa sau hoàn tất có revision, không sửa âm thầm lịch sử điểm.

Giai đoạn 1A demo ngày mai bỏ bước tài khoản/onboarding thật: chỉ diễn tập local bằng dữ liệu mẫu và màn hình đại diện; Giai đoạn 2 mới có luồng này với tài khoản/backend thật. Pose spike được tách 1B, xem timebox trong kế hoạch.

## Luồng bổ sung và ranh giới

| Luồng | Trải nghiệm cần có | Điều kiện mở |
|---|---|---|
| Camera chống đẩy | Giải thích trước xin quyền → hướng dẫn đặt máy → kiểm tra thấy người → đếm/không đủ tin cậy → tóm tắt | Spike thiết bị GĐ1; không bắt buộc cho tập thường |
| AI Coach | Đồng ý phạm vi dữ liệu → hỏi nhu cầu → hỏi thêm khi thiếu/đau → gợi ý tham chiếu catalog → người dùng chọn áp dụng | GĐ4; không tự đổi kế hoạch, không chẩn đoán |
| Sự kiện | Tạo nháp → xem trước → công bố → đăng ký/rút → diễn ra → xác nhận kết quả → đóng hoặc tranh chấp/sửa | GĐ3; vai trò và hạn chót ở server |
| Thử thách bạn bè | Lời mời → chấp nhận → thể lệ cố định → hoạt động đủ điều kiện → xếp hạng → hết kỳ | GĐ3; là loại riêng, không mặc định giải thưởng |
| Giải có giải thưởng | Công bố thể lệ/phần thưởng/ban tổ chức → đăng ký → bằng chứng bổ sung → xác nhận/kháng nghị | Mô tả và xác nhận thủ công trước; trả tiền ngoài scope |
| Quyền riêng tư | Xem/sửa đồng ý, từ chối camera/thông báo, ẩn hồ sơ/thành tích, xóa tài khoản/dữ liệu theo chính sách | Thiết kế ở GĐ2; không upload raw video mặc định |

## Phạm vi dài hạn không được bỏ quên

- Identity/profile: đăng ký, đăng nhập, đăng xuất, hồ sơ, onboarding, privacy/permission.
- Training: catalog lọc nhóm cơ/mục tiêu/độ khó/thiết bị; kế hoạch và lịch; state machine phiên; dữ liệu riêng từng môn; thống kê và thành tích.
- Community: XP, level, badge, bạn bè, thử thách, leaderboard tuần/mùa; sự kiện với thời gian/múi giờ, địa điểm/online, điều kiện, capacity, deadline, thể lệ, giải thưởng và người tổ chức; thông báo thay đổi.
- Intelligence: AI có context được phép, giải thích, validation/fallback; pose keypoint, rep state machine, feedback ngắn, confidence, hướng dẫn đặt máy và đo thiết bị.
- Trust: evidence → verification → ledger → leaderboard; server authority, chống gửi trùng, xử lý offline, audit sửa/hủy/thu hồi và giới hạn chống gian lận.

## AI và nội dung sức khỏe — cổng phát hành

Không viết lời khuyên lâm sàng trong Giai đoạn 0. Giai đoạn 4 cần quy trình có phiên bản: thiếu context → hỏi; mô tả đau/khó chịu → hỏi thông tin cần thiết theo bộ câu hỏi chuyên gia duyệt; dấu hiệu rủi ro → chuyển hướng phù hợp theo nguồn chuyên môn và địa phương; chỉ đề xuất vận động trong phạm vi an toàn đã duyệt. Không tự suy ra diagnosis.

Chủ nội dung/chuyên gia phải chọn nguồn đáng tin, ghi ngày rà soát và duyệt cả prompt, rule, nội dung catalog, câu trả lời mẫu trước phát hành. Chưa có chuyên gia thì giữ nhánh đau/chấn thương tắt hoặc chỉ hiển thị thông báo chuyển hướng đã duyệt; không quảng bá AI như dịch vụ y tế.

Output AI có schema, exercise ID/version, lý do, cường độ và câu hỏi còn thiếu. Server kiểm tra ID tồn tại, equipment, level, giới hạn được cung cấp và chính sách an toàn; output không hợp lệ không xuất hiện như buổi tập. Timeout, rate limit, provider lỗi, thiếu dữ liệu và revoked consent có đường lui rõ; không tự đổi provider hoặc gửi thêm dữ liệu ngoài consent.
