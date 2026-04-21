import { useState, forwardRef, useCallback, type ComponentType } from 'react'
import { CheckCircleFilled, EyeOutlined, LineChartOutlined } from '@aurum/icons2'

const GUIDE_MAP: Record<string, string[]> = {
  '顾客体验': ['顾客满意度', '服务效率', '问题解决', '顾客互动'],
  '员工体验': ['工作积极性', '团队协作', '员工关怀', '训练成长'],
  '业务达成': ['营业额达成', '食品安全', '运营效率', '成本管控'],
}
const SUFFIX: Record<string, string> = { dowell: '等方面夸夸！', dobetter: '等方面聊聊！', donext: '等方面制定计划！' }
const TABS = ['dowell', 'dobetter', 'donext'] as const
type TabId = typeof TABS[number]
const TAG_LIST = ['顾客体验', '员工体验', '业务达成']

interface Icons { question: ComponentType<any>; check: ComponentType<any>; eye: ComponentType<any>; lineChart: ComponentType<any> }

function cnLen(s: string) { return (s.match(/[\u4e00-\u9fff\u3400-\u4dbfa-zA-Z0-9]/g) || []).length }

const FeedbackCard = forwardRef<HTMLDivElement, { showToast: (msg: string) => void; icons: Icons }>(({ showToast, icons }, ref) => {
  const { question: Question } = icons
  const [curTab, setCurTab] = useState<TabId>('dowell')
  const [tipsOn, setTipsOn] = useState(true)
  const [tags, setTags] = useState<Record<TabId, Set<string>>>({ dowell: new Set(), dobetter: new Set(), donext: new Set() })
  const [texts, setTexts] = useState<Record<TabId, string>>({ dowell: '', dobetter: '', donext: '' })
  const [errors, setErrors] = useState<Record<TabId, boolean>>({ dowell: false, dobetter: false, donext: false })
  const [analyzing, setAnalyzing] = useState(false)

  const isDone = useCallback((b: TabId) => texts[b].trim().length > 0 && tags[b].size > 0 && cnLen(texts[b]) >= 20, [texts, tags])
  const allDone = TABS.every(isDone)

  const toggleTag = (tab: TabId, tag: string) => {
    setTags(prev => {
      const next = new Set(prev[tab])
      next.has(tag) ? next.delete(tag) : next.add(tag)
      return { ...prev, [tab]: next }
    })
    setErrors(prev => ({ ...prev, [tab]: false }))
  }

  const buildGuide = (tab: TabId) => {
    const arr = Array.from(tags[tab])
    if (!arr.length) return ''
    return arr.map(t => `• ${t}：从${(GUIDE_MAP[t] || []).join('、')}${SUFFIX[tab]}`).join('\n')
  }

  const [qualityModal, setQualityModal] = useState(false)

  const handleSubmit = () => {
    if (allDone) {
      setAnalyzing(true)
      setTimeout(() => {
        setAnalyzing(false)
        setQualityModal(true)
      }, 2500)
      return
    }
    const t = texts[curTab].trim()
    if (t.length > 0 && tags[curTab].size > 0 && cnLen(texts[curTab]) < 20) {
      setErrors(prev => ({ ...prev, [curTab]: true })); return
    }
    for (let i = 1; i <= TABS.length; i++) {
      const next = TABS[(TABS.indexOf(curTab) + i) % TABS.length]
      if (!isDone(next)) { setCurTab(next); return }
    }
  }

  const handleForceSubmit = () => {
    setQualityModal(false)
    showToast('反馈提交成功 ✓')
  }

  const handleGoEdit = () => {
    setQualityModal(false)
    setCurTab('dobetter')
  }

  return (
    <>
    <section className="card" ref={ref}>
      <div className="sh">
        <span className="st">教练反馈</span>
        <button className="tips-btn" onClick={() => setTipsOn(!tipsOn)}>
          <Question style={{ fontSize: 12 }} />
          <span>{tipsOn ? '收起Tips' : '填写Tips'}</span>
        </button>
      </div>
      {tipsOn && (
        <div className="tips-p show">
          <div className="sbia">
            <div style={{ position: 'absolute', top: 10, left: 14, fontSize: 13, fontWeight: 700, color: 'var(--dk)' }}>SBIA法则</div>
            <SbiaStep icon={<CheckCircleFilled style={{ fontSize: 18, color: '#fff' }} />} bg="#9E9E9E" label="情景" sub="Situation" />
            <div className="sbia-a">→</div>
            <SbiaStep icon={<EyeOutlined style={{ fontSize: 18, color: '#fff' }} />} bg="#616161" label="行为" sub="Behavior" />
            <div className="sbia-a">→</div>
            <SbiaStep icon={<LineChartOutlined style={{ fontSize: 18, color: '#fff' }} />} bg="#DA291C" label="影响" sub="Impact" />
            <div className="sbia-a">→</div>
            <SbiaStep icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1z"/></svg>} bg="#EE3A2C" label="行动" sub="Action" />
          </div>
        </div>
      )}
      <div style={{ height: 1, background: 'var(--g2)', margin: '0 0 14px' }} />
      <div className="tb">
        {TABS.map(t => (
          <button key={t} className={`ti${curTab === t ? ' active' : ''}${isDone(t) ? ' completed' : ''}`} onClick={() => setCurTab(t)}>
            <span className={`td td-${t === 'dowell' ? 'g' : t === 'dobetter' ? 'o' : 'b'}`} />
            {t === 'dowell' ? 'Do Well' : t === 'dobetter' ? 'Do Better' : 'Do Next'}
            <span className="tc"><svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3" /></svg></span>
          </button>
        ))}
      </div>
      {TABS.map(tab => (
        <div key={tab} className={`fp${curTab === tab ? ' active' : ''}`}>
          <div className="fp-h">
            <span className={`fp-i fp-i${tab === 'dowell' ? 'g' : tab === 'dobetter' ? 'o' : 'b'}`} />
            <span className="fp-t">{tab === 'dowell' ? 'Do Well!' : tab === 'dobetter' ? 'Do Better!' : 'Do Next!'}</span>
          </div>
          <p className="fp-s">{tab === 'dowell' ? '做得好的，继续保持！' : tab === 'dobetter' ? '可以做得更好的方面！' : '下一步行动计划！'}</p>
          <div className="tgs">
            {TAG_LIST.map(tag => (
              <button key={tag} className={`tg${tags[tab].has(tag) ? ' active' : ''}`} onClick={() => toggleTag(tab, tag)}>
                <span className="tg-c"><svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3" /></svg></span>
                {tag}
              </button>
            ))}
          </div>
          {tags[tab].size > 0 && <div className="gd visible">{buildGuide(tab)}</div>}
          <div className="ta-wrap" onClick={() => { if (tags[tab].size === 0) showToast('请点选标签再输入反馈！') }}>
            <textarea
              placeholder={tags[tab].size > 0 ? '请在此输入反馈内容...' : '请选择标签后根据指引填写'}
              disabled={tags[tab].size === 0}
              className={errors[tab] ? 'err' : ''}
              value={texts[tab]}
              onChange={e => {
                setTexts(prev => ({ ...prev, [tab]: e.target.value }))
                setErrors(prev => ({ ...prev, [tab]: false }))
              }}
            />
          </div>
          {errors[tab] && <div className="err-hint show">中文、字母、数字总数不满20个无法提交</div>}
        </div>
      ))}
      {analyzing && (
        <div className="ai-modal-overlay">
          <div className="ai-modal">
            <div className="ai-modal-ring">
              <div className="ai-modal-bubble">
                <span className="ai-dot" /><span className="ai-dot" /><span className="ai-dot" />
              </div>
            </div>
            <div className="ai-modal-text">正在分析</div>
          </div>
        </div>
      )}

      {qualityModal && (
        <div className="quality-overlay" onClick={() => setQualityModal(false)}>
          <div className="quality-modal" onClick={e => e.stopPropagation()}>
            <div className="quality-mascot">
              <span className="mascot-star mascot-star-l">✦</span>
              <div className="mascot-face">
                <div className="mascot-eye mascot-eye-l" />
                <div className="mascot-eye mascot-eye-r" />
              </div>
              <span className="mascot-star mascot-star-r">✦</span>
            </div>

            <div className="quality-title">你的反馈，新人的引路光</div>

            <div className="quality-bar-wrap">
              <div className="quality-bar">
                <div className="quality-seg quality-seg-low" />
                <div className="quality-seg quality-seg-mid" />
                <div className="quality-seg quality-seg-high" />
              </div>
              <div className="quality-pointer" style={{ left: '50%' }}>
                <svg width="10" height="6" viewBox="0 0 10 6"><polygon points="5,0 0,6 10,6" fill="#292929"/></svg>
              </div>
              <div className="quality-labels">
                <span>低质量</span>
                <span className="quality-label-active">中质量</span>
                <span>高质量</span>
              </div>
            </div>

            <div className="quality-quote">
              <span className="quality-quote-mark">"</span>
              <p>业务端反馈很具体，加句影响分析更有深度！可补充"减少浪费帮门店省了1000元成本"，让赞赏更有依据。</p>
            </div>

            <div className="quality-actions">
              <button className="quality-btn quality-btn-ghost" onClick={handleForceSubmit}>仍要提交</button>
              <button className="quality-btn quality-btn-primary" onClick={handleGoEdit}>去修改</button>
            </div>
          </div>
        </div>
      )}
    </section>
    <div className="sub-bar">
      <button className="sub-btn" onClick={handleSubmit}>{allDone ? '给予反馈' : '下一个'}</button>
    </div>
    </>
  )
})

FeedbackCard.displayName = 'FeedbackCard'
export default FeedbackCard

function SbiaStep({ icon, bg, label, sub }: { icon: React.ReactNode; bg: string; label: string; sub: string }) {
  return (
    <div className="sbia-s">
      <div className="sbia-i" style={{ background: bg }}>{icon}</div>
      <div className="sbia-l">{label}</div>
      <div className="sbia-u">{sub}</div>
    </div>
  )
}
