# Microservices Demo Project with Node.js and TypeScript

Dự án này triển khai một ứng dụng microservice sử dụng Node.js và TypeScript, bao gồm API Gateway, User Service và Product Service.

## Tổng quan về hệ thống

Hệ thống bao gồm các thành phần chính:

- **API Gateway**: Điểm vào duy nhất cho tất cả các request từ client, chịu trách nhiệm điều hướng các request đến service tương ứng
- **User Service**: Quản lý thông tin người dùng, đăng ký, đăng nhập và xác thực
- **Product Service**: Quản lý thông tin sản phẩm, bao gồm thêm, sửa, xóa và truy vấn

## Yêu cầu

- Node.js (phiên bản >= 16)
- npm hoặc yarn
- MongoDB (cài đặt cục bộ hoặc sử dụng qua Docker)
- Docker & Docker Compose (không bắt buộc)

## Cài đặt và Chạy

### Không sử dụng Docker

1. Clone repository:
```bash
git clone https://github.com/Peterxyjz/nodejs-microservices.git
cd nodejs-microservices
```

2. Cài đặt dependencies cho mỗi service:
```bash
# API Gateway
cd api-gateway
npm install
cd ..

# User Service
cd user-service
npm install
cd ..

# Product Service
cd product-service
npm install
cd ..
```

3. Cấu hình môi trường:
   - Tạo file `.env` trong mỗi thư mục service dựa trên các file `.env.example`

4. Chạy MongoDB cục bộ:
```bash
# Đảm bảo MongoDB đang chạy trên máy của bạn
mongod
```

5. Khởi động các service:
```bash
# Mở 3 terminal khác nhau và chạy các lệnh sau

# Terminal 1 - API Gateway
cd api-gateway
npm run dev

# Terminal 2 - User Service
cd user-service 
npm run dev

# Terminal 3 - Product Service
cd product-service
npm run dev
```

### Sử dụng Docker Compose

1. Clone repository:
```bash
git clone https://github.com/your-username/microservices-demo.git
cd microservices-demo
```

2. Khởi động toàn bộ hệ thống:
```bash
docker-compose up -d
```

3. Dừng hệ thống:
```bash
docker-compose down
```

## Cấu trúc dự án

```
microservices-demo/
│
├── api-gateway/            # API Gateway Service
│   ├── src/                # Source code
│   ├── .env                # Biến môi trường
│   ├── package.json        # Dependencies và scripts
│   ├── tsconfig.json       # Cấu hình TypeScript
│   └── Dockerfile          # Cấu hình Docker
│
├── user-service/           # User Service
│   ├── src/                # Source code
│   │   ├── config/         # Cấu hình
│   │   ├── controllers/    # Xử lý logic
│   │   ├── middleware/     # Middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   ├── .env                # Biến môi trường
│   ├── package.json        # Dependencies và scripts
│   ├── tsconfig.json       # Cấu hình TypeScript
│   └── Dockerfile          # Cấu hình Docker
│
├── product-service/        # Product Service
│   ├── src/                # Source code
│   │   ├── config/         # Cấu hình
│   │   ├── controllers/    # Xử lý logic
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── types/          # TypeScript types
│   ├── .env                # Biến môi trường
│   ├── package.json        # Dependencies và scripts
│   ├── tsconfig.json       # Cấu hình TypeScript
│   └── Dockerfile          # Cấu hình Docker
│
└── docker-compose.yml      # Cấu hình Docker Compose
```

## API Endpoints

### User Service (http://localhost:3000/api/users)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /register | Đăng ký người dùng mới |
| POST | /login | Đăng nhập và lấy token JWT |
| GET | /profile | Lấy thông tin người dùng (cần xác thực) |

### Product Service (http://localhost:3000/api/products)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | / | Lấy tất cả sản phẩm |
| GET | /:id | Lấy sản phẩm theo ID |
| POST | / | Tạo sản phẩm mới |
| PUT | /:id | Cập nhật sản phẩm |
| DELETE | /:id | Xóa sản phẩm |

## Ví dụ sử dụng API

### Đăng ký người dùng mới

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Đăng nhập

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Tạo sản phẩm mới

```bash
# Lưu token từ bước đăng nhập
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Smartphone",
    "description": "Latest model",
    "price": 999.99,
    "category": "Electronics"
  }'
```

## Phát triển

### Biên dịch TypeScript

```bash
# Biên dịch mỗi service
cd api-gateway
npm run build

cd ../user-service
npm run build

cd ../product-service
npm run build
```

### Chạy tests

```bash
# Test mỗi service
cd api-gateway
npm test

cd ../user-service
npm test

cd ../product-service
npm test
```

## Mở rộng hệ thống

Để thêm service mới (ví dụ: Order Service):

1. Tạo thư mục mới: `mkdir order-service`
2. Khởi tạo dự án: `cd order-service && npm init -y`
3. Cài đặt dependencies và thiết lập TypeScript
4. Tạo cấu trúc thư mục tương tự như User/Product Service
5. Thêm cấu hình cho service trong `docker-compose.yml`
6. Thêm route mới trong API Gateway để điều hướng đến Order Service

## Đóng góp

1. Fork dự án
2. Tạo nhánh tính năng (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE).

## Liên hệ

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/microservices-demo](https://github.com/your-username/microservices-demo)
