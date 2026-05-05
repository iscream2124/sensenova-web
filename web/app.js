// SenseNova Skills Web App
const API_BASE = '';
let tasks = [];

// 로딩 표시
function showLoading(show = true) {
    document.getElementById('overlay').style.display = show ? 'block' : 'none';
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
}

// 결과 표시
function showResult(elementId, result, isError = false) {
    const resultDiv = document.getElementById(elementId);
    const statusClass = isError ? 'error' : (result.status === 'success' ? 'success' : 'pending');

    resultDiv.innerHTML = `
        <div class="result-box ${statusClass}">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <p class="mb-2">
                        <strong>상태:</strong>
                        <span class="status-badge ${result.status === 'success' ? 'success' : 'pending'}">
                            ${result.status.toUpperCase()}
                        </span>
                    </p>
                    <p class="mb-2"><strong>메시지:</strong> ${result.message || result.error || ''}</p>
                    ${result.task_id ? `<p class="mb-0"><strong>작업 ID:</strong> <span class="task-id">${result.task_id}</span></p>` : ''}
                </div>
            </div>
        </div>
    `;

    if (result.task_id) {
        addTask({
            id: result.task_id,
            type: elementId.split('-')[0],
            message: result.message,
            status: result.status,
            time: new Date().toLocaleTimeString('ko-KR')
        });
    }
}

// 작업 추가
function addTask(task) {
    tasks.unshift(task);
    updateTaskList();
}

// 작업 목록 업데이트
function updateTaskList() {
    const taskList = document.getElementById('task-list');

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="text-muted text-center py-3">아직 작업이 없습니다</p>';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div>
                <div class="d-flex gap-2 mb-2">
                    <span class="badge bg-primary">${getTaskTypeIcon(task.type)} ${getTaskTypeName(task.type)}</span>
                    <span class="status-badge ${task.status === 'success' ? 'success' : 'pending'}">
                        ${task.status.toUpperCase()}
                    </span>
                </div>
                <p class="mb-1 small">${task.message}</p>
                <p class="mb-0 task-id">${task.id}</p>
            </div>
            <div class="text-end">
                <small class="text-muted">${task.time}</small>
            </div>
        </div>
    `).join('');
}

// 작업 타입 이름
function getTaskTypeName(type) {
    const names = {
        'infograph': '인포그래픽',
        'ppt': 'PPT',
        'analysis': '분석',
        'research': '연구'
    };
    return names[type] || type;
}

// 작업 타입 아이콘
function getTaskTypeIcon(type) {
    const icons = {
        'infograph': '📊',
        'ppt': '📑',
        'analysis': '📈',
        'research': '🔬'
    };
    return icons[type] || '⚙️';
}

// 인포그래픽 생성
async function generateInfographic() {
    const prompt = document.getElementById('infograph-prompt').value;
    const rounds = document.getElementById('infograph-rounds').value;
    const mode = document.getElementById('infograph-mode').value;

    if (!prompt.trim()) {
        alert('설명을 입력해주세요');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/infographic`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_prompt: prompt,
                max_rounds: parseInt(rounds),
                output_mode: mode,
                prompts_expand_mode: 'auto'
            })
        });

        const result = await response.json();
        showResult('infograph-result', result, !response.ok);

        // 입력 초기화
        if (result.status === 'success') {
            document.getElementById('infograph-prompt').value = '';
        }
    } catch (error) {
        showResult('infograph-result', { status: 'error', error: error.message }, true);
    } finally {
        showLoading(false);
    }
}

// PPT 생성
async function generatePPT() {
    const title = document.getElementById('ppt-title').value;
    const content = document.getElementById('ppt-content').value;
    const mode = document.getElementById('ppt-mode').value;
    const pages = document.getElementById('ppt-pages').value;

    if (!title.trim() || !content.trim()) {
        alert('제목과 내용을 입력해주세요');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/ppt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                content: content,
                mode: mode,
                page_count: parseInt(pages)
            })
        });

        const result = await response.json();
        showResult('ppt-result', result, !response.ok);

        if (result.status === 'success') {
            document.getElementById('ppt-title').value = '';
            document.getElementById('ppt-content').value = '';
        }
    } catch (error) {
        showResult('ppt-result', { status: 'error', error: error.message }, true);
    } finally {
        showLoading(false);
    }
}

// 데이터 분석
async function analyzeData() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    const analysisType = document.getElementById('analysis-type').value;

    if (!file) {
        alert('파일을 선택해주세요');
        return;
    }

    showLoading(true);

    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('analysis_type', analysisType);

        const response = await fetch(`${API_BASE}/api/v1/analysis`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        showResult('analysis-result', result, !response.ok);

        if (result.status === 'success') {
            fileInput.value = '';
            document.getElementById('file-name').innerHTML = '';
        }
    } catch (error) {
        showResult('analysis-result', { status: 'error', error: error.message }, true);
    } finally {
        showLoading(false);
    }
}

// 심층 연구
async function deepResearch() {
    const topic = document.getElementById('research-topic').value;
    const dimensionsText = document.getElementById('research-dimensions').value;
    const depth = document.getElementById('research-depth').value;

    if (!topic.trim() || !dimensionsText.trim()) {
        alert('주제와 연구 차원을 입력해주세요');
        return;
    }

    const dimensions = dimensionsText.split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

    if (dimensions.length === 0) {
        alert('최소 하나의 연구 차원을 입력해주세요');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE}/api/v1/research`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: topic,
                dimensions: dimensions,
                depth_level: depth
            })
        });

        const result = await response.json();
        showResult('research-result', result, !response.ok);

        if (result.status === 'success') {
            document.getElementById('research-topic').value = '';
            document.getElementById('research-dimensions').value = '';
        }
    } catch (error) {
        showResult('research-result', { status: 'error', error: error.message }, true);
    } finally {
        showLoading(false);
    }
}

// 파일 드래그 & 드롭
document.addEventListener('DOMContentLoaded', function() {
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('file-input');

    // 파일 선택 처리
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            document.getElementById('file-name').innerHTML = `
                <div class="alert alert-info alert-sm mb-0">
                    <i class="bi bi-check-circle"></i> 선택된 파일: <strong>${file.name}</strong>
                </div>
            `;
        }
    });

    // 드래그 오버
    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    // 드래그 리브
    fileUpload.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });

    // 드롭
    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    });

    // 클릭으로 파일 선택
    fileUpload.addEventListener('click', function() {
        fileInput.click();
    });

    // 스킬 정보 로드
    loadSkillsInfo();
});

// 스킬 정보 로드
async function loadSkillsInfo() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        console.log('✅ API 서버 연결 성공');

        // 서버 상태 표시
        console.log('서버 상태:', data);
    } catch (error) {
        console.error('❌ API 서버 연결 실패:', error);
        showAlert('API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.', 'danger');
    }
}

// 알림 표시
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Enter 키로 생성 가능하도록
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        const active = document.activeElement;
        if (active && active.id === 'infograph-prompt') {
            generateInfographic();
        } else if (active && active.id === 'ppt-content') {
            generatePPT();
        }
    }
});
