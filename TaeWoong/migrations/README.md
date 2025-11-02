# Database Migrations

## 마이그레이션 실행 방법

### 1. MySQL에 접속
```bash
mysql -u root -p
```

### 2. 데이터베이스 선택
```sql
USE k_everything_game;
```

### 3. 마이그레이션 파일 실행
```bash
mysql -u root -p k_everything_game < migrations/add_coins_and_purchases.sql
```

또는 MySQL 쉘에서:
```sql
source C:/Users/24457/OneDrive/바탕 화면/ProgateHackathon/TaeWoong/migrations/add_coins_and_purchases.sql;
```

### 4. 변경사항 확인
```sql
DESCRIBE game_progress;
```

예상 출력:
```
+-------------------+--------------+------+-----+-------------------+
| Field             | Type         | Null | Key | Default           |
+-------------------+--------------+------+-----+-------------------+
| id                | int          | NO   | PRI | NULL              |
| user_id           | int          | NO   | MUL | NULL              |
| current_stage     | int          | YES  |     | 1                 |
| unlocked_stages   | json         | YES  |     | NULL              |
| completed_stages  | json         | YES  |     | NULL              |
| player_avatar     | varchar(50)  | YES  |     | 😊                |
| coins             | int          | YES  |     | 0                 |
| purchased_avatars | json         | YES  |     | NULL              |
| updated_at        | timestamp    | YES  |     | CURRENT_TIMESTAMP |
+-------------------+--------------+------+-----+-------------------+
```

## 마이그레이션 내용

### add_coins_and_purchases.sql
- `coins` INT 컬럼 추가: 플레이어가 보유한 코인 저장
- `purchased_avatars` JSON 컬럼 추가: 플레이어가 구매한 아바타 목록 저장
- 기존 데이터에 기본값 설정
- 성능 최적화를 위한 인덱스 추가

## 롤백 (필요시)

마이그레이션을 되돌리려면:
```sql
ALTER TABLE game_progress DROP COLUMN purchased_avatars;
ALTER TABLE game_progress DROP COLUMN coins;
```

## 주의사항

- 마이그레이션 전에 반드시 데이터베이스 백업을 수행하세요
- 프로덕션 환경에서는 먼저 테스트 환경에서 마이그레이션을 실행하고 확인하세요
