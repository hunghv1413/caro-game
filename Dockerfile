# Base image nhẹ với Node.js 20 trên nền Alpine Linux
FROM node:20-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Thiết lập biến môi trường
ENV NODE_ENV=production \
    PORT=3000

# Copy file cấu hình package nếu có dependencies
COPY package*.json ./

# Cài đặt production dependencies (nếu có bổ sung sau này)
RUN npm ci --omit=dev || npm install --omit=dev

# Copy toàn bộ mã nguồn của dự án
COPY . .

# Phân quyền cho user non-root 'node' để tăng cường bảo mật
RUN chown -R node:node /app
USER node

# Mở cổng ứng dụng
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["node", "server.js"]
