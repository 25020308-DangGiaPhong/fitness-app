# Kiểm kê môi trường — 2026-11-07

Đây là quan sát từ lệnh thực tế, không phải xác nhận toolchain đã build được app.

## Workspace và công cụ

Git root và cwd đều là `/Users/minh/Projects/fitness-app`. Trước khảo sát chỉ có `.git/`, `.codex/`; nhánh `master` chưa có commit. `.codex/` đang untracked. Không có mã, package.json, backend, database, README, PRODUCT.md, DESIGN.md hoặc AGENTS.md sẵn có. Không tìm thấy AGENTS.md tại `/Users/minh/` và `/Users/minh/Projects/`.

| Công cụ | Kết quả | Hệ quả |
|---|---|---|
| Node | 26.7.0 | Chưa pin runtime; chọn bản LTS patch phù hợp Expo khi bootstrap |
| npm | 11.19.0 | Đề xuất dùng npm, một package-lock.json |
| pnpm | 11.25.0, runtime fallback của Codex | Có lệnh, không chọn làm phụ thuộc môi trường ngầm |
| Yarn / Bun | Không có trong PATH | Không cần cài |
| Git | 2.53.0 | Repo chưa có commit |
| Python | 3.13.7 | Chạy được search của ui-ux-pro-max |
| Xcode | 26.2 (17C52) | Thấp hơn yêu cầu Xcode 26.4+ trong bảng Expo SDK 56–58 hiện hành |
| xcode-select | /Applications/Xcode.app/Contents/Developer | Chưa chứng minh signing/build được |
| Java | 25.0.2 | Chưa kiểm chứng Gradle; React Native khuyến nghị JDK 17 |
| adb / Watchman / Docker / Supabase CLI / EAS CLI | Không có trong PATH | Chưa có bằng chứng Android local build hoặc local Supabase sẵn sàng |

`xcrun devicectl list devices` timeout sau 10 giây. `simctl list devices booted` lỗi CoreSimulatorService và quyền ghi log. Không kết luận không có thiết bị; kết nối máy **chưa xác minh**, không cần sửa host trong Giai đoạn 0. Người dùng sau đó xác nhận iPhone13/iOS18.6, Expo account có sẵn, không Apple Developer trả phí; Android model/OS và signing local chưa xác minh.

Nguồn đối chiếu: [Expo SDK matrix](https://docs.expo.dev/versions/latest/), [React Native environment](https://reactnative.dev/docs/set-up-your-environment), [Node release schedule](https://github.com/nodejs/Release). Node 26 hiện có nhánh LTS, nhưng binary 26.7.0 trên máy phát hành trước mốc chuyển LTS; không tự nâng cấp global.

## Skills

| Đường dẫn dưới ~/.agents/skills | name trong metadata | Trạng thái |
|---|---|---|
| karpathy-guidelines/SKILL.md | karpathy-guidelines | Đọc toàn bộ, áp dụng xuyên suốt |
| chief-of-staff/SKILL.md | chief-of-staff | Đọc toàn bộ, dùng tổng hợp và decision log |
| ui-ux-pro-max/SKILL.md | ui-ux-pro-max | Đọc, chạy design-system search và lọc native |
| impeccable2/SKILL.md | impeccable | Đọc, dùng quy trình planning/native review |
| apple-design/SKILL.md | apple-design | Đọc metadata; chưa cần áp dụng sâu |
| design-system/SKILL.md | design-system | Đọc metadata; chưa cần áp dụng sâu |

Chief of Staff thiếu `context-engine`, `agent-protocol`, `references/routing-matrix.md`, `references/synthesis-framework.md` tại các đường dẫn `.agents/skills` và `.claude/skills` đã kiểm tra; tìm thêm SKILL.md dưới `.agents/skills`, `.codex/skills`, `.claude/skills` không tìm được hai dependency. Dùng nội dung tổng hợp/ưu tiên trong SKILL.md, lấy yêu cầu người dùng làm context và lưu raw/approved trong docs; không chạy board meeting.

`impeccable context` đã chạy một lần nhưng engine 0.1.18 chưa cài; launcher không tạo được cache `~/.impeccable/bin/0.1.18`. Đã dùng fallback đọc context trực tiếp theo skill; không tải binary, đổi global hoặc tạo hook. PRODUCT.md và DESIGN.md ban đầu không tồn tại. Chưa tạo visual contract đã duyệt.

UI search đầu tiên trả pattern landing page “Feature-Rich Showcase”, không phù hợp app. Đã loại bỏ phần web/hover, tìm lại `product: fitness workout mobile` (khớp Fitness/Gym App), và `stack: react-native` (Pressable, accessibility roles, hit area). Chỉ giữ hướng dẫn phù hợp; không persist output tự động thành design system đã chốt.

## Custom agents

Cả ba TOML đọc được, tên metadata khớp role khả dụng: **AI Engineer**, **Code Reviewer**, **Mobile App Builder**. Lượt này chỉ gọi hai role đầu theo thứ tự được phép, read-only. Không gọi Mobile App Builder.

SHA-256 ban đầu để kiểm tra giữ nguyên:

```text
ai-engineer.toml       854b52fdda5aaca460c6cd1a2020ca77acccd5280c2628624dc7e58743652b29
code-reviewer.toml     40e32a1188bb51af8bc5bdfa69341510e8f9c2d331d3ed6b53f25b71c052eeaf
mobile-app-builder.toml cdc2619fa9ff13d26445793e7a73fac54b61b4edfbbc4d0131a0748172cc82a0
```
