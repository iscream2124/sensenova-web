// SenseNova Skills Web App
const API_BASE = '';
let tasks = [];

// 로딩 표시
function showLoading(show = true) {
    document.getElementById('overlay').style.display = show ? 'block' : 'none';
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
}

// 진행 상태 업데이트
function updateTaskStatus(taskId, status, progress = 0, message = '', timeRemaining = 0) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = status;
        task.progress = progress;
        task.message = message;
        task.timeRemaining = timeRemaining;
        renderTasks();
    }
}

// 작업 추가
function addTask(taskId, skillName, prompt, startTime) {
    tasks.unshift({
        id: taskId,
        skill: skillName,
        prompt: prompt,
        status: 'processing',
        progress: 0,
        message: '처리 중...',
        timeRemaining: 0,
        startTime: startTime,
        createdAt: new Date().toLocaleTimeString('ko-KR')
    });
    renderTasks();
}

// 남은 시간 계산 (추정)
function estimateTimeRemaining(skillType) {
    const estimates = {
        'infographic': 120,  // 2분
        'ppt': 180,          // 3분
        'analysis': 90,      // 1.5분
        'research': 240      // 4분
    };
    return estimates[skillType] || 120;
}

// 진행률 계산 (시간 기반)
function calculateProgress(elapsed, estimated) {
    return Math.min(100, Math.round((elapsed / estimated) * 100));
}

// 작업 목록 렌더링
function renderTasks() {
    const taskList = document.getElementById('task-list');

    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="text-muted text-center py-3">아직 작업이 없습니다</p>';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong>${getSkillName(task.skill)}</strong>
                    <span class="status-badge ${task.status}">${getStatusText(task.status)}</span>
                </div>
                <small class="text-muted">${task.prompt.substring(0, 50)}...</small>
                <div style="margin-top: 8px;">
                    <div class="progress" style="height: 6px;">
                        <div class="progress-bar" role="progressbar"
                            style="width: ${task.progress}%; background: linear-gradient(90deg, #6366f1, #ec4899);"
                            aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <small style="display: flex; justify-content: space-between; margin-top: 4px; color: #666;">
                        <span>${task.progress}% 완료</span>
                        <span>${task.timeRemaining > 0 ? task.timeRemaining + '초 남음' : '완료'}</span>
                    </small>
                </div>
                <small class="text-muted" style="display: block; margin-top: 4px;">
                    📅 ${task.createdAt} | ${task.message}
                </small>
            </div>
        </div>
    `).join('');
}

function getSkillName(skill) {
    const names = {
        'sn-infographic': '📊 인포그래픽',
        'sn-ppt-entry': '📑 PPT',
        'sn-da-excel-workflow': '📈 데이터 분석',
        'sn-deep-research': '🔬 심층 연구'
    };
    return names[skill] || skill;
}

function getStatusText(status) {
    const texts = {
        'processing': '⏳ 처리 중',
        'completed': '✅ 완료',
        'failed': '❌ 실패',
        'pending': '⏱️ 대기 중'
    };
    return texts[status] || status;
}

// 인포그래픽 생성
async function generateInfographic() {
    const prompt = document.getElementById('infograph-prompt').value;
    const rounds = parseInt(document.getElementById('infograph-rounds').value);
    const mode = document.getElementById('infograph-mode').value;

    if (!prompt.trim()) {
        alert('설명을 입력해주세요');
        return;
    }

    showLoading(true);
    const startTime = Date.now();
    const taskId = `task_${Date.now()}`;

    try {
        const response = await fetch(`${API_BASE}/api/v1/infographic`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_prompt: prompt,
                max_rounds: rounds,
                output_mode: mode
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            addTask(result.task_id, 'sn-infographic', prompt, startTime);

            // 진행 상태 시뮬레이션
            simulateProgress(result.task_id, 'infographic');

            document.getElementById('infograph-result').innerHTML = `
                <div class="result-box success" style="margin-top: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>✅ 요청 완료!</strong>
                            <small style="display: block; color: #666; margin-top: 4px;">
                                Task ID: ${result.task_id}<br/>
                                생성이 진행 중입니다. 아래 '최근 작업 현황'을 확인하세요.
                            </small>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('infograph-prompt').value = '';
        } else {
            throw new Error(result.detail || '요청 실패');
        }
    } catch (error) {
        document.getElementById('infograph-result').innerHTML = `
            <div class="result-box error">
                <strong>❌ 오류 발생</strong>
                <small style="display: block; color: #666; margin-top: 4px;">${error.message}</small>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// 진행 상태 시뮬레이션
function simulateProgress(taskId, skillType) {
    const totalTime = estimateTimeRemaining(skillType);
    let elapsed = 0;
    const interval = setInterval(() => {
        elapsed += 5;  // 5초마다 업데이트
        const progress = calculateProgress(elapsed, totalTime);
        const timeRemaining = Math.max(0, totalTime - elapsed);

        updateTaskStatus(taskId, 'processing', progress, '처리 중...', Math.ceil(timeRemaining));

        if (elapsed >= totalTime) {
            clearInterval(interval);
            updateTaskStatus(taskId, 'completed', 100, '✅ 처리 완료', 0);
        }
    }, 5000);  // 5초마다
}

// PPT 생성
async function generatePPT() {
    const title = document.getElementById('ppt-title').value;
    const content = document.getElementById('ppt-content').value;
    const mode = document.getElementById('ppt-mode').value;
    const pages = parseInt(document.getElementById('ppt-pages').value);

    if (!title.trim() || !content.trim()) {
        alert('제목과 내용을 입력해주세요');
        return;
    }

    showLoading(true);
    const startTime = Date.now();

    try {
        const response = await fetch(`${API_BASE}/api/v1/ppt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                content: content,
                mode: mode,
                page_count: pages
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            addTask(result.task_id, 'sn-ppt-entry', title, startTime);
            simulateProgress(result.task_id, 'ppt');

            document.getElementById('ppt-result').innerHTML = `
                <div class="result-box success">
                    <strong>✅ PPT 생성 요청 완료!</strong>
                    <small style="display: block; color: #666; margin-top: 4px;">
                        작업이 처리 중입니다. '최근 작업 현황'을 확인하세요.
                    </small>
                </div>
            `;
            document.getElementById('ppt-title').value = '';
            document.getElementById('ppt-content').value = '';
        }
    } catch (error) {
        document.getElementById('ppt-result').innerHTML = `
            <div class="result-box error">
                <strong>❌ 오류</strong>
                <small style="display: block; color: #666; margin-top: 4px;">${error.message}</small>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// 데이터 분석
async function analyzeData() {
    const fileInput = document.getElementById('file-input');
    const analysisType = document.getElementById('analysis-type').value;

    if (!fileInput.files.length) {
        alert('파일을 선택해주세요');
        return;
    }

    showLoading(true);
    const startTime = Date.now();

    try {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('analysis_type', analysisType);

        const response = await fetch(`${API_BASE}/api/v1/analysis`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.status === 'success') {
            addTask(result.task_id, 'sn-da-excel-workflow', fileInput.files[0].name, startTime);
            simulateProgress(result.task_id, 'analysis');

            document.getElementById('analysis-result').innerHTML = `
                <div class="result-box success">
                    <strong>✅ 분석 요청 완료!</strong>
                    <small style="display: block; color: #666; margin-top: 4px;">
                        분석이 진행 중입니다.
                    </small>
                </div>
            `;
            document.getElementById('file-input').value = '';
            document.getElementById('file-name').innerHTML = '';
        }
    } catch (error) {
        document.getElementById('analysis-result').innerHTML = `
            <div class="result-box error">
                <strong>❌ 오류</strong>
                <small style="display: block; color: #666; margin-top: 4px;">${error.message}</small>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// 심층 연구
async function deepResearch() {
    const topic = document.getElementById('research-topic').value;
    const dimensions = document.getElementById('research-dimensions').value;

    if (!topic.trim() || !dimensions.trim()) {
        alert('주제와 차원을 입력해주세요');
        return;
    }

    showLoading(true);
    const startTime = Date.now();

    try {
        const response = await fetch(`${API_BASE}/api/v1/research`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: topic,
                dimensions: dimensions.split('\n').filter(d => d.trim()),
                depth_level: document.getElementById('research-depth').value
            })
        });

        const result = await response.json();

        if (result.status === 'success') {
            addTask(result.task_id, 'sn-deep-research', topic, startTime);
            simulateProgress(result.task_id, 'research');

            document.getElementById('research-result').innerHTML = `
                <div class="result-box success">
                    <strong>✅ 연구 요청 완료!</strong>
                    <small style="display: block; color: #666; margin-top: 4px;">
                        심층 연구가 진행 중입니다.
                    </small>
                </div>
            `;
            document.getElementById('research-topic').value = '';
            document.getElementById('research-dimensions').value = '';
        }
    } catch (error) {
        document.getElementById('research-result').innerHTML = `
            <div class="result-box error">
                <strong>❌ 오류</strong>
                <small style="display: block; color: #666; margin-top: 4px;">${error.message}</small>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// 파일 업로드 핸들링
document.addEventListener('DOMContentLoaded', () => {
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('file-input');

    fileUpload?.addEventListener('click', () => fileInput.click());
    fileUpload?.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
    });
    fileUpload?.addEventListener('dragleave', () => {
        fileUpload.classList.remove('dragover');
    });
    fileUpload?.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');
        fileInput.files = e.dataTransfer.files;
        updateFileName();
    });

    fileInput?.addEventListener('change', updateFileName);
});

function updateFileName() {
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    if (fileInput.files.length > 0) {
        fileName.innerHTML = `<span class="badge bg-success">✅ ${fileInput.files[0].name}</span>`;
    }
}
