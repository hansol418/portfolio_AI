// 교육과정·개인 프로젝트. 근거: docs/interview-notes.md D19~D26·D41·D45, 취업\포트폴리오-AI.pptx, 포트폴리오-AIDeveloper - JYP.pptx
(() => {
  const shot = (id, n, alt, caption, peek) => ({ src: `assets/img/${id}/${String(n).padStart(2, "0")}.webp`, alt, caption, peek: !!peek });
  const twRole = "기획 · 팀장";

  window.PORTFOLIO.projects.push(
    {
      id: "agentpool",
      tier: "featured",
      name: "AgentPool",
      kind: "한국폴리텍대학 하이테크과정 · 2인 팀 · 팀장",
      easy: "질문을 보고 사내 문서를 찾을지 웹을 검색할지 스스로 고른 뒤 답하는 챗봇 에이전트",
      period: "2025.11.10 – 2026.01.05",
      team: "2인 · 팀장",
      contribution: "70%",
      roleLine: "LangGraph 설계 · ReAct Planner · 웹 검색 도구 · 문서 RAG · 모델 서빙",
      metrics: [
        { value: "30B", label: "LLaMA 계열 한국어 모델을 A100에서 서빙", badge: "확인함" },
        { value: "3개", label: "고르는 도구: 내부 문서 검색 · 웹 검색 · 요약", badge: "확인함" },
        { value: "3노드", label: "Planner → 도구 실행 → 최종 답 분리", badge: "확인함" },
      ],
      problem: "질문에 따라 내부 문서를 검색할지 웹을 검색할지 스스로 판단해 답하는 챗봇이 필요했습니다. 그런데 30B급 모델은 ReAct 형식을 벗어난 출력을 내서 도구 선택이 멈출 수 있었습니다.",
      approach: [
        "Planner가 질문을 보고 지식형이면 내부 문서 검색으로, 최신 정보·뉴스성이면 웹 검색으로 경로를 바꾸고, 찾은 내용은 30B 모델이 요약해 답합니다.",
        "JSON을 강제하는 대신 키워드 기반 ReAct 형식과 방어적 파싱으로 출력이 흔들려도 다음 행동을 찾습니다.",
        "Planner·도구 실행·최종 답을 LangGraph 노드로 나눠 단계마다 상태를 쌓습니다.",
      ],
    flow: {
      before: ["질문마다 사내 문서를 볼지 웹을 볼지 직접 골라야 함"],
      steps: [
        { title: "질문", desc: "사용자가 자연어로 물음", actor: "사람" },
        { title: "질문 유형 판단", desc: "Planner가 지식형인지 최신 정보인지 판단", actor: "AI" },
        { title: "도구 실행", desc: "내부 문서 검색 또는 웹 검색", actor: "시스템" },
        { title: "요약해 답변", desc: "30B 모델이 찾은 내용을 요약", actor: "AI" },
      ],
      result: "출력 형식이 흔들려도 멈추지 않고 답하는 에이전트",
    },
      myRole: [
        { kind: "직접 구현", text: "LangGraph StateGraph 설계, ReAct를 30B 모델에 맞게 수정, Planner 추론 구조 분리" },
        { kind: "직접 구현", text: "Serper API 웹 검색 도구, 내부 문서를 찾아 30B 모델로 요약하는 RAG 파이프라인" },
        { kind: "직접 구현", text: "에이전트를 Gradio UI와 연결해 데모로 완성, LoRA 어댑터를 병합한 단일 모델로 서빙" },
      ],
      solve: [
        { title: "모델 출력이 형식을 벗어나면 멈췄다", cause: "Planner 출력이 정해진 형식을 벗어나면 Action 파싱이 실패하고 도구 선택이 중단되는 문제", fix: ["부분 문자열 매칭으로 Action 이름 정규화", "형식이 완전히 무너지면 최종 답으로 처리하는 마지막 방어 로직"], result: "형식 이탈에도 실행이 멈추지 않는 흐름" },
        { title: "추론·실행·종료가 한 흐름에 묶여 있었다", cause: "Planner 생성과 도구 실행과 응답 종료가 한 함수에 엮여 디버깅과 확장이 어려운 구조", fix: ["StateGraph로 planner → tool executor → final 노드를 명시적으로 분리", "노드 사이의 상태 누적"], result: "단계별로 고치고 늘릴 수 있는 구조" },
        { title: "모델 로딩이 경로에 묶여 있었다", cause: "실행 중에 LoRA 어댑터를 붙이는 구조로 인한 모델 경로 의존과 로딩 실패 위험", fix: ["merge_and_unload()로 단일 fp16 모델 생성", "병합한 모델만 서빙"], result: "단순해진 실행 구조와 같은 환경의 재현 가능성" },
      ],
      verify: ["실패 패턴과 출력 안정성을 기록하며 개선을 반복했습니다."],
      tech: ["Python", "LangGraph", "HuggingFace Transformers", "Gradio", "Serper API", "A100"],
      links: [{ label: "GitHub", url: "https://github.com/hansol418/AgentPool_Final" }],
      shots: [
        shot("agentpool", 1, "내부 문서를 검색해 답한 AgentPool 화면", "지식형 질문: 내부 문서 RAG로 답함", true),
        shot("agentpool", 2, "웹 검색 결과를 정리해 답한 AgentPool 화면", "최신 정보 질문: 웹 검색으로 답함", true),
      ],
    },
    {
      id: "tw-web",
      tier: "featured",
      name: "ToolWithMe 웹",
      kind: "공구 이미지 분석 서비스 · 2인 팀 · 팀장 · AWS 배포",
      easy: "공구 사진을 올리면 AI가 공구를 알아보고 설명과 사용법 영상까지 보여 주는 웹 서비스",
      period: "2024.10.01 – 2024.11.15",
      team: "2인 · 팀장",
      contribution: "50%",
      roleLine: "로그인 · 이미지 수집 · ResNet 학습 · Django 추론 서버 · AWS 배포",
      metrics: [
        { value: "AWS", label: "EC2에 배포, 지금도 접속됨", badge: "확인함", note: "2026-11-13 접속 확인" },
        { value: "ResNet-50", label: "공구 이미지 분류 모델", badge: "확인함" },
        { value: "2개 서버", label: "웹(Spring Boot)과 추론(Django) 분리", badge: "확인함" },
      ],
      problem: "공구를 처음 쓰는 사람과 현장 신입 사원은 맞는 공구와 올바른 사용법을 찾기 어렵습니다. 사진 한 장으로 공구를 알아보고 쓰는 법까지 이어 주는 서비스를 만들었습니다.",
      approach: [
        "Spring Boot가 로그인과 화면을 맡고, 이미지 분석은 내부 HTTP로 Django 추론 서버에 맡깁니다.",
        "예측 결과로 DB를 조회해 설명과 YouTube 사용법 영상을 붙여 보여 줍니다.",
      ],
      flow: {
        before: ["맞는 공구와 쓰는 법을 찾기 어려움"],
        steps: [
          { title: "사진 올리기", desc: "사용자가 공구 사진을 올림", actor: "사람" },
          { title: "요청 전달", desc: "Spring Boot가 받아 추론 서버로 넘김", actor: "시스템" },
          { title: "공구 분류", desc: "ResNet-50이 어떤 공구인지 판단", actor: "AI" },
          { title: "설명과 영상", desc: "DB의 설명과 사용법 영상을 붙여 보여 줌", actor: "시스템" },
        ],
        result: "사진 한 장으로 공구 정보와 사용법까지",
      },
      myRole: [
        { kind: "직접 구현", text: "JWT 기반 인증과 카카오 로그인, 공구 상세·커뮤니티·마이페이지" },
        { kind: "직접 구현", text: "Selenium 이미지 수집·전처리, Django REST API 실시간 분류, Spring Boot↔Django 연동" },
        { kind: "함께 구현", text: "PyTorch ResNet 학습·평가(기여 80%), AWS 외부 서버 배포(기여 80%)" },
        { kind: "조율", text: twRole },
      ],
      solve: [
        { title: "AI 추론이 웹 전체를 멈출 수 있었다", cause: "업무 로직과 AI 추론을 한 서버에서 처리할 때 연산 부하와 재배포로 인한 서비스 전체 장애 위험", fix: ["Spring Boot가 요청을 받아 내부 HTTP로 Django 추론 서버 호출", "JSON 응답을 DTO로 고정한 API 계약"], result: "웹으로 번지지 않는 추론 서버 장애와 모델의 독립적인 교체·재학습" },
      ],
      verify: ["AWS 주소에서 로그인 화면까지 열리는 것을 2026-11-13에 확인했습니다."],
      tech: ["Java · Spring Boot", "Python · Django · PyTorch", "MariaDB", "AWS EC2 · Tomcat 10", "Kakao · YouTube API"],
      links: [
        { label: "서비스 (AWS)", url: "http://52.79.99.241:8080/users/login" },
        { label: "GitHub", url: "https://github.com/hansol418/SpringProject3_Refactoring" },
      ],
      shots: [
        shot("tw-web", 1, "ToolWithMe 웹 로그인 화면", "로그인(JWT · 카카오)"),
        shot("tw-web", 2, "ToolWithMe 웹 메인 화면", "메인"),
        shot("tw-web", 3, "망치 사진을 분석한 결과와 YouTube 사용법 영상", "이미지 분석 결과와 사용법 영상", true),
        shot("tw-web", 4, "공구 목록 화면", "공구 목록", true),
        shot("tw-web", 5, "게시판 화면", "게시판"),
        shot("tw-web", 6, "마이페이지 화면", "마이페이지", true),
      ],
    },
    {
      id: "tw-mobile",
      tier: "featured",
      name: "ToolWithMe 모바일",
      kind: "Android 앱 · 2인 팀 · 팀장 · Google Play 출시",
      easy: "카메라로 찍은 공구를 그 자리에서 분석하는 ToolWithMe의 Android 앱",
      period: "2024.11.18 – 2025.02.10",
      team: "2인 · 팀장",
      contribution: "50%",
      roleLine: "JWT 세션 · Retrofit2 연동 · 모바일 UI · Play 출시",
      metrics: [
        { value: "Google Play", label: "테스트 트랙을 거쳐 출시", badge: "확인함", note: "개발자 이한솔, 2026-09-12 업데이트" },
        { value: "10+", label: "다운로드", badge: "확인함", note: "Google Play 표시, 2026-11-13 확인" },
        { value: "1개 DTO", label: "분석 응답 형식 고정 (라벨·설명·영상)", badge: "확인함" },
      ],
      problem: "웹에서 만든 공구 분석을 현장에서 바로 쓰려면 사진을 찍는 그 자리에서 결과가 나와야 했습니다.",
      approach: [
        "앱은 Spring Boot REST API를 Retrofit2로 부르고, 서버가 Django 추론 결과를 받아 돌려줍니다.",
        "카메라나 갤러리에서 고른 사진을 분석해 설명과 사용법 영상을 보여 줍니다.",
      ],
      flow: {
        before: ["현장에서 바로 확인하기 어려움"],
        steps: [
          { title: "카메라로 촬영", desc: "앱에서 공구를 찍거나 갤러리에서 고름", actor: "사람" },
          { title: "인증된 요청", desc: "앱이 토큰을 붙여 서버에 보냄", actor: "시스템" },
          { title: "공구 분류", desc: "서버의 AI가 결과를 돌려줌", actor: "AI" },
          { title: "결과 보기", desc: "설명과 사용법 영상을 앱 화면에", actor: "시스템" },
        ],
        result: "찍은 자리에서 바로 결과 확인",
      },
      myRole: [
        { kind: "직접 구현", text: "JWT 토큰을 담은 API 요청과 로그인 세션 유지, Retrofit2 기반 REST 연동" },
        { kind: "직접 구현", text: "웹의 사용자 기능 페이지를 모바일 UI로 재구성, Google Play Console 테스트 트랙을 거쳐 출시" },
        { kind: "조율", text: twRole },
      ],
      solve: [
        { title: "일부 요청에서 401·403이 났다", cause: "요청마다 따로 넣는 Authorization 헤더 처리로 인한 누락", fix: ["토큰을 SharedPreferences에 저장", "AuthInterceptor로 모든 요청에 Bearer 헤더 자동 주입"], result: "토큰 확보 → 자동 주입 → 요청이 한 흐름이 되어 줄어든 인증 장애 지점" },
        { title: "분석 결과를 읽다가 앱이 예외를 냈다", cause: "라벨·설명·영상 URL이 섞인 응답을 문자열로 처리해 생긴 필드 누락과 타입 불일치", fix: ["PredictionResult DTO로 응답 형식 고정", "Gson으로 타입을 맞춰 역직렬화"], result: "안정된 화면 반영과 DTO 단위로 좁혀진 변경 영향 범위" },
      ],
      verify: ["Google Play 스토어 페이지에서 앱 등록과 다운로드 수를 2026-11-13에 확인했습니다."],
      tech: ["Kotlin", "Android", "Retrofit2", "Gson", "Spring Boot REST API"],
      links: [
        { label: "Google Play", url: "https://play.google.com/store/apps/details?id=com.sylovestp.firebasetest.testspringrestapp" },
        { label: "GitHub", url: "https://github.com/hansol418/AndroidStudioProject3" },
      ],
      shots: [
        ["스플래시 화면", false], ["로그인 화면", false], ["로그인 정보를 잘못 넣었을 때", false], ["회원가입 화면", false],
        ["로그인 성공 화면", false], ["카메라·갤러리로 고른 공구 분석 결과", true], ["공구 리스트", true], ["공구 상세 설명", true],
        ["게시판", false], ["게시글 상세", false], ["마이페이지", false], ["회원정보 변경", false],
      ].map(([caption, peek], i) => shot("tw-mobile", i + 1, `ToolWithMe 앱 ${caption}`, caption, peek)),
    },
    {
      id: "gyeongnam",
      tier: "other",
      name: "산불 데이터로 방재설비 입지 제안",
      kind: "2025 경상남도 빅데이터 분석 공모전 · 1인",
      easy: "산불 빈도와 피해 면적으로 위험 지역을 고르고 방재설비가 가장 넓게 덮는 위치를 계산한 분석",
      period: "2025.04 – 2025.06",
      team: "1인",
      contribution: "100%",
      roleLine: "데이터 수집·전처리 · 위험도 산출 · 군집화 · 입지 선정",
      metrics: [
        { value: "합천군", label: "빈도·피해 면적 복합 점수로 대상지 선정", badge: "확인함" },
        { value: "MCLP", label: "최대 커버리지 입지 모델로 설비 위치 선정", badge: "확인함" },
      ],
      tech: ["Python", "공간 데이터 분석", "군집화", "MCLP"],
      links: [{ label: "분석 보고서", url: "https://drive.google.com/file/d/1bKj_tvNSjBzscl5vp0JY5R8grITMrnhj/view?usp=sharing" }],
      shots: [],
    }
  );
})();
