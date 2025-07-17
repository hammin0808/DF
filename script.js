// ✅ 스튜디오 문 좌표
const doorPoints = {
  
  'studio-212': {x:10,y:6}, 
  'studio-211': {x:10,y:16}, 
  'studio-210': {x:10,y:26},
  'studio-29': {x:10,y:36},
  'studio-equipment': {x:10,y:46}, 
  'studio-28': {x:10,y:56},  
  'studio-makeup': {x:10,y:66}, 
  
  'studio-21': {x:38,y:6}, 
  'studio-22': {x:38,y:16},
  'studio-props': {x:38,y:26},
  'studio-df': {x:10,y:82}, 
  'studio-14': { x:44, y:84 },
  'studio-27': {x:31,y:82},


  'studio-23': {x:48,y:46}, 
  'studio-24': {x:62,y:46},
  'studio-25': {x:76,y:46},
  'studio-26': {x:90,y:46},

  'studio-11': {x:62,y:70}, 
  'studio-12': {x:76,y:68}, 
  'studio-13': {x:90,y:68},
  
  'studio-youtube': {x:92,y:82}
};


// ✅ 복도 노드 좌표
const hallPoints = {
  // 세로 라인 (왼쪽)
  'hall-node-1':  {x:23,y:5},
  'hall-node-2':  {x:23,y:15},
  'hall-node-3':  {x:23,y:25},
  'hall-node-4':  {x:23,y:35},
  'hall-node-5':  {x:23,y:45},
  'hall-node-6':  {x:23,y:55},
  'hall-node-7':  {x:23,y:65},

  // 가로 연결부
  'hall-node-8':  {x:33,y:75},
  'hall-node-9':  {x:44,y:75},
  'hall-node-22': {x:56,y:75},
  'hall-node-19': {x:68,y:75},
  'hall-node-20': {x:80,y:75},

  // 세로로 내려가는 우측 연결
  'hall-node-11': {x:33,y:65},
  'hall-node-16': {x:33,y:55},
  'hall-node-12': {x:44,y:55},
  'hall-node-13': {x:56,y:55},
  'hall-node-14': {x:68,y:55},
  'hall-node-15': {x:80,y:55},

  // 하단쪽
  'hall-node-17': {x:44,y:65},
  'hall-node-18': {x:56,y:85},
  'hall-node-21': {x:68,y:85},

  // 스튜디오 #1-4 전용 노드
  'hall-node-23': {x:44,y:80},

  // 필요시 추가
  'hall-node-10': {x:20,y:75}
};




// ✅ 실제 연결 그래프 (도면 기반)
// hallGraph 그대로 유지, 기존 복도 연결 전체
const hallGraph = {
  'hall-node-1': ['hall-node-2'],
  'hall-node-2': ['hall-node-1','hall-node-3'],
  'hall-node-3': ['hall-node-2','hall-node-4'],
  'hall-node-4': ['hall-node-3','hall-node-5'],
  'hall-node-5': ['hall-node-4','hall-node-6'],
  'hall-node-6': ['hall-node-5','hall-node-7','hall-node-16','hall-node-9'],

  'hall-node-7': ['hall-node-6', 'hall-node-11'],
  'hall-node-8':['hall-node-11'],
  'hall-node-16': ['hall-node-6','hall-node-11','hall-node-12'],
  'hall-node-11': ['hall-node-16','hall-node-17'],
  'hall-node-12': ['hall-node-16','hall-node-13'],
  'hall-node-13': ['hall-node-12','hall-node-14'],
  'hall-node-14': ['hall-node-13','hall-node-15'],
  'hall-node-15': ['hall-node-14'],
  'hall-node-17': ['hall-node-11','hall-node-22'],
  'hall-node-18': ['hall-node-22','hall-node-21'],
  'hall-node-19': ['hall-node-20', 'hall-node-22'],

  'hall-node-20': ['hall-node-19'],

  'hall-node-22': ['hall-node-20', 'hall-node-17', 'hall-node-19'],

  'hall-node-23': ['hall-node-9'],
'hall-node-9': ['hall-node-8','hall-node-6','hall-node-17','hall-node-22','hall-node-23']
};


// ✅ 반드시 경유할 노드
const MANDATORY_1 = 'hall-node-22';
const MANDATORY_2 = 'hall-node-19';

// 상태
let startNode = null, endNode = null;
const studios = document.querySelectorAll('.studio');
const locationName = document.getElementById('currentLocationName');
const btn = document.getElementById('startNavBtn');
const svg = document.getElementById('pathOverlay');

// 스튜디오 클릭
studios.forEach(studio => {
  studio.addEventListener('click', () => {
    const id = studio.dataset.id;
    if (studio.classList.contains('selected')) {
      studio.classList.remove('selected');
      if (startNode === id) startNode = null;
      else if (endNode === id) endNode = null;
      updateBtn();
      return;
    }
    if (!startNode) {
      startNode = id;
      studio.classList.add('selected');
      locationName.textContent = studio.textContent;
      updateBtn();
    } else if (!endNode && id !== startNode) {
      endNode = id;
      studio.classList.add('selected');
      updateBtn();
    }
  });
});

// 버튼 상태 갱신
function updateBtn() {
  if (startNode && endNode) {
    btn.disabled = false;
    btn.classList.add('enabled');
    btn.textContent = '경로 안내 시작';
  } else {
    btn.disabled = true;
    btn.classList.remove('enabled');
    btn.textContent = '목적지를 선택해주세요';
    svg.innerHTML = '';
  }
}

// 색상 구분
function getStudioColor(studioId) {
  const el = document.querySelector(`.studio[data-id="${studioId}"]`);
  return el.classList.contains('blue') ? 'blue' : 'orange';
}

// BFS 탐색
function bfsHalls(startId, endId) {
  let q = [[startId]];
  let visited = new Set([startId]);
  while (q.length > 0) {
    const path = q.shift();
    const cur = path[path.length - 1];
    if (cur === endId) return path;
    (hallGraph[cur] || []).forEach(next => {
      if (!visited.has(next)) {
        visited.add(next);
        q.push([...path, next]);
      }
    });
  }
  return [];
}

// 경로 그리기
function drawAnimated(path) {
  svg.innerHTML = '';
  for (let i = 1; i < path.length; i++) {
    const [x1, y1] = path[i-1];
    const [x2, y2] = path[i];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1 + '%');
    line.setAttribute('y1', y1 + '%');
    line.setAttribute('x2', x2 + '%');
    line.setAttribute('y2', y2 + '%');
    line.setAttribute('stroke', '#e74c3c');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-dasharray', '300');
    line.setAttribute('stroke-dashoffset', '300');
    line.style.animation = `drawLine 0.3s linear forwards ${i * 0.05}s`;
    svg.appendChild(line);
  }
}

// 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `@keyframes drawLine{to{stroke-dashoffset:0;}}`;
document.head.appendChild(style);

// 스튜디오에서 가장 가까운 복도 노드 찾기
function findNearestHall(studioPoint) {
  let nearestId = null;
  let minDist = Infinity;
  for (const [hid, hp] of Object.entries(hallPoints)) {
    const dx = studioPoint.x - hp.x;
    const dy = studioPoint.y - hp.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d < minDist) {
      minDist = d;
      nearestId = hid;
    }
  }
  return { id: nearestId, point: hallPoints[nearestId] };
}

// 경로 계산 버튼
btn.addEventListener('click', () => {
  if (startNode && endNode) {
    const startPoint = doorPoints[startNode];
    const endPoint = doorPoints[endNode];
    const startNearest = findNearestHall(startPoint);
    const endNearest = findNearestHall(endPoint);

    // 🚀 MANDATORY 강제 경유 제거
    const hallPathIds = bfsHalls(startNearest.id, endNearest.id);

    const fullPath = [
      [startPoint.x, startPoint.y],
      [startNearest.point.x, startNearest.point.y],
      ...hallPathIds.map(hid => [hallPoints[hid].x, hallPoints[hid].y]),
      [endNearest.point.x, endNearest.point.y],
      [endPoint.x, endPoint.y]
    ];

    drawAnimated(fullPath);
  }
});



// ✅ URL 쿼리스트링에서 current 파라미터 읽기
const params = new URLSearchParams(window.location.search);
const currentParam = params.get('current'); // ex) studio-212

if (currentParam) {
  // studios가 렌더링된 후에 선택 표시가 가능하므로 fetch 이후에 처리
  // fetch 완료 이후 렌더링이 끝났을 때 실행되도록 약간 지연
  setTimeout(() => {
    const studioEl = document.querySelector(`.studio[data-id="${currentParam}"]`);
    if (studioEl) {
      // startNode 로 설정
      startNode = currentParam;
      studioEl.classList.add('selected');
      locationName.textContent = currentParam;
      updateBtn();
    }
  }, 500); // 데이터 렌더링 후를 위해 약간 딜레이
}

// QR코드로 접속 시 studio 파라미터로 자동 하이라이트 및 현재 위치 설정 (setTimeout으로 DOM 렌더 이후 실행)
window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const studio = params.get('studio');
  if (studio) {
    // "2-11" → "studio-211" 등으로 변환
    let studioId = `studio-${studio.replace('-', '')}`;
    // 기존 선택 해제
    document.querySelectorAll('.studio.selected').forEach(el => el.classList.remove('selected'));
    const el = document.querySelector(`.studio[data-id="${studioId}"]`);
    if (el) {
      el.classList.add('selected');
      // 항상 새로 가져오기
      const locationName = document.getElementById('currentLocationName');
      if (locationName) {
        locationName.textContent = el.textContent.trim();
      }
      startNode = studioId;
      updateBtn();
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};
