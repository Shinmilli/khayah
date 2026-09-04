import { PATH } from './routes'

export const LEGACY_PATH_KEY_MAP: Record<string, string> = {
  '카야': PATH.aboutKhayah,
  '카야/카야소개': PATH.aboutKhayah,
  '카야/카야-스토리': PATH.aboutGreeting,
  '카야/카야-연향': PATH.aboutHistory,
  '카야/위치안내': PATH.aboutLocation,
  '카야/조직도': PATH.aboutKhayah,
  '카야/이사회-전문위원': PATH.aboutKhayah,
  '카야/핵심사업': PATH.aboutKhayah,
  '해외사업': PATH.businessOverseas,
  '해외사업/교육': PATH.businessOverseasEducation,
  '해외사업/보건의료': PATH.businessOverseasHealth,
  '국내사업': PATH.businessDomestic,
  '국내사업/교육': PATH.businessDomesticEducation,
  '사업/옹호사업': PATH.businessAdvocacy,
  '사업/진행사업': PATH.businessProjects,
  '사업/진행사업/네팔': PATH.businessProjectsNepal,
  '사업/진행사업/미얀마': PATH.businessProjectsMyanmar,
  '사업/진행사업/키르기즈스탄': PATH.businessProjectsKyrgyzstan,
  '사업/진행사업/국내': PATH.businessProjectsDomestic,
  '후원': PATH.supportGuide,
  '후원/후원-안내': PATH.supportGuide,
  '후원/후원신청': PATH.supportApply,
  '후원/정기후원': PATH.supportGuide,
  '후원/일시후원': PATH.supportGuide,
  '후원/물품후원': PATH.supportGuide,
  '후원/자원봉사': PATH.supportGuide,
  '소식': PATH.stories,
  '소식/카야소식': PATH.newsActivities,
  '소식/소식지': PATH.newsNewsletter,
  '소식/1대1문의': PATH.newsInquiry,
  '소식/공지사항': PATH.newsAnnouncements,
  '소식/활동소식': PATH.newsActivities,
  '소식/연간소식지': PATH.newsNewsletter,
  '소식/재정보고': PATH.newsFinancialReport,
  '소식/언론보도': PATH.newsPress,
  '소식/고객문의': PATH.newsInquiry,
  '카야와-함께': PATH.together,
  '카야와-함께/공지사항': PATH.newsAnnouncements,
  '카야와-함께/카야소식': PATH.newsActivities,
}

export function resolveLegacyPathKey(pathKey: string): string | null {
  if (!pathKey) return null
  const direct = LEGACY_PATH_KEY_MAP[pathKey]
  if (direct) return direct
  if (pathKey.startsWith('후원가이드')) {
    const tail = pathKey === '후원가이드' ? '' : pathKey.slice('후원가이드/'.length)
    return !tail || tail === '후원자-가이드' || tail === '후원-안내' ? PATH.supportGuide : `support/${tail}`
  }
  if (pathKey.startsWith('후원자가이드')) {
    const tail = pathKey === '후원자가이드' ? '' : pathKey.slice('후원자가이드/'.length)
    return !tail || tail === '후원자-가이드' ? PATH.supportGuide : `support/${tail}`
  }
  return null
}

export function legacyRedirectTarget(
  pathKey: string,
  search: string,
  hash: string,
): { pathKey: string; search: string; hash: string } | null {
  if (pathKey === '카야/조직도') {
    return { pathKey: PATH.aboutKhayah, search: '?tab=org', hash: hash || '#org-chart' }
  }
  if (pathKey === '카야/이사회-전문위원') {
    return { pathKey: PATH.aboutKhayah, search: '?tab=org', hash: hash || '#directors' }
  }
  const resolved = resolveLegacyPathKey(pathKey)
  if (!resolved || resolved === pathKey) return null
  return { pathKey: resolved, search, hash }
}
