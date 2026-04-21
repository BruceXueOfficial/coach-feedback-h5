import { useState, useRef, useCallback, useEffect } from 'react'
import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  AimOutlined,
  DownOutlined,
  UserOutlined,
  RobotFilled,
  PieChartFilled,
  SmileFilled,
  HeartFilled,
  DashboardFilled,
  QuestionCircleOutlined,
  CheckCircleFilled,
  EyeOutlined,
  LineChartOutlined,
} from '@aurum/icons2'
import OverviewCard from './components/OverviewCard'
import FeedbackCard from './components/FeedbackCard'

const AI_LINES = [
  { bold: '业务达成：', text: 'Sales 低于目标 682 元，MDS 超额亮眼；尖峰 GC 11-12点大幅超标，夸夸调度能力！' },
  { bold: '客户满意：', text: 'OSAT 达标，但有 2 条客诉（1条L4未解决），聊聊改进方向。' },
  { bold: '员工满意：', text: '认知员工仅 25%，建议多关注员工、及时认可。' },
  { bold: '值班表现：', text: '待办完成率 80%，有 30% 待办@了他人，关注待办闭环和自主执行。' },
  { bold: '建议：', text: '点击展开下方数据展示，结合具体数据进行反馈。' },
]

export default function App() {
  const [toast, setToast] = useState('')
  const overviewRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const [floatDir, setFloatDir] = useState<'up' | 'down' | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2
      const ovR = overviewRef.current?.getBoundingClientRect()
      const fbR = feedbackRef.current?.getBoundingClientRect()
      if (ovR && ovR.top < mid && ovR.bottom > mid) setFloatDir('down')
      else if (fbR && fbR.top < mid && fbR.bottom > mid) setFloatDir('up')
      else setFloatDir(null)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleFloat = () => {
    if (floatDir === 'down') feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else if (floatDir === 'up') overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="status-bar" />
      <nav className="nav">
        <button className="nav-back">
          <ArrowLeftOutlined style={{ fontSize: 20 }} />
          值班教练反馈
        </button>
        <div className="nav-acts">
          <button className="nav-btn"><EllipsisOutlined style={{ fontSize: 18 }} /></button>
          <button className="nav-btn"><AimOutlined style={{ fontSize: 18 }} /></button>
        </div>
      </nav>

      <main className="ct">
        {/* 人员信息 */}
        <section className="card">
          <div className="sh"><span className="st">人员信息</span></div>
          <div className="pi">
            <div className="pa"><UserOutlined style={{ fontSize: 28, color: '#FFBC0D' }} /></div>
            <div>
              <div className="pn">刘翠翠 (Patrick Chen)</div>
              <div className="pm">
                <span>工号：10065998</span>
                <span>班次：2024.09.08</span>
                <span style={{ background: 'var(--y)', color: 'var(--dk)', padding: '1px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>早班</span>
              </div>
            </div>
          </div>
        </section>

        <OverviewCard
          ref={overviewRef}
          aiLines={AI_LINES}
          icons={{ robot: RobotFilled, pie: PieChartFilled, smile: SmileFilled, heart: HeartFilled, dashboard: DashboardFilled }}
        />

        <FeedbackCard
          ref={feedbackRef}
          showToast={showToast}
          icons={{ question: QuestionCircleOutlined, check: CheckCircleFilled, eye: EyeOutlined, lineChart: LineChartOutlined }}
        />
      </main>

      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>

      {floatDir && (
        <button className="float-nav show" onClick={handleFloat}>
          <DownOutlined style={{ fontSize: 20, transform: floatDir === 'up' ? 'rotate(180deg)' : undefined }} />
        </button>
      )}
    </>
  )
}
