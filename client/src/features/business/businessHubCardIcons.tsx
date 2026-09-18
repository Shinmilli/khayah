import type { ReactElement } from 'react'
import type { BusinessHubIcon } from './businessHubCardsTypes'

function EducationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 3.4 2 8.4l10 5 10-5-10-5Zm-7.2 7.3v4.8c0 1.5 3.6 4 7.2 4s7.2-2.5 7.2-4v-4.8l-7.2 3.6-7.2-3.6Z" />
    </svg>
  )
}

function VolunteerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm6 0a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 15 11ZM9 13c-3.3 0-6 2.1-6 4.8V20h12v-2.2C15 15.1 12.3 13 9 13Zm6 .5c-.4 0-.8 0-1.2.1 1.8 1.1 3.2 2.8 3.2 4.7V20h4v-1.6c0-2.5-2.4-4.9-6-4.9Z" />
    </svg>
  )
}

function ProjectsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 4h7.2L14 7.2H20v13H4Zm2 4v10h12V9.2h-5.2L10.6 6H6Z" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

const ICONS: Record<BusinessHubIcon, () => ReactElement> = {
  education: EducationIcon,
  volunteer: VolunteerIcon,
  projects: ProjectsIcon,
  people: PeopleIcon,
}

export const BUSINESS_HUB_ICON_LABELS: Record<BusinessHubIcon, string> = {
  education: '교육',
  volunteer: '봉사단',
  projects: '진행사업',
  people: '사람',
}

export function BusinessHubCardIcon({ icon }: { icon: BusinessHubIcon }) {
  const Icon = ICONS[icon] ?? EducationIcon
  return <Icon />
}
