# SenseNova Skills 웹앱 배포 가이드

## 🚀 배포 옵션

### 1. Railway.app (추천 - 가장 쉬움) ⭐⭐⭐⭐⭐
### 2. Render.com (무료 옵션 있음)
### 3. Heroku 대체 서비스

---

## 🚂 **옵션 1: Railway.app 배포** (권장)

### 단계 1: GitHub 레포지토리 생성

```bash
cd /Users/im_1181/.cokacdir/workspace/t2uu7ari
git init
git add -A
git commit -m "Initial commit: SenseNova Skills Web App"
```

### 단계 2: GitHub에 푸시

```bash
# GitHub에 빈 레포지토리 생성
# https://github.com/new 에서 생성 (예: sensenova-web)

git remote add origin https://github.com/{username}/sensenova-web.git
git branch -M main
git push -u origin main
```

### 단계 3: Railway 계정 생성 및 연결

1. https://railway.app 방문
2. GitHub으로 로그인
3. **New Project** → **Deploy from GitHub repo** 클릭
4. 레포지토리 선택 (sensenova-web)
5. 자동으로 배포 시작

### 단계 4: 환경 변수 설정 (필요시)

Railway 대시보드에서:
- **Variables** 탭 → 환경변수 추가 (현재는 필수 아님)

### 단계 5: 배포 완료

배포 완료 후 제공되는 URL 확인:
```
예: https://sensenova-web-production.up.railway.app
```

---

## 🎨 **옵션 2: Render.com 배포**

### 단계 1: Render 계정 생성

https://render.com 방문 → GitHub으로 로그인

### 단계 2: 새 서비스 생성

1. **New +** → **Web Service**
2. GitHub 레포지토리 연결
3. 설정:
   - **Name**: sensenova-web
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python3 sensenova_api_server.py`

### 단계 3: 배포

자동으로 배포 시작, 완료 후 URL 제공됨

---

## 🐳 **옵션 3: Docker로 배포** (고급)

### Docker 파일 생성

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python3", "sensenova_api_server.py"]
```

### 로컬 테스트

```bash
docker build -t sensenova-web .
docker run -p 8000:8000 sensenova-web
```

### 배포 (AWS, GCP, Azure, etc.)

원하는 클라우드 플랫폼에서 Docker 이미지 배포

---

## 📋 **필수 파일 확인**

```
✅ requirements.txt       - Python 의존성
✅ Procfile              - 배포 설정 (Railway용)
✅ web/index.html        - 웹앱 UI
✅ web/app.js            - 웹앱 로직
✅ sensenova_api_server.py - API 서버
```

---

## ✅ **배포 체크리스트**

- [ ] GitHub 레포지토리 생성
- [ ] 로컬에서 `git init` 실행
- [ ] 모든 파일 커밋
- [ ] GitHub에 푸시
- [ ] Railway/Render 계정 생성
- [ ] GitHub 레포지토리 연결
- [ ] 배포 시작
- [ ] URL에서 접속 확인

---

## 🔗 **배포 후 접속**

### Railway 배포 예시
```
웹앱: https://sensenova-web-production.up.railway.app/
API: https://sensenova-web-production.up.railway.app/api/v1
문서: https://sensenova-web-production.up.railway.app/docs
```

### Render 배포 예시
```
웹앱: https://sensenova-web.onrender.com/
API: https://sensenova-web.onrender.com/api/v1
문서: https://sensenova-web.onrender.com/docs
```

---

## 🌍 **커스텀 도메인 설정**

### Railway에서 커스텀 도메인 추가
1. 프로젝트 설정 → **Domain**
2. 도메인 추가
3. DNS 설정 (레지스트라 제공)

### 추천 도메인 레지스트라
- Namecheap
- GoDaddy
- Route 53 (AWS)

---

## 📊 **모니터링 & 로그**

### Railway 로그 확인
```
대시보드 → Deployments → Logs 탭
```

### Render 로그 확인
```
대시보드 → Logs 섹션
```

### API 상태 확인
```
https://your-deployed-url.com/health
```

---

## 💰 **비용 (2026년 기준)**

| 플랫폼 | 무료 | 유료 시작 | 특징 |
|--------|------|---------|------|
| Railway | - | $5/월 | 빠른 배포, 쉬운 설정 |
| Render | 무료 (제한) | $7/월 | 무료 옵션 있음 |
| AWS | 12개월 | 종량제 | 강력하지만 복잡 |
| Vercel | 무료 | $20/월 | Node.js 최적화 |

---

## 🔐 **보안 권장사항**

### 배포 전 필수
- [ ] 환경 변수 보호 (.env 파일 제외)
- [ ] API 키 숨김
- [ ] 로깅 레벨 조정
- [ ] CORS 설정 검토

### 환경 변수 예시 (Railway)
```
SN_API_KEY=your_api_key
SN_IMAGE_GEN_API_KEY=your_image_api_key
```

---

## 🚨 **배포 후 확인 사항**

1. **웹앱 접속**
   ```
   https://your-url.com/ → 웹앱 로드 확인
   ```

2. **API 작동 확인**
   ```bash
   curl https://your-url.com/health
   ```

3. **스킬 목록 확인**
   ```bash
   curl https://your-url.com/skills
   ```

4. **인포그래픽 테스트**
   ```bash
   curl -X POST https://your-url.com/api/v1/infographic \
     -H "Content-Type: application/json" \
     -d '{"user_prompt":"Test","max_rounds":1}'
   ```

---

## 🆘 **문제 해결**

### 배포 실패
**원인**: requirements.txt 누락 또는 문법 오류
**해결**:
```bash
pip freeze > requirements.txt
# 수동 편집: 필요한 패키지만 포함
```

### 502 Bad Gateway 오류
**원인**: 서버 시작 오류
**해결**: 로그에서 오류 메시지 확인 → 수정 → 재배포

### 느린 로딩
**원인**: 스킬 초기화 시간
**해결**: 
- Railway 유료 플랜으로 업그레이드
- 콜드 스타트 최소화

### API 타임아웃
**원인**: 복잡한 요청 또는 느린 서버
**해결**:
- 요청 복잡도 감소
- 업그레이드 또는 캐싱 추가

---

## 📞 **지원 링크**

- Railway 문서: https://docs.railway.app
- Render 문서: https://render.com/docs
- FastAPI 배포: https://fastapi.tiangolo.com/deployment/
- GitHub Pages: https://pages.github.com

---

## 🎯 **다음 단계**

1. ✅ 레포지토리 생성
2. ✅ Railway/Render 연결
3. ✅ 배포 완료
4. ✅ 커스텀 도메인 설정 (선택)
5. ✅ 모니터링 설정

---

## 📈 **배포 후 최적화**

### 성능 개선
```python
# 캐싱 추가 (app.js)
const cache = {};
```

### 비용 최적화
- 불필요한 스킬 비활성화
- 리소스 풀 최소화

### 안정성 강화
- 에러 핸들링 개선
- 로깅 강화

---

**배포 완료 후 도메인 주소를 공유하시면, 전 세계 누구나 접속할 수 있습니다! 🌍**

최종 업데이트: 2026-05-05
