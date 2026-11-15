// 문제 해결·일하는 방식·성장·기록·그 외 프로젝트. 근거: docs/interview-notes.md D35~D38, 10월 포트폴리오의 학력·교육·자격
window.PORTFOLIO.debug = [
  {
    id: "veriorder-gmail", project: "veriorder", title: "시험 메일로는 되던 흐름이 실제 Gmail에서 멈췄다",
    result: { value: "17개", label: "버그를 고치기 전에 먼저 쓴 실패 시험" },
    easy: "연습용 편지는 잘 배달됐는데, 진짜 우편함에서 온 편지는 보낸 사람이 장부에 없어 멈춘 상황이었어요.",
    steps: ["시험 메일(.eml)로는 끝까지 되던 흐름이 실제 Gmail로 받자 승인·합의·챗봇에서 멈춤", "팀 DB를 읽기만 해서 확인: 거래처를 발신 주소로만 찾는데 실제 보낸 주소가 등록돼 있지 않았음", "처음 보는 발신자를 거래처로 등록하고, 챗봇은 메일 주소로도 거래처를 찾게 함", "실패하는 시험 17개를 먼저 쓰고 고쳐 통과, 배포 앱에서 끝까지 동작 확인"],
  },
  {
    id: "agentpool-format", project: "agentpool", title: "30B 모델이 형식을 벗어나도 멈추지 않게",
    result: { value: "3노드", label: "Planner · 도구 실행 · 최종 답 분리" },
    easy: "말을 조금 다르게 해도 알아듣는 비서처럼, 출력 형식이 흔들려도 다음 행동을 찾게 했어요.",
    steps: ["Planner 출력이 ReAct 형식을 벗어나면 Action 파싱이 실패하고 도구 선택이 멈춤", "생성·실행·종료가 한 흐름에 묶여 어디서 깨졌는지 찾기 어려움", "Action 이름을 부분 문자열로 정규화, 형식이 무너지면 최종 답으로 처리, StateGraph로 노드 분리", "형식 이탈에도 실행이 멈추지 않고, 단계별로 고칠 수 있는 구조"],
  },
  {
    id: "steel-shift", project: "steel", title: "전력을 옮기면 요금은 줄지만 피크는 커졌다",
    result: { value: "629→688 kW", label: "이동 후 최대 수요가 늘어나는 것을 찾아냄" },
    easy: "싼 시간대로 일을 몰았더니 그 시간대가 새로 붐비는 것처럼, 요금은 줄어도 최대 수요는 커질 수 있었어요.",
    steps: ["요금제 비교에서 늘 한 요금제만 가장 싸게 나오고, 부하 이동은 '절감'으로만 표시됨", "기본요금이 빠져 있었고, 옮긴 시간대에 새 피크가 생기는지 보지 않았음", "완전한 월에만 기본요금 포함, 이동 후 최대 수요를 계산해 비용-피크 지도에 표시하고 피크가 늘면 경고", "'비용 절감 ≠ 피크 감소'를 화면에서 바로 보이게 함"],
  },
  {
    id: "steel-timestamp", project: "steel", title: "예측이 15분씩 밀려 보였다",
    result: { value: "8→0건", label: "요금 계산 불일치 (200건 중)" },
    easy: "영수증의 시각이 '끝난 시각'이었는데 '시작 시각'으로 읽어 하루에 한 칸씩 어긋난 상황이었어요.",
    steps: ["예측 그래프가 실측보다 15분씩 밀리고 요금 검산 200건 중 8건이 틀림", "원본 시각이 15분 구간의 시작이 아니라 끝이었음", "구간 시작·종료를 명시하는 인계 규격을 만들고 15분 경계가 아닌 값을 거부", "불일치 0건, 팀 전체 학습 데이터의 기준으로 공유"],
  },
  {
    id: "steel-chatbot", project: "steel", title: "챗봇이 숫자를 지어낼 수 있었다",
    result: { value: "33/33", label: "Gemini 켬·끔 모두 시험 통과" },
    easy: "질문은 통역사가 알아듣고, 숫자는 계산기만 말하게 나눴어요.",
    steps: ["LLM이 전력량·요금을 직접 말하면 대시보드와 다른 숫자가 나올 위험, Gemini 404·402 실패", "LLM에게 계산까지 맡긴 구조와 외부 API 한 곳에 기대는 구조", "LLM은 의도와 파라미터만, 숫자는 허용된 계산 함수 6개에서만, 실패하면 규칙 기반으로 전환", "답변 수치가 대시보드와 일치, API가 실패해도 1초 안에 응답"],
  },
  {
    id: "noti-hallucination", project: "noti", title: "챗봇이 공지에 없는 내용을 지어낼 수 있었다",
    result: { value: "3분류", label: "NORMAL · MISSING · IRRELEVANT" },
    easy: "모르는 걸 아는 척하지 않고, 모르면 담당자에게 물어보라고 연결해 주게 했어요.",
    steps: ["LLM이 업무와 무관하거나 공지에 없는 답을 만들 위험", "답변의 근거가 공지에 있는지 구분하지 않았음", "응답을 세 가지로 분류하고 MISSING이면 담당자 문의로 자동 연결", "근거 없는 답 대신 문의로 이어지는 흐름"],
  },
  {
    id: "tw-mobile-auth", project: "tw-mobile", title: "일부 요청에서만 401·403이 났다",
    result: { value: "1곳", label: "인증 헤더를 넣는 곳을 하나로" },
    easy: "출입증을 사람마다 챙기다 빠뜨리던 걸, 문에서 자동으로 붙여 주게 바꿨어요.",
    steps: ["앱의 일부 요청에서만 인증 오류(401·403)", "요청마다 Authorization 헤더를 따로 넣다 빠지는 곳이 생김", "토큰을 저장하고 AuthInterceptor가 모든 요청에 Bearer 헤더를 넣게 함", "인증이 한 흐름이 되어 장애 지점이 줄어듦"],
  },
  {
    id: "veriorder-mail-purpose", project: "veriorder", title: "승인 안내를 부탁했는데 질문 메일이 나왔다",
    result: { value: "목적 3종", label: "안내 · 반려 · 질문 메일로 나눠 작성" },
    easy: "무엇을 부탁하든 '확인 부탁드립니다'만 쓰던 비서에게 편지의 목적부터 읽게 한 것이에요.",
    steps: ["\"승인되었다고 메일 보내려는데 초안 작성해줘\"에 \"주문 확인 요청드립니다\"라는 질문 메일이 나옴", "초안 작성 지시문이 '질문 메일 초안'으로 고정돼 요청 목적을 보지 않음", "요청에서 목적을 읽어 승인·처리는 안내 메일 · 반려는 정중한 안내 · 값 확인은 질문 메일로 작성", "실제 모델로 \"주문 승인 안내\" 초안 확인과 검토 규칙 통과 (PR #210)"],
  },
  {
    id: "contest-admin-guard", project: "contest", title: "주소만 알면 관리자 화면이 열렸다",
    result: { value: "2중", label: "화면과 서버 양쪽에서 역할 확인" },
    easy: "건물 입구에서 출입증만 보고 층별 권한은 안 보던 것을, 층마다 한 번 더 확인하게 바꾼 것이에요.",
    steps: ["일반 사용자도 /admin 주소를 직접 치면 관리자 화면에 들어갈 수 있었음", "ProtectedRoute가 로그인 여부만 보고 역할은 보지 않음", "관리자 화면 5개에 requiredRole=ADMIN 적용 · 서버 관리자 API에 @admin_required · 결과 API에 @jwt_required", "화면과 서버 양쪽에서 역할을 확인하는 이중 권한 검사"],
  },
  {
    id: "contest-oracle-env", project: "contest", title: "PC마다 Oracle Client 경로가 달랐다",
    result: { value: "1벌", label: "같은 코드로 개발 PC와 운영 서버 연결" },
    easy: "집마다 열쇠 보관 위치가 달라 문을 못 열던 것을, 열쇠 위치를 메모로 적어 두고 그 메모부터 읽게 한 것이에요.",
    steps: ["다른 PC와 운영 서버에서 사내 Oracle 9.2 연결 실패", "Oracle Client(thick 모드) 경로를 코드에 박아 두었고 환경변수 파일이 DB 설정보다 늦게 읽힘", "경로를 ORACLE_CLIENT_DIR 환경변수로 옮기고 .env를 가장 먼저 읽게 함 · 맞지 않는 threaded 옵션 제거", "같은 코드로 개발 PC와 운영 서버 모두 사내 인사 DB에 연결"],
  },
];

window.PORTFOLIO.build = {
  thesis: "AI가 알아서 짜는 게 아닙니다. 제가 정한 규칙과 문서 안에서 AI가 선택지·초안·시험을 빠르게 만들고, 결정은 제가 합니다.",
  steps: [
    { name: "문제 정의", skill: "grilling · domain-modeling", desc: "인터뷰로 결정을 하나씩 확정하고 용어를 정리" },
    { name: "사용자 여정", skill: "mapping-user-journey", desc: "누가 어떤 장면에서 무엇을 하려는지" },
    { name: "정보 구조", skill: "information-architecture", desc: "메뉴·화면·흐름과 ID" },
    { name: "요구사항", skill: "prd", desc: "문제 → 목표 → 기능 → 화면을 잇는 PRD" },
    { name: "데이터 설계", skill: "designing-erd", desc: "DB가 있을 때만 ERD와 접근 규칙" },
    { name: "Intent → Spec · Plan", skill: "writing-intent · writing-spec-and-plan", desc: "무엇을·왜와 어떻게를 나눠 쓰고 승인받은 뒤 개발" },
    { name: "구현", skill: "시험 먼저", desc: "실패하는 시험 → 구현 → 통과, 파일 300줄·함수 40줄 상한" },
    { name: "QA", skill: "running-qa", desc: "사용자 시나리오로 직접 실행하고 못 한 것은 No Run으로 기록" },
  ],
  principles: [
    { title: "하네스", desc: "CLAUDE.md·규칙·스킬을 전역에 깔아 두고 모든 프로젝트에서 같은 순서로 일합니다.", without: "없으면 매번 무엇부터 할지 헤맨다" },
    { title: "문서 먼저", desc: "결정·근거·계획을 파일로 남겨 세션이 바뀌어도 이어서 구현합니다.", without: "없으면 세션이 바뀔 때 전부 잊는다" },
    { title: "시험 먼저", desc: "실패하는 시험을 쓰고 확인한 뒤 구현합니다. 업무 규칙은 DB·네트워크 없이 시험합니다.", without: "없으면 틀린 것이 완료로 보고된다" },
    { title: "미검증은 미검증으로", desc: "실제로 돌린 것만 통과로 적고, 가상 자료로 잰 값을 현업 성과로 쓰지 않습니다.", without: "없으면 못 본 것이 사실처럼 굳는다" },
  ],
  cases: [
    { project: "veriorder", title: "VeriOrder: Claude Code를 팀원처럼, 팀 규칙 안에서", items: ["팀 규칙(CLAUDE.md): 브랜치·PR·머지 규칙, 파일 300줄 상한, 계획 승인 뒤 코드 작성", "키·개인정보 규칙: 키는 서버 환경변수에만, AI에는 가상 자료만, 커밋 전 검사", "팀 스킬: PRD·IA·사용자 여정 작성 스킬을 팀 규칙에 맞게 고쳐 씀", "사람의 리뷰: 작성자가 아닌 팀원이 PR을 보고 머지, AI가 혼자 머지하지 않음"] },
    { project: null, title: "이 포트폴리오: 인터뷰 → 문서 → 시험 → 구현", items: ["인터뷰로 결정 51건을 기록하고 사실은 원본 자료와 대조", "Spec·Plan을 승인받은 뒤 구현", "전화번호·특정 표기가 없는지, 숫자마다 근거 배지가 있는지 시험으로 검사"] },
  ],
};

window.PORTFOLIO.story = [
  { period: "2024.03 – 2024.09", stage: "교육", title: "부산IT교육센터 · AI 기반 스마트 제조공정 빅데이터 분석 시스템개발 (900시간)", desc: "Python과 딥러닝, 웹 개발을 처음부터 배웠습니다." },
  { period: "2024.10 – 2024.11", stage: "배포", title: "ToolWithMe 웹", desc: "Spring Boot와 Django 추론 서버를 나눠 만들고 AWS에 배포했습니다." },
  { period: "2024.11 – 2025.02", stage: "출시", title: "ToolWithMe 모바일", desc: "같은 서비스를 Android 앱으로 옮겨 Google Play에 출시했습니다." },
  { period: "2025.03 – 2026.02", stage: "교육", title: "한국폴리텍대학 하이테크과정 (1200시간)", desc: "인공지능소프트웨어 직종을 수료했습니다." },
  { period: "2025.04 – 2025.06", stage: "분석", title: "경상남도 빅데이터 분석 공모전", desc: "산불 데이터로 위험도를 계산하고 방재설비 입지를 골랐습니다." },
  { period: "2025.09 – 2025.11", stage: "교육", title: "ICT 이노베이션스퀘어 · LangChain과 멀티 에이전트 (80시간)", desc: "LLM 에이전트와 서비스 배포를 배웠습니다." },
  { period: "2025.11 – 2026.01", stage: "에이전트", title: "AgentPool", desc: "LangGraph로 질문에 맞는 도구를 고르는 에이전트를 만들었습니다." },
  { period: "2025.12 – 2026.01", stage: "현업 PoC", title: "NotiGuard · 코멘토 × 효성전기", desc: "임직원 73명 설문으로 공지 누락 문제를 정의하고 RAG 챗봇으로 검증했습니다." },
  { period: "2026.04 – 2026.07", stage: "현업", title: "효성전기 DAX실", desc: "13개 현업 부서의 업무 프로세스를 분석해 AI 적용 과제 6건을 도출하고 PoC까지 구체화했습니다. 사내 AI 경진대회 시스템을 만들어 운영했습니다." },
  { period: "2026.08 – 2026.11", stage: "제조 AX", title: "LS JUMP-UP 부트캠프 (550시간)", desc: "제조 데이터 분석과 LLM 업무 도구를 팀 프로젝트로 만들었습니다." },
];

window.PORTFOLIO.records = {
  career: [{ period: "2026.04 – 2026.07", name: "효성전기 DAX실", desc: "AX 과제 발굴, PoC 제작, 생성형 AI 도입 검토, 사내 경진대회 시스템 개발·운영" }],
  education: [
    { period: "2026.08 – 2026.11", name: "LS JUMP-UP 부트캠프 (LS그룹 · K-뉴딜 아카데미)" },
    { period: "2025.03 – 2026.02", name: "한국폴리텍대학 소프트웨어융합과 인공지능소프트웨어직종 하이테크과정 수료" },
    { period: "2025.09 – 2025.11", name: "LangChain과 멀티 에이전트를 활용한 AI 서비스 배포 (수도권 ICT 이노베이션스퀘어)" },
    { period: "2024.03 – 2024.09", name: "AI 기반 스마트 제조공정 빅데이터 분석 시스템개발 (부산인재개발원 부산IT교육센터)" },
    { period: "2016.03 – 2020.02", name: "동의과학대학교 기계공학과 졸업" },
  ],
  certs: [
    { date: "2026.11", name: "Microsoft AI-901" }, { date: "2025.12", name: "AICE Associate" }, { date: "2025.09", name: "정보처리산업기사" },
    { date: "2025.09", name: "사무자동화산업기사" }, { date: "2025.08", name: "AI 프롬프트활용능력 1급" },
    { date: "2025.07", name: "정보처리기능사" }, { date: "2025.04", name: "데이터분석 준전문가 (ADsP)" },
    { date: "2025.04", name: "SQL 개발자 (SQLD)" },
  ],
  awards: [{ date: "2019.11", name: "캡스톤 디자인 경진대회 은상", desc: "Arduino 드론으로 오일펜스를 투하하는 프로젝트, 팀장 · PID 제어 코딩" }],
  skills: [
    { group: "AI · LLM", items: ["Python", "PyTorch", "LangGraph", "LangChain", "RAG", "ReAct", "Claude API", "HuggingFace Transformers"] },
    { group: "데이터", items: ["Pandas", "scikit-learn", "XGBoost · LightGBM", "LSTM · TCN", "Dash · Plotly"] },
    { group: "웹 · 앱", items: ["Django", "React", "Next.js", "Spring Boot", "Streamlit", "Android (Kotlin)"] },
    { group: "DB · 인프라", items: ["Oracle", "PostgreSQL · Supabase", "MySQL", "MariaDB", "AWS EC2", "Vercel", "Git"] },
    { group: "AI 협업 개발", items: ["Claude Code", "CLAUDE.md 하네스", "Agent Skills"] },
  ],
};

window.PORTFOLIO.others = [
  { projectId: "okm" },
  { projectId: "gyeongnam" },
  { name: "Oil Fence Drone", kind: "캡스톤 디자인 경진대회 · 팀장", period: "2019.06 – 2019.11", easy: "Arduino 드론으로 네오디뮴 자석을 단 오일펜스를 해양 사고 지점에 투하하는 프로젝트", result: "은상 · PID 제어 알고리즘 직접 코딩", links: [{ label: "상장", url: "https://drive.google.com/file/d/1zgEqxT2LQe3ZWpknxCevAJ4MlbpSDCir/view?usp=sharing" }] },
];
