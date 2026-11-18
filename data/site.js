// 사이트 기본 정보와 직무 관점. 근거: docs/interview-notes.md D4, D12~D16, D39, D51
window.PORTFOLIO = {
  site: {
    name: "이한솔",
    nameEn: "Lee Hansol",
    url: "https://hansol418.github.io/portfolio_AI/",
    email: "hslee4954@gmail.com",
    github: "https://github.com/hansol418",
    photo: "assets/photo.jpg",
    headline: "현업에 묻고, AI로 풀고, 끝까지 운영합니다.",
    subline: "효성전기 DAX실에서 13개 현업 부서의 업무 프로세스를 분석하여 AI 적용 과제 6건을 도출하고 PoC 단계까지 직접 구체화했습니다. 사내 AI 경진대회 시스템을 개발하여 임직원 약 300명의 인사 DB와 연동하고 실제 사내 대회를 운영했습니다.",
  },
  roles: [
    {
      id: "all",
      label: "전체",
      intro: "기술보다 업무 흐름과 불편을 먼저 묻습니다. AI가 실제로 개입할 지점을 정하고 만든 것이 현업에서 쓰이는지까지 확인합니다.",
      proof: [
        "사내 공지가 읽히지 않는 문제를 임직원 73명 설문으로 정의하고 RAG 챗봇으로 구현하여 정보화팀장 상무이사에게서 도입 검토 의견을 받았습니다.",
        "AI는 읽고 사람이 결정하는 주문 메일 업무 도구를 팀장으로 만들어 배포했습니다.",
        "공구 사진을 AI로 분석하는 ToolWithMe를 웹으로 AWS에 배포하고 Android 앱으로 Google Play에 출시했습니다.",
      ],
      order: ["noti", "contest", "veriorder", "agentpool", "steel", "tw-web", "tw-mobile"],
      debug: ["veriorder-gmail", "agentpool-format", "noti-hallucination"],
    },
    {
      id: "ax",
      label: "AI, AX, 서비스 기획",
      intro: "문제를 먼저 정의하고 AI가 맡을 일과 사람이 결정할 일을 나눠 설계합니다. LLM 에이전트와 RAG를 직접 구현합니다.",
      proof: [
        "LangGraph로 질문에 맞는 도구를 고르는 에이전트를 설계했습니다. LLaMA 계열 30B 한국어 모델을 서빙했습니다.",
        "AI는 읽고 코드는 계산하고 사람이 결정하는 주문 메일 업무 도구를 팀장으로 만들었습니다.",
        "13개 현업 부서의 업무 프로세스를 분석해 AI 적용 과제 6건을 도출하고 PoC까지 구체화했습니다.",
      ],
      order: ["agentpool", "noti", "veriorder", "contest", "tw-web", "tw-mobile"],
      debug: ["agentpool-format", "noti-hallucination", "veriorder-mail-purpose"],
    },
    {
      id: "data",
      label: "데이터 분석",
      intro: "예측 정확도와 함께 현장에서 쓸 수 있는 경보 기준과 비용 영향을 같이 봅니다.",
      proof: [
        "철강 공장 전력 예측 TCN 모델로 기준 모델 대비 RMSE를 20.4% 줄였습니다.",
        "제조데이터 분석 경진대회에 팀장으로 참가해 피크 재현율 98.0%의 경보 모델을 만들었습니다.",
        "공공데이터의 산불 빈도와 피해 면적으로 가중 위험도를 계산하고 군집 분석과 MCLP로 방재설비 위치를 제안했습니다.",
      ],
      order: ["steel", "okm", "gyeongnam"],
      debug: ["steel-shift", "steel-timestamp", "steel-chatbot"],
    },
    {
      id: "sw",
      label: "SW 개발, IT 운영",
      intro: "만든 시스템을 실제로 배포하고 운영합니다. 기존 사내 시스템과 연결하는 일을 피하지 않습니다.",
      proof: [
        "사내 인사 DB와 연동한 접수, 평가 시스템을 만들어 실제 대회에서 운영했습니다.",
        "공구 이미지 분석 서비스 ToolWithMe를 Spring Boot와 Django로 나눠 만들고 AWS에 배포했습니다.",
        "같은 서비스를 Android 앱으로 옮겨 Google Play에 출시했습니다.",
      ],
      order: ["contest", "tw-web", "tw-mobile", "noti"],
      debug: ["contest-admin-guard", "contest-oracle-env", "tw-mobile-auth"],
    },
  ],
  projects: [],
};
