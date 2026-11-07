# 9 Ball Pool production

Trong thư mục D:\ANT_1\GAME\pool-9-ball-main chạy:

    docker compose up -d --build

Mở http://localhost:11726/ để kiểm tra. Production dùng https://9ball.antfootage.net/.
Domain chỉ hoạt động sau khi trỏ DNS A/AAAA về server và cấu hình HTTPS reverse proxy. Mẫu Caddy ở deploy/Caddyfile chạy trên host. Nếu dùng proxy trong Docker, đặt cùng Docker network và proxy tới game:8080 thay cho 127.0.0.1.

Routes:
- /: mở thẳng game toàn màn hình (SEO meta trong head, không landing page).
- /embed: game tràn khung, cho phép iframe từ mọi domain (Content-Security-Policy: frame-ancestors *, X-Robots-Tag: noindex, follow, không có X-Frame-Options). /embed/ chuyển hướng 308 về /embed (giữ query).
- /9-ball-pool/: file tĩnh của game (PlayCanvas, Ammo wasm, texture, âm thanh).
- /seo/9-ball-pool-og.png: ảnh chia sẻ 1200x630; /seo/9-ball-pool-icon.png: icon.
- /robots.txt, /sitemap.xml, /healthz.

Mã nhúng:

    <iframe src="https://9ball.antfootage.net/embed?lang=vi" title="9 Ball Pool" width="960" height="540" style="width:100%;aspect-ratio:16/9;height:auto;border:0" allow="autoplay;fullscreen;gamepad" allowfullscreen loading="lazy"></iframe>

Game dùng FILL_WINDOW của PlayCanvas nên tự lấp đầy mọi kích thước khung; khung ngang 16:9 là đẹp nhất, khung dọc tự chuyển sang bố cục portrait của game.

Ngôn ngữ:
- Tham số URL ?lang=vi hoặc ?lang=en. Mặc định tiếng Việt; không bao giờ dùng ngôn ngữ trình duyệt.
- Trang cha đổi ngôn ngữ trực tiếp, không tải lại: iframe.contentWindow.postMessage({ type: 'ant-play:locale', locale: 'en' }, '*').
- deploy/public/9-ball-pool/ant-i18n.js dịch text PlayCanvas (thông báo lỗi, lượt, tạm dừng...) và vẽ lại các texture có chữ tiếng Anh (Tap to play, Cues & Tables, Ready? Go!, Pause menu, Total score, How to play, Extra time...). Font Cubano gốc (MSDF) chỉ có ký tự ASCII nên chữ tiếng Việt dùng font Paytone One và Josefin Sans đóng gói sẵn trong 9-ball-pool/fonts (SIL OFL, kèm file giấy phép). Logo "9 Ball Pool" giữ nguyên.

Proxy/CDN phía trước không được thêm X-Frame-Options DENY/SAMEORIGIN hoặc CSP frame-ancestors 'self' cho route embed. CORS không cần để nhúng iframe. Trang cha có CSP phải cho phép https://9ball.antfootage.net trong frame-src.

SITE_URL là origin công khai cho canonical, Open Graph và sitemap; thay trong .env rồi docker compose up -d. Không đặt đường dẫn hoặc dấu / cuối. APP_PORT mặc định 11726, bind loopback cho reverse proxy. Đổi BIND_ADDRESS=0.0.0.0 nếu cần truy cập trực tiếp từ mạng.

Bản production là file tĩnh, không gọi Poki hay bất kỳ host bên ngoài nào và không tải bù 404 từ Internet. Đã kiểm tra đủ 374 file trong download-manifest.json và toàn bộ asset trong config.json đều có sẵn. local-sdk.js thay SDK quảng cáo Poki: không có quảng cáo, commercial break kết thúc ngay; rewarded break được tính là đã xem nên phần thưởng trong game (thêm giờ, x2 xu) được cấp ngay. config.json bản production bỏ externalScripts trỏ tới SDK Poki; manifest.json không còn được tham chiếu. Game không có kiểm tra hostname/site-lock. Bản tải gốc và công cụ chạy local (START.cmd, nginx.conf, runtime/) vẫn giữ nguyên trong www/.

embed-focus.js đưa focus bàn phím vào khung game khi người chơi bấm hoặc chạm. Không thêm header Cross-Origin-Embedder-Policy yêu cầu CORP vì có thể ngăn nhúng chéo domain.

## Deploy HTTPS bằng Docker Caddy
Trên server đã trỏ DNS 9ball.antfootage.net về đúng IP, mở cổng 80/443 rồi chạy:

    docker compose -f compose.yaml -f compose.production.yaml up -d --build

Caddy tự cấp/gia hạn HTTPS và proxy tới game:8080 trong cùng Docker network. Nếu server đã dùng Nginx Proxy Manager/Traefik/Caddy khác, chỉ chạy compose.yaml và cấu hình proxy hiện có tới cổng 11726; không chạy thêm Caddy chiếm cổng 80/443.

Kiểm tra sau deploy:

    curl -I https://9ball.antfootage.net/embed

Phải có Content-Security-Policy: frame-ancestors * và X-Robots-Tag: noindex, follow. Sau đó mở trang webgame và bấm Play now.
