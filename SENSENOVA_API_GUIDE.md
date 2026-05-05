# SenseNova-Skills REST API 가이드

## 🚀 서버 시작

```bash
cd /Users/im_1181/.cokacdir/workspace/t2uu7ari
source sensenova_env/bin/activate
python3 sensenova_api_server.py 8001
```

**서버 접속:**
- Root: http://localhost:8001/
- Swagger UI (대화형 API 문서): http://localhost:8001/docs
- ReDoc (읽기 전용 문서): http://localhost:8001/redoc

---

## 📋 API 엔드포인트

### 1. 기본 정보

#### GET `/`
서버 정보 및 사용 가능한 엔드포인트 목록

```bash
curl http://localhost:8001/
```

응답 예시:
```json
{
  "service": "SenseNova-Skills REST API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "skills": "GET /skills",
    "infographic": "POST /api/v1/infographic",
    "ppt": "POST /api/v1/ppt",
    "analysis": "POST /api/v1/analysis",
    "research": "POST /api/v1/research"
  }
}
```

### 2. 서버 상태 확인

#### GET `/health`
서버 상태 및 설정 확인

```bash
curl http://localhost:8001/health
```

응답 예시:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "skills_path": "/tmp/SenseNova-Skills",
  "available": true
}
```

### 3. 스킬 목록 조회

#### GET `/skills`
설치된 모든 스킬 목록

```bash
curl http://localhost:8001/skills
```

응답 예시:
```json
{
  "available_skills": [
    "sn-infographic",
    "sn-ppt-entry",
    "sn-da-excel-workflow",
    "sn-deep-research",
    ...
  ],
  "total_count": 23
}
```

#### GET `/api/v1/skill/{skill_name}`
특정 스킬의 상세 정보

```bash
curl http://localhost:8001/api/v1/skill/sn-infographic
```

---

## 🎨 인포그래픽 생성

### POST `/api/v1/infographic`

인포그래픽을 생성합니다.

#### 요청 본문
```json
{
  "user_prompt": "AI 시대의 교육 혁신 전략 인포그래픽",
  "max_rounds": 1,
  "output_mode": "friendly",
  "prompts_expand_mode": "auto"
}
```

#### 파라미터 설명
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `user_prompt` | string | **필수** | 생성할 인포그래픽의 설명 |
| `max_rounds` | integer | 1 | 생성 라운드 수 (품질 향상) |
| `output_mode` | string | friendly | 출력 모드: `friendly` (간단), `verbose` (상세) |
| `prompts_expand_mode` | string | auto | 프롬프트 확장: `auto`, `force`, `disable` |

#### 사용 예시
```bash
curl -X POST http://localhost:8001/api/v1/infographic \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "한국 교육 시장 현황 분석",
    "max_rounds": 2,
    "output_mode": "friendly",
    "prompts_expand_mode": "auto"
  }'
```

#### 응답 예시
```json
{
  "status": "success",
  "task_id": "20260505_213045_a1b2c3d4",
  "message": "Infographic generation queued: 한국 교육 시장 현황 분석...",
  "image_path": null,
  "metadata": {
    "max_rounds": 2,
    "mode": "friendly",
    "prompt_len": 25
  }
}
```

---

## 📊 PPT 생성

### POST `/api/v1/ppt`

프레젠테이션(PowerPoint)을 생성합니다.

#### 요청 본문
```json
{
  "title": "AI 시대의 교육 기술 혁신",
  "content": "# 소개\n이 프레젠테이션은...\n\n## 주요 내용\n1. 현황\n2. 전략\n3. 실행 계획",
  "mode": "standard",
  "page_count": 10,
  "style": "professional"
}
```

#### 파라미터 설명
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `title` | string | **필수** | 프레젠테이션 제목 |
| `content` | string | **필수** | 프레젠테이션 내용 (마크다운 형식) |
| `mode` | string | standard | 생성 모드: `creative` (이미지 중심), `standard` (텍스트 중심) |
| `page_count` | integer | 5 | 예상 슬라이드 수 |
| `style` | string | null | 스타일 (선택사항) |

#### 사용 예시
```bash
curl -X POST http://localhost:8001/api/v1/ppt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2024 교육 전략 보고서",
    "content": "# 개요\n교육 시장 분석\n\n## 목표\n학생 성과 향상",
    "mode": "standard",
    "page_count": 8
  }'
```

#### 응답 예시
```json
{
  "status": "success",
  "task_id": "20260505_213045_x9y8z7w6",
  "message": "PPT generation queued for '2024 교육 전략 보고서'",
  "pptx_path": null
}
```

---

## 📈 데이터 분석

### POST `/api/v1/analysis`

Excel, CSV 등 데이터 파일을 분석합니다.

#### 요청 형식
```bash
curl -X POST http://localhost:8001/api/v1/analysis \
  -F "file=@/path/to/data.xlsx" \
  -F "analysis_type=detailed"
```

#### 파라미터 설명
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `file` | file | **필수** | 분석할 파일 (Excel, CSV) |
| `analysis_type` | string | summary | 분석 유형: `summary` (요약), `detailed` (상세), `export` (내보내기) |

#### 사용 예시
```bash
# 파일 업로드 및 분석
curl -X POST http://localhost:8001/api/v1/analysis \
  -F "file=@sales_data.xlsx" \
  -F "analysis_type=detailed"
```

#### 응답 예시
```json
{
  "status": "success",
  "task_id": "20260505_213045_m5n4o3p2",
  "message": "Data analysis queued for sales_data.xlsx",
  "file_name": "sales_data.xlsx",
  "analysis_type": "detailed"
}
```

---

## 🔬 심층 연구

### POST `/api/v1/research`

주제에 대해 다각적인 심층 연구를 수행합니다.

#### 요청 본문
```json
{
  "topic": "AI 시대 교육 기술의 미래",
  "dimensions": [
    "기술 동향",
    "시장 현황",
    "교육 효과",
    "과제 및 기회"
  ],
  "depth_level": "standard"
}
```

#### 파라미터 설명
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `topic` | string | **필수** | 연구 주제 |
| `dimensions` | array | **필수** | 연구 차원 리스트 |
| `depth_level` | string | standard | 깊이 수준: `brief` (간단), `standard` (표준), `deep` (심화) |

#### 사용 예시
```bash
curl -X POST http://localhost:8001/api/v1/research \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "한국 에드테크 시장 분석",
    "dimensions": [
      "시장 규모 및 성장률",
      "주요 플레이어",
      "기술 트렌드",
      "투자 현황"
    ],
    "depth_level": "standard"
  }'
```

#### 응답 예시
```json
{
  "status": "success",
  "task_id": "20260505_213045_q1r2s3t4",
  "message": "Deep research queued for '한국 에드테크 시장 분석'",
  "dimensions_count": 4,
  "depth": "standard"
}
```

---

## 📤 작업 상태 및 출력 조회

### GET `/api/v1/status/{task_id}`

작업 상태를 조회합니다.

```bash
curl http://localhost:8001/api/v1/status/20260505_213045_a1b2c3d4
```

응답 예시:
```json
{
  "task_id": "20260505_213045_a1b2c3d4",
  "status": "pending",
  "progress": 0,
  "message": "Task status tracking coming soon"
}
```

### GET `/api/v1/outputs`

생성된 파일 목록을 조회합니다.

```bash
curl http://localhost:8001/api/v1/outputs
```

응답 예시:
```json
{
  "total": 5,
  "outputs": [
    {
      "filename": "infographic_20260505_213045.png",
      "size": 2048576,
      "created": "2026-05-05T21:30:45"
    },
    ...
  ]
}
```

---

## 🛠️ Python 클라이언트 예시

### 설치
```bash
pip install requests
```

### 코드 예시

```python
import requests
import json

BASE_URL = "http://localhost:8001"

# 1. 서버 상태 확인
response = requests.get(f"{BASE_URL}/health")
print("Server Status:", response.json())

# 2. 스킬 목록 조회
response = requests.get(f"{BASE_URL}/skills")
print("Available Skills:", response.json()['total_count'])

# 3. 인포그래픽 생성
payload = {
    "user_prompt": "AI 교육 기술 혁신 인포그래픽",
    "max_rounds": 1,
    "output_mode": "friendly"
}
response = requests.post(f"{BASE_URL}/api/v1/infographic", json=payload)
result = response.json()
print(f"Task ID: {result['task_id']}")
print(f"Status: {result['status']}")

# 4. 데이터 분석
files = {'file': open('data.xlsx', 'rb')}
data = {'analysis_type': 'detailed'}
response = requests.post(f"{BASE_URL}/api/v1/analysis", files=files, data=data)
print("Analysis Result:", response.json())

# 5. 심층 연구
payload = {
    "topic": "에드테크 시장",
    "dimensions": ["시장 규모", "기술 트렌드", "경쟁 구도"],
    "depth_level": "standard"
}
response = requests.post(f"{BASE_URL}/api/v1/research", json=payload)
print("Research Result:", response.json())
```

---

## 🔗 JavaScript/Node.js 클라이언트 예시

```javascript
const BASE_URL = 'http://localhost:8001';

// 1. 인포그래픽 생성
async function generateInfographic() {
  const response = await fetch(`${BASE_URL}/api/v1/infographic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_prompt: 'AI 교육 혁신 인포그래픽',
      max_rounds: 1,
      output_mode: 'friendly'
    })
  });
  const result = await response.json();
  console.log('Task ID:', result.task_id);
  return result;
}

// 2. PPT 생성
async function generatePPT() {
  const response = await fetch(`${BASE_URL}/api/v1/ppt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: '교육 기술 보고서',
      content: '# 개요\n주요 내용',
      mode: 'standard',
      page_count: 8
    })
  });
  return await response.json();
}

// 3. 스킬 목록 조회
async function listSkills() {
  const response = await fetch(`${BASE_URL}/skills`);
  const result = await response.json();
  console.log(`Available skills: ${result.total_count}`);
  return result;
}
```

---

## 📌 주요 스킬별 설명

### 이미지/시각화 (Image & Visualization)
- `sn-infographic`: 📊 인포그래픽 생성
- `sn-image-base`: 🖼️ 이미지 생성/인식 기본 (Tier 0)
- `sn-image-doctor`: 🔧 환경 검증
- `sn-image-imitate`: 🎨 이미지 모방/스타일 변환
- `sn-image-resume`: 📄 이력서 이미지 생성

### 프레젠테이션 (PPT)
- `sn-ppt-entry`: 🎯 PPT 생성 진입점 (통합)
- `sn-ppt-creative`: 🎨 창작 모드 (이미지 중심)
- `sn-ppt-standard`: 📐 표준 모드 (텍스트 중심)
- `sn-ppt-doctor`: 🔧 환경 검증

### 데이터 분석 (Data Analysis)
- `sn-da-excel-workflow`: 📊 Excel 분석 (통합)
- `sn-da-image-caption`: 📸 이미지 데이터 추출
- `sn-da-large-file-analysis`: 📈 대용량 파일 분석

### 검색 (Search)
- `sn-search-academic`: 🎓 학술 검색 (ArXiv, PubMed 등)
- `sn-search-code`: 💻 개발자 검색 (GitHub, Stack Overflow 등)
- `sn-search-social-en`: 🌐 영어 소셜 검색 (Reddit, Twitter, YouTube)
- `sn-search-social-cn`: 🇨🇳 중국어 소셜 검색 (Bilibili, Zhihu 등)

### 심층 연구 (Deep Research)
- `sn-deep-research`: 🔬 심층 연구 (통합)
- `sn-research-planning`: 📋 연구 계획
- `sn-dimension-research`: 🔍 차원별 연구
- `sn-research-synthesis`: 🧩 종합 분석
- `sn-research-report`: 📝 최종 보고서 작성

---

## 🎯 사용 시나리오

### 시나리오 1: 교육 전략 보고서 작성
```bash
# 1단계: 데이터 분석
curl -X POST http://localhost:8001/api/v1/analysis \
  -F "file=@education_data.xlsx" \
  -F "analysis_type=detailed"

# 2단계: 심층 연구
curl -X POST http://localhost:8001/api/v1/research \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "한국 교육 시장",
    "dimensions": ["시장 규모", "기술 트렌드", "경쟁 구도"],
    "depth_level": "standard"
  }'

# 3단계: 프레젠테이션 생성
curl -X POST http://localhost:8001/api/v1/ppt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "한국 교육 시장 분석 보고서",
    "content": "# 요약\n시장 현황...",
    "mode": "standard",
    "page_count": 12
  }'
```

### 시나리오 2: 마케팅 자료 제작
```bash
# 1단계: 인포그래픽 생성
curl -X POST http://localhost:8001/api/v1/infographic \
  -H "Content-Type: application/json" \
  -d '{
    "user_prompt": "2024 교육 기술 트렌드 인포그래픽",
    "max_rounds": 2,
    "output_mode": "friendly"
  }'

# 2단계: PPT 생성 (이미지 중심)
curl -X POST http://localhost:8001/api/v1/ppt \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI 교육 기술 소개",
    "content": "우리의 혁신 기술...",
    "mode": "creative"
  }'
```

---

## 🔐 보안 및 주의사항

- 현재 버전은 **인증 없음** (개발/테스트용)
- 프로덕션 배포 전 다음 추가 필요:
  - API 키 인증
  - Rate Limiting
  - HTTPS/SSL
  - CORS 설정
  - 입력 검증 강화

---

## 📚 더 알아보기

- **공식 문서**: https://github.com/OpenSenseNova/SenseNova-Skills
- **API 문서**: http://localhost:8001/docs (Swagger UI)
- **설치 가이드**: `/tmp/SenseNova-Skills/INSTALL.md`

---

## 💡 팁

1. **Swagger UI 활용**: http://localhost:8001/docs에서 직접 API 테스트 가능
2. **로그 확인**: `tail -f sensenova_api.log`
3. **포트 변경**: `python3 sensenova_api_server.py 9000`
4. **백그라운드 실행**: 마지막에 `&` 추가 후 `nohup` 사용 권장

---

**최종 업데이트**: 2026-05-05
