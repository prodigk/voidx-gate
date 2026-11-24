import snapshot from '../data/projects.json';
import details from '../data/site-details.json';
import projectOrder from '../data/project-order.json';

type Detail = { title: string; description: string; category: string; icon: string };
const descriptions: Record<string, Detail> = details;
const arrow = <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg>;

function GatewayArt() {
  return <svg className="gateway-art" aria-hidden="true" viewBox="0 0 400 250" fill="none">
    <g stroke="#b8d6b3" strokeWidth="1.1">
      {Array.from({length: 9}, (_, i) => <rect key={i} x={48+i*14} y={25+i*6} width={188-i*10} height={186-i*9} rx={94-i*5} transform={`rotate(-28 ${142+i*9} ${118+i*1.5})`} opacity={0.22+i*0.085} />)}
      <path d="m58 217 267-176M75 231 267-129" opacity=".22" />
    </g>
    <circle cx="282" cy="69" r="18" fill="#ff7759" />
    <circle cx="282" cy="69" r="28" stroke="#ff7759" strokeOpacity=".25" />
    <path d="M344 180v26m-13-13h26" stroke="#b8d6b3" strokeWidth="1" />
  </svg>;
}

export default function Home() {
  const rank = new Map(projectOrder.map((name, index) => [name, index]));
  const sites = [...snapshot.sites].sort((a, b) =>
    (rank.get(a.name) ?? Infinity) - (rank.get(b.name) ?? Infinity) || b.updatedAt - a.updatedAt
  );
  const updated = new Intl.DateTimeFormat('en-CA', {year:'numeric', month:'2-digit', day:'2-digit', timeZone:'Asia/Seoul'}).format(new Date(snapshot.syncedAt)).replaceAll('-', '.');
  return <>
    <a className="skip-link" href="#projects">프로젝트 목록으로 바로가기</a>
    <header className="header shell">
      <a className="wordmark" href="/" aria-label="voidx 홈">voidx<span className="brand-dot" /></a>
      <span className="header-label">INDEPENDENT PROJECT DIRECTORY</span>
      <a className="header-link" href="#projects">프로젝트 둘러보기 <span aria-hidden="true">↗</span></a>
    </header>
    <main className="shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow"><span className="tiny-cross">✳</span> THE VOIDX COLLECTION</div>
          <h1 id="hero-title">Small ideas.<br />Open possibilities<span className="period">.</span></h1>
          <p>웹사이트, 도구, 그리고 작은 실험들.<br />voidx의 모든 프로젝트가 이어지는 곳.</p>
        </div>
        <aside className="collection-panel" aria-label="프로젝트 컬렉션 요약">
          <div className="panel-top"><span className="mono">ONE GATE. MANY WORLDS.</span><span className="panel-plus" aria-hidden="true">+</span></div>
          <GatewayArt />
          <div className="panel-bottom"><div><span className="project-count">{String(sites.length).padStart(2,'0')}</span><span className="panel-caption">deployed projects</span></div><span className="panel-symbol" aria-hidden="true">↗</span></div>
        </aside>
      </section>
      <section id="projects" className="directory" aria-labelledby="directory-title">
        <div className="directory-heading"><div className="directory-title"><h2 id="directory-title">프로젝트</h2><span className="count-badge">{sites.length}</span></div><span className="directory-note">새로운 아이디어부터 일상의 도구까지</span></div>
        <div className="list-head mono" aria-hidden="true"><span>PROJECT / DESCRIPTION</span><span>DESTINATION</span><span /></div>
        <ol className="project-list">
          {sites.map((site, index) => {
            const info = descriptions[site.name] || {title:site.name,description:'',category:'Project',icon:'project'};
            return <li key={site.name}>
              <a className="project-row" href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`${info.title} — 새 탭에서 열기`}>
                <div className="project-main"><span className="row-number mono">{String(index+1).padStart(2,'0')}</span><img className="project-mark" src={`/project-icons/${info.icon}.svg`} width="54" height="54" alt="" decoding="async" /><div className="project-copy"><div className="project-name"><h3>{info.title}</h3><span className="category">{info.category}</span>{(!site.httpStatus || site.httpStatus >= 400) && <span className="unavailable">접속 확인 필요{site.httpStatus ? ` · ${site.httpStatus}` : ''}</span>}</div><p>{info.description}</p></div></div>
                <span className="destination">{new URL(site.url).hostname}</span>
                <span className="open-icon">{arrow}</span>
              </a>
            </li>;
          })}
        </ol>
        {sites.length === 0 && <p className="empty">아직 배포된 프로젝트가 없습니다.</p>}
        <div className="list-footer"><span><span className="status-dot" />Vercel에 배포된 프로젝트 모음</span><span className="mono">UPDATED {updated}</span></div>
      </section>
    </main>
    <footer className="footer shell"><div><a className="wordmark" href="/">voidx<span className="brand-dot" /></a><span className="footer-note">계속 만들고, 연결합니다.</span></div><span className="footer-right">Built with curiosity.<span className="mono">SEOUL, KR · {new Date(snapshot.syncedAt).getFullYear()}</span></span></footer>
  </>;
}
