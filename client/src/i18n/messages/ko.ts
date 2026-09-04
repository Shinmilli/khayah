export type NavTopKey = 'khayah' | 'business' | 'support' | 'news'

export type NavLinkKey =
  | 'greeting'
  | 'history'
  | 'location'
  | 'financialReport'
  | 'aboutKhayah'
  | 'ci'
  | 'org'
  | 'domestic'
  | 'domesticEducation'
  | 'overseas'
  | 'overseasEducation'
  | 'overseasHealth'
  | 'advocacy'
  | 'projects'
  | 'supportGuide'
  | 'stories'
  | 'announcements'
  | 'activities'
  | 'newsletter'
  | 'press'
  | 'inquiry'

export type FooterTopLinkKey =
  | 'donate'
  | 'projects'
  | 'location'
  | 'instagram'
  | 'blog'
  | 'kakao'

export type Messages = {
  nav: {
    aria: {
      main: string
      locale: string
      mobileOpen: string
      mobileClose: string
      submenu: (section: string) => string
      subcategory: (section: string) => string
    }
    home: string
    top: Record<NavTopKey, string>
    links: Record<NavLinkKey, string>
  }
  footer: {
    aria: string
    topLinks: Record<FooterTopLinkKey, string>
    contactText: string
    copyright: (year: number) => string
  }
  home: {
    hero: {
      donate: string
      slideLabel: (n: number) => string
      slidesNavAria: string
      bizStrip: string
      bizLabels: string[]
      slides: { alt: string; lines: string[] }[]
    }
    story: {
      aria: string
      title: string
      subtitle: string
      listAria: string
      more: string
      moreAria: (title: string) => string
      controls: string
      prev: string
      next: string
      chip: {
        domestic: string
        overseas: string
        advocacy: string
        support: string
        default: string
      }
    }
    impact: {
      aria: string
      title: string
      subtitle: string
      rotator: string[]
      cardTitle: string
      cardDesc: string
      cta: string
      statsAria: string
      donutAria: (percent: string, label: string) => string
    }
    board: {
      noticeTitle: string
      noticeBadge: string
      moreAria: string
      listAria: string
      loadError: string
      empty: string
      promoTitle: string
      promoError: string
      promoEmpty: string
      watchOnYoutube: string
      promoMoreAria: string
      promoLoading: string
    }
    partners: {
      aria: string
      title: string
      subtitle: string
      controls: string
      prev: string
      next: string
    }
  }
  pages: {
    siteName: string
    defaultTitle: string
    documentTitle: (pageTitle: string) => string
    notFoundTitle: string
    notFoundBody: string
    loading: string
    storyCta: {
      domestic: string
      overseas: string
      advocacy: string
      support: string
    }
    supportGuide: {
      copySuccess: string
      copyFail: string
    }
    financialReport: {
      pageTitle: (year: number) => string
      loading: string
      loadError: string
      loadErrorHint: string
      retry: string
      empty: string
      yearLabel: string
      yearNavNewer: string
      yearNavOlder: string
      balanceSheet: (year: number) => string
      operationsStatement: (year: number) => string
      tablePlaceholderBalance: string
      tablePlaceholderOps: string
      tablePlaceholderHint: string
      actionHometax: string
      actionDonation: string
      actionAcrc: string
      pdfModalTitle: string
      pdfModalBody: string
      pdfModalClose: string
      incomeChart: string
      expenseChart: string
    }
    popup: {
      aria: string
      imageAlt: string
      closeBackdrop: string
      close: string
      hideToday: string
      linkAria: string
    }
    inquiry: {
      title: string
      tabsAria: string
      tabs: { faq: string; board: string }
      faqSub: string
      faqLoadError: string
      faqEmpty: string
      boardTitle: string
      boardSub: string
      guideTitle: string
      guideSteps: [string, string, string]
      guideNote: string
      modeAria: string
      modeWrite: string
      modeLookup: string
      labelName: string
      labelContact: string
      labelPin: string
      labelPinConfirm: string
      labelType: string
      labelSubject: string
      labelBody: string
      contactPlaceholder: string
      pinPlaceholder: string
      pinMismatch: string
      pinInvalid: string
      submitFail: string
      submitOk: (id: number) => string
      submitting: string
      submit: string
      lookupFail: string
      lookupEmpty: string
      looking: string
      lookup: string
      resultsAria: string
      reply: string
      repliedAt: (date: string) => string
      replyPending: string
      detailTitle: string
      detailSub: string
      emailLabel: string
      phoneLabel: string
      types: Record<string, string>
      statuses: Record<string, string>
    }
    archive: {
      loadError: string
      empty: string
      emptyNewsletter: string
      emptyFiltered: string
      loading: string
      date: (y: number, m: number, d: number) => string
      pagination: (name: string) => string
      newsletterFilterAria: string
      yearLabel: string
      yearOption: (y: number) => string
      issueLabel: string
      issueUnit: (n: string) => string
      listAria: (title: string) => string
      colTitle: string
      colDate: string
      colAction: string
      viewDetail: string
      viewArticle: string
      noLink: string
      mediaAria: (pub: string) => string
      siteTitle: (page: string) => string
      siteTitleDefault: string
    }
    stories: {
      title: string
      subtitle: string
      scopeTitle: (scope: string) => string
      filterAria: string
      listAria: string
      all: string
      scopes: { domestic: string; overseas: string; advocacy: string; support: string }
      chips: { domestic: string; overseas: string; advocacy: string; support: string; default: string }
      pagination: string
      empty: string
      loadError: string
    }
    projects: {
      title: string
      filterAria: string
      listAria: string
      loading: string
      empty: string
      loadError: string
      pagination: string
      regions: { all: string; nepal: string; kyrgyzstan: string; myanmar: string; domestic: string }
    }
    aboutHub: {
      title: string
      tabsAria: string
      tabs: {
        intro: string
        ci: string
        org: string
      }
    }
  }
}

export const koMessages: Messages = {
  nav: {
    aria: {
      main: '주요 메뉴',
      locale: '언어 선택',
      mobileOpen: '메뉴 열기',
      mobileClose: '메뉴 닫기',
      submenu: (section: string) => `${section} 하위 메뉴`,
      subcategory: (section: string) => `${section} 내부 카테고리`,
    },
    home: '홈',
    top: {
      khayah: '카야',
      business: '사업',
      support: '후원',
      news: '소식',
    },
    links: {
      greeting: '인사말',
      history: '연혁',
      location: '오시는 길',
      financialReport: '재정보고',
      aboutKhayah: '카야 소개',
      ci: 'CI',
      org: '조직도 · 이사회 · 전문위원',
      domestic: '국내사업',
      domesticEducation: '교육',
      overseas: '해외사업',
      overseasEducation: '교육',
      overseasHealth: '보건의료',
      advocacy: '옹호사업',
      projects: '진행사업',
      supportGuide: '후원 안내',
      stories: '스토리',
      announcements: '공지사항',
      activities: '활동소식',
      newsletter: '연간소식지',
      press: '언론보도',
      inquiry: '고객 문의',
    },
  },
  footer: {
    aria: '푸터 바로가기',
    topLinks: {
      donate: '후원신청',
      projects: '진행사업',
      location: '위치안내',
      instagram: '인스타그램',
      blog: '블로그',
      kakao: '카카오채널',
    },
    contactText:
      '사단법인 카야 인터내셔널\n경기도 성남시 분당구 이매동 81-3 (방아로 38)\nT 070.5121.2198 | F 070.8650.3639\nE khayahinternational@gmail.com',
    copyright: (year: number) =>
      `© ${year} 사단법인 카야 인터내셔널. All Rights Reserved.`,
  },
  home: {
    hero: {
      donate: '후원하기',
      slideLabel: (n: number) => `${n}번 슬라이드`,
      slidesNavAria: '히어로 슬라이드',
      bizStrip: '사업 분야',
      bizLabels: ['국내사업', '해외사업', '옹호사업', '진행사업'],
      slides: [
        {
          alt: '아이들 이미지',
          lines: ['카야는', '사람을 키우고 섬기는', '개발 NGO 입니다.'],
        },
        {
          alt: '함께 만들어가는 세상',
          lines: ['함께 만들어가는', '따뜻한 세상'],
        },
        {
          alt: '작은 변화와 희망',
          lines: ['작은 변화가', '큰 희망을 만듭니다'],
        },
      ],
    },
    story: {
      aria: '스토리',
      title: '스토리',
      subtitle: '우리들이 전하는 이야기',
      listAria: '스토리 목록',
      more: '스토리 더보기',
      moreAria: (title: string) => `스토리 더보기. 미리보기: ${title}`,
      controls: '스토리 슬라이더 컨트롤',
      prev: '이전 스토리',
      next: '다음 스토리',
      chip: {
        domestic: '국내사업',
        overseas: '해외사업',
        advocacy: '옹호사업',
        support: '진행사업',
        default: '스토리',
      },
    },
    impact: {
      aria: '후원금 사용 요약',
      title: '나눔의 결실',
      subtitle: '함께 만든 희망의 열매들',
      rotator: [
        '01. 투명하게 증명합니다',
        '02. 현장의 변화를 우선합니다',
        '03. 소중한 마음을 연결합니다',
      ],
      cardTitle: '후원금은 이렇게 사용됩니다',
      cardDesc: 'Khayah는 후원금을 가장 가치 있는 일에 사용하기 위해 노력합니다.',
      cta: '자세히보기',
      statsAria: '성과 지표',
      donutAria: (percent: string, label: string) =>
        label ? `후원금의 ${percent.replace('%', '')}%는 ${label}에 사용됩니다` : `후원금의 ${percent}`,
    },
    board: {
      noticeTitle: 'Notice',
      noticeBadge: '공지글',
      moreAria: '더보기',
      listAria: '공지글 목록',
      loadError: '공지사항을 불러오지 못했습니다.',
      empty: '등록된 공지사항이 없습니다.',
      promoTitle: '홍보영상',
      promoError: '영상을 불러오지 못했습니다.',
      promoEmpty: '등록된 홍보 영상이 없습니다.',
      watchOnYoutube: 'YouTube에서 보기',
      promoMoreAria: '유튜브 채널에서 홍보영상 더보기',
      promoLoading: '불러오는 중…',
    },
    partners: {
      aria: '협력기관',
      title: '함께하는 협력기관',
      subtitle: '카야의 활동은 다양한 파트너와의 협력으로 더 멀리, 더 단단하게 이어집니다.',
      controls: '협력기관 로고 컨트롤',
      prev: '이전 로고',
      next: '다음 로고',
    },
  },

  pages: {
    siteName: '사단법인 카야 인터내셔널',
    defaultTitle: '사단법인 카야 인터내셔널 | 개발NGO',
    documentTitle: (pageTitle: string) => `${pageTitle} | 사단법인 카야 인터내셔널`,
    notFoundTitle: '페이지를 찾을 수 없습니다',
    notFoundBody: '요청하신 경로에 해당하는 페이지가 없거나 이동되었을 수 있습니다.',
    loading: '불러오는 중...',
    storyCta: {
      domestic: '국내 스토리 확인하기',
      overseas: '해외 스토리 확인하기',
      advocacy: '옹호 스토리 확인하기',
      support: '지원 스토리 확인하기',
    },
    supportGuide: {
      copySuccess: '후원 링크가 복사되었습니다. 카톡·문자에 붙여넣어 주세요.',
      copyFail: '복사에 실패했습니다. 링크를 길게 눌러 복사하거나 주소창에서 다시 시도해 주세요.',
    },
    financialReport: {
      pageTitle: (year: number) => `${year} 재정보고`,
      loading: '불러오는 중…',
      loadError: '재정보고를 불러오지 못했습니다.',
      loadErrorHint: 'API 서버가 실행 중인지, VITE_API_BASE와 프록시 설정을 확인해 주세요.',
      retry: '다시 시도',
      empty: '등록된 연도 데이터가 없습니다. 관리자 화면의 콘텐츠 관리 → 재정보고에서 연도를 추가해 주세요.',
      yearLabel: '연도',
      yearNavNewer: '더 최근 연도 보기',
      yearNavOlder: '더 오래된 연도 보기',
      balanceSheet: (year: number) => `${year}년 재무상태표`,
      operationsStatement: (year: number) => `${year}년 운영성과표`,
      tablePlaceholderBalance: '재무상태표 이미지 영역',
      tablePlaceholderOps: '운영성과표 이미지 영역',
      tablePlaceholderHint: '관리자 페이지에서 이미지 URL을 등록하면 표시됩니다.',
      actionHometax: '공익법인 결산서류 등 공시',
      actionDonation: '기부금 모금액 및 활용 실적 공시',
      actionAcrc: '공공위반사항 제보\n"국민권익위원회"',
      pdfModalTitle: '기부금 공시 PDF',
      pdfModalBody:
        '이 연도에 기부금 공시 PDF URL이 없습니다. 관리자 화면의 재정보고 메뉴에서 해당 연도의 PDF 주소를 등록하면 새 창으로 열립니다.',
      pdfModalClose: '닫기',
      incomeChart: '수입총액',
      expenseChart: '지출총액',
    },
    popup: {
      aria: '공지 팝업',
      imageAlt: '팝업 이미지',
      closeBackdrop: '팝업 닫기',
      close: '닫기',
      hideToday: '오늘 그만보기',
      linkAria: '팝업 링크',
    },
    inquiry: {
      title: '고객 문의',
      tabsAria: '고객 문의 하위 메뉴',
      tabs: { faq: 'FAQ', board: '문의하기' },
      faqSub: '자주 묻는 질문을 먼저 확인해 보세요.',
      faqLoadError: 'FAQ를 불러오지 못했습니다.',
      faqEmpty: '등록된 게시물이 없습니다.',
      boardTitle: '문의하기',
      boardSub: '문의 작성 또는 기존 문의 조회',
      guideTitle: '문의방법',
      guideSteps: [
        '이름 · 연락처 · 임시 비밀번호를 입력해 문의를 작성합니다.',
        '임시 비밀번호는 숫자 4~6자리로 직접 정합니다.',
        '나중에 「내 문의 조회」에서 같은 정보로 답변을 확인합니다.',
      ],
      guideNote: '비밀번호는 암호화되어 저장되며, 분실 시 사이트에서 복구할 수 없습니다.',
      modeAria: '문의 모드',
      modeWrite: '문의 작성',
      modeLookup: '내 문의 조회',
      labelName: '이름',
      labelContact: '연락처',
      labelPin: '임시 비밀번호',
      labelPinConfirm: '비밀번호 확인',
      labelType: '문의 유형',
      labelSubject: '제목',
      labelBody: '내용',
      contactPlaceholder: '이메일 또는 전화',
      pinPlaceholder: '숫자 4~6자리',
      pinMismatch: '임시 비밀번호가 일치하지 않습니다.',
      pinInvalid: '임시 비밀번호는 숫자 4~6자리여야 합니다.',
      submitFail: '문의 접수에 실패했습니다.',
      submitOk: (id: number) =>
        `문의가 접수되었습니다. (문의번호 #${id}) 같은 이름·연락처·비밀번호로 「내 문의 조회」에서 답변을 확인할 수 있습니다.`,
      submitting: '접수 중…',
      submit: '문의 접수',
      lookupFail: '문의 조회에 실패했습니다.',
      lookupEmpty: '일치하는 문의가 없습니다. 정보를 다시 확인해 주세요.',
      looking: '조회 중…',
      lookup: '문의 조회',
      resultsAria: '조회 결과',
      reply: '답변',
      repliedAt: (date: string) => `답변일 ${date}`,
      replyPending: '아직 답변이 등록되지 않았습니다.',
      detailTitle: '자세한 문의',
      detailSub: 'FAQ·문의하기로 해결되지 않으면 아래 연락처로 문의해 주세요.',
      emailLabel: '이메일',
      phoneLabel: '전화',
      types: {
        '후원 문의': '후원 문의',
        '봉사 참여': '봉사 참여',
        '사업 문의': '사업 문의',
        '기타': '기타',
      },
      statuses: {
        '대기': '대기',
        '처리중': '처리중',
        '완료': '완료',
      },
    },
    archive: {
      loadError: '목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
      empty: '등록된 글이 없습니다.',
      emptyNewsletter: '등록된 소식지가 없습니다.',
      emptyFiltered: '선택한 조건에 해당하는 소식지가 없습니다.',
      loading: '불러오는 중…',
      date: (y, m, d) => `${y}년 ${m}월 ${d}일`,
      pagination: (name) => `${name} 페이지`,
      newsletterFilterAria: '연간소식지 필터',
      yearLabel: '연도',
      yearOption: (y) => `${y}년`,
      issueLabel: '호수',
      issueUnit: (n) => `${n}호`,
      listAria: (title) => `${title} 목록`,
      colTitle: '제목',
      colDate: '등록일',
      colAction: '바로보기',
      viewDetail: '자세히 보기',
      viewArticle: '기사 바로보기',
      noLink: '링크 없음',
      mediaAria: (pub) => `매체 ${pub}`,
      siteTitle: (page) => `${page} | 사단법인 카야 인터내셔널`,
      siteTitleDefault: '사단법인 카야 인터내셔널 | 개발NGO',
    },
    stories: {
      title: '스토리',
      subtitle: '우리들이 전하는 이야기',
      scopeTitle: (scope) => `${scope}사업`,
      filterAria: '스토리 범위 선택',
      listAria: '스토리 목록',
      all: '전체',
      scopes: { domestic: '국내', overseas: '해외', advocacy: '옹호', support: '지원' },
      chips: {
        domestic: '국내사업',
        overseas: '해외사업',
        advocacy: '옹호사업',
        support: '진행사업',
        default: '스토리',
      },
      pagination: '스토리 페이지',
      empty: '등록된 스토리가 없습니다.',
      loadError: '스토리를 불러오지 못했습니다.',
    },
    projects: {
      title: '진행사업',
      filterAria: '진행사업 지역 필터',
      listAria: '진행사업 목록',
      loading: '불러오는 중…',
      empty: '등록된 진행사업 콘텐츠가 없습니다.',
      loadError: '목록을 불러오지 못했습니다.',
      pagination: '진행사업 페이지',
      regions: {
        all: '전체',
        nepal: '네팔',
        kyrgyzstan: '키르기즈스탄',
        myanmar: '미얀마',
        domestic: '국내',
      },
    },
    aboutHub: {
      title: '카야 소개',
      tabsAria: '카야 소개 하위 메뉴',
      tabs: {
        intro: '카야 소개',
        ci: 'CI',
        org: '조직도 · 이사회 · 전문위원',
      },
    },
  },

}
