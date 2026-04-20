const mockAdmins = [
  {
    email: 'admin@example.org',
    role: '전체 관리',
    lastAccess: '2026-04-19 09:12',
    active: true,
    piiAccess: '허용',
  },
  {
    email: 'content@example.org',
    role: '콘텐츠만',
    lastAccess: '2026-04-17 14:40',
    active: true,
    piiAccess: '제한',
  },
  {
    email: 'donation@example.org',
    role: '후원 관리',
    lastAccess: '2026-04-10 11:02',
    active: true,
    piiAccess: '제한',
  },
] as const

export function AdminOperationsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__head">
        <div>
          <h1 className="admin-page__title">운영·권한 관리</h1>
          <p className="admin-page__desc">
            관리자 계정과 역할을 구분하고, 개인정보 접근 범위를 통제합니다. 계정 생명주기는 조직의 IdP
            정책과 맞추는 것이 안전합니다.
          </p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" disabled>
          관리자 초대(목업)
        </button>
      </div>

      <section className="admin-callout" role="note">
        <h2 className="admin-callout__title">Google Workspace와의 역할 분담</h2>
        <ul className="admin-callout__list">
          <li>
            <strong>계정 생성·삭제·퇴사 처리</strong>는 Google Workspace(또는 조직 IdP)에서 계정을
            비활성화·삭제하는 흐름이 일반적입니다.
          </li>
          <li>
            <strong>이 애플리케이션</strong>에서는 &quot;누가 어떤 메뉴·데이터(개인정보 포함)에 접근할
            수 있는지&quot;만 역할(RBAC)로 제한합니다.
          </li>
          <li>
            담당자 인사이동·퇴사 시: IdP에서 계정 차단 → 본 시스템에서 세션 무효화·역할 회수 순으로
            리스크를 줄입니다.
          </li>
        </ul>
      </section>

      <section className="admin-panel" aria-labelledby="roles-heading">
        <h2 id="roles-heading" className="admin-panel__title">
          권한 구분 (예시)
        </h2>
        <div className="admin-chips" role="list">
          <span className="admin-chip">전체 관리</span>
          <span className="admin-chip">콘텐츠만</span>
          <span className="admin-chip">후원 관리</span>
          <span className="admin-chip">문의·CS</span>
          <span className="admin-chip">개인정보 최소 접근</span>
        </div>
      </section>

      <section className="admin-panel" aria-labelledby="admin-table-heading">
        <h2 id="admin-table-heading" className="admin-panel__title">
          관리자 계정 (샘플)
        </h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">계정(Gmail/Workspace)</th>
                <th scope="col">역할</th>
                <th scope="col">개인정보 접근</th>
                <th scope="col">마지막 접속</th>
                <th scope="col">상태</th>
                <th scope="col">관리</th>
              </tr>
            </thead>
            <tbody>
              {mockAdmins.map((row) => (
                <tr key={row.email}>
                  <td>{row.email}</td>
                  <td>{row.role}</td>
                  <td>{row.piiAccess}</td>
                  <td>{row.lastAccess}</td>
                  <td>
                    {row.active ? (
                      <span className="admin-tag admin-tag--ok">활성</span>
                    ) : (
                      <span className="admin-tag">비활성</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" disabled>
                        역할 변경
                      </button>
                      <button type="button" className="admin-btn admin-btn--sm admin-btn--danger-ghost" disabled>
                        앱에서 제거
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="admin-panel__foot">
          실제 구현 시: Workspace 그룹과 역할 매핑, 감사 로그(누가 언제 어떤 개인정보를 조회했는지)를
          검토 항목에 포함하는 것을 권장합니다.
        </p>
      </section>
    </div>
  )
}
