import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Mail, Phone, ExternalLink, ChevronRight, 
  Briefcase, GraduationCap, MessageSquare, Copy, Check, Download,
  Smile
} from 'lucide-react';
import { HeroScene } from './components/QuantumScene';

/**
 * 资源路径配置
 */
const MYphoto = 'https://img.bosszhipin.com/beijin/upload/avatar/20260208/607f1f3d68754fd02ba3b05ecf93d5f706215376d560ec64ad44e828915edaa1f578cba6df7ae99a_s.jpg.webp'; 
const WECHAT_QR = 'https://github.com/sixeyesprime/profile/blob/main/wechat.jpg?raw=true';
const EMAIL_ADDRESS = '2047495486@qq.com';
const ZHIPIN_LINK = 'https://www.zhipin.com/web/geek/recommend?ka=header-username';
const PDF_LINK = 'https://pan.quark.cn/s/2fbcea585b6c'; // 示例链接

// 作品展示图数组
const WORK_IMAGES = [
  'https://img.zcool.cn/community/69b7a579e0d32348nsuxwt3827.jpg?x-oss-process=image/saveexif,1/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100/quality,q_100/format,webp',
  'https://img.zcool.cn/community/69b7a57f64e1flmsdz639y21.jpg?x-oss-process=image/saveexif,1/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100/quality,q_100/format,webp',
  'https://img.zcool.cn/community/69b7bcc8dd7dbe5g7j29tn2811.jpg?x-oss-process=image/saveexif,1/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100/quality,q_100/format,webp',
  'https://img.zcool.cn/community/69b7d11b22204dr48w2jea2248.jpg?x-oss-process=image/saveexif,1/auto-orient,1/resize,m_lfit,w_1280,limit_1/sharpen,100/quality,q_100/format,webp'
];

const NavLink = ({ href, children, onClick }: { href: string; children?: React.ReactNode; onClick?: () => void }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-white hover:text-portfolio-lime transition-colors duration-300 font-black tracking-widest uppercase text-base"
  >
    {children}
  </a>
);

const ExperienceItem = ({ role, company, date, items, isFirst = false }: { role: string, company: string, date: string, items?: React.ReactNode[], isFirst?: boolean }) => (
  <div className="relative pl-10 pb-12 last:pb-0">
    {/* Timeline Line: Starts from circle if first, otherwise continuous from top */}
    <div className={`absolute left-[-1px] w-[2px] bg-portfolio-black/20 bottom-0 ${isFirst ? 'top-2' : 'top-0'}`}></div>
    
    <div className="absolute top-2 left-[-7px] w-3.5 h-3.5 rounded-full bg-portfolio-black border-4 border-portfolio-lime shadow-[0_0_0_2px_rgba(17,17,17,1)] z-10"></div>
    
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-y-2">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <h4 className="text-2xl font-chinese font-black leading-tight text-portfolio-black">{company}</h4>
        <span className="text-xs font-black bg-portfolio-black text-portfolio-lime px-3 py-1.5 rounded-sm uppercase tracking-wider shadow-sm self-start md:self-auto">
            {role}
        </span>
      </div>
      <div className="mt-1 md:mt-0 flex-shrink-0">
        <span className="font-sans text-lg font-bold text-portfolio-black/80">{date}</span>
      </div>
    </div>

    {items && (
      <ul className="text-[14px] font-chinese space-y-2 text-portfolio-black/80 mt-2 leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-portfolio-black flex-shrink-0"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [wechatOpen, setWechatOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  
  // Works Gallery State
  const [activeWorkIndex, setActiveWorkIndex] = useState(0);
  const [showWorkNav, setShowWorkNav] = useState(false);
  const worksRef = useRef<HTMLElement>(null);

  // 新增复制反馈状态
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Navbar Logic
      setScrolled(window.scrollY > 50);

      // 2. Work Navigation Logic (ScrollSpy)
      if (worksRef.current) {
        const rect = worksRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        
        // Check if Works section is "active" (visible on screen)
        // Show nav if any part of the works section is in the viewport
        const isWorksVisible = rect.top < vh && rect.bottom > 0;
        setShowWorkNav(isWorksVisible);

        // Update active index based on which image is most central
        if (isWorksVisible) {
          WORK_IMAGES.forEach((_, i) => {
            const el = document.getElementById(`work-${i}`);
            if (el) {
              const r = el.getBoundingClientRect();
              // Determine if this image is the "active" one
              // Logic: The image that covers the middle of the screen
              if (r.top <= vh / 2 && r.bottom >= vh / 2) {
                setActiveWorkIndex(i);
              }
            }
          });
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
        setPhoneCopied(true);
        setTimeout(() => setPhoneCopied(false), 2000);
    } else {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const scrollToWork = (index: number) => {
    setActiveWorkIndex(index);
    const element = document.getElementById(`work-${index}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const philosophyCards = [
    {
      title: "野蛮生长",
      content: (
        <>
          从零到一跨领域发展，充分吸收每一个岗位的经验，并内化为自己的综合能力，用极强的学习力来弥补专业知识的缺失，快速上手岗位需求相关技能，如<span className="text-portfolio-lime font-bold">模型渲染、网页设计</span>等。
        </>
      )
    },
    {
      title: "AIGC赋能多风格视觉",
      content: (
        <>
          凭借“模型渲染+AIGC+人工优化”的高效混合工作流，能迅速适应并驾驭<span className="text-portfolio-lime font-bold">多种美术风格</span>。擅长<span className="text-portfolio-lime font-bold">手绘</span>，横跨品宣IP、同人二创等领域。对多种游戏的美术风格、玩法机制有自己的见解，能有效支撑视觉设计决策。对<span className="text-portfolio-lime font-bold">AI生图与AI模型技术</span>保持高度敏感与主动学习，能够将新兴工具融入设计实践，为游戏项目提供高质量的视觉方案。
        </>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-portfolio-black font-sans selection:bg-portfolio-lime selection:text-portfolio-black custom-scrollbar overflow-x-hidden">
      
      <HeroScene color="#d0ff1a" />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-portfolio-black/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-10'}`}>
        <div className="container mx-auto px-12 flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={scrollToTop}>
            <div className="flex flex-col space-y-1">
              <span className="text-2xl font-chinese font-black text-white leading-none tracking-wide">刘芷言</span>
              <span className="text-xl font-display font-black text-portfolio-lime leading-none">2026</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-12">
            {/* PDF 下载按钮，文字改为白字，移至最左侧 */}
            <a 
              href={PDF_LINK}
              download
              className="flex items-center gap-2 text-white hover:text-portfolio-lime transition-colors duration-300 font-black tracking-widest uppercase text-base"
            >
              <Download size={18} />
              PDF
            </a>
            <NavLink href="#about">ABOUT ME</NavLink>
            <NavLink href="#works">WORKS</NavLink>
            <a 
              href="#contact" 
              className="px-10 py-3 rounded-full bg-portfolio-lime text-portfolio-black font-black text-base uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(217,255,0,0.3)]"
            >
              CONTACT
            </a>
          </div>

          <button className="lg:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-portfolio-black flex flex-col items-center justify-center gap-12 text-5xl font-display text-white"
          >
            <a href="#about" onClick={() => setMenuOpen(false)} className="hover:text-portfolio-lime">ABOUT ME</a>
            <a href="#works" onClick={() => setMenuOpen(false)} className="hover:text-portfolio-lime">WORKS</a>
            <a href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-portfolio-lime">CONTACT</a>
            <button onClick={() => setMenuOpen(false)} className="absolute top-10 right-10 text-white">
               <X size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WeChat Modal */}
      <AnimatePresence>
        {wechatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setWechatOpen(false)}
              className="absolute inset-0 bg-portfolio-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-2 rounded-[2.5rem] shadow-[0_0_50px_rgba(217,255,0,0.2)] max-w-sm w-full overflow-hidden"
            >
              <button 
                onClick={() => setWechatOpen(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-portfolio-black/10 backdrop-blur-md flex items-center justify-center hover:bg-portfolio-black/20 transition-all"
              >
                <X size={20} className="text-portfolio-black" />
              </button>
              <img 
                src={WECHAT_QR} 
                alt="WeChat QR Code" 
                className="w-full h-auto rounded-[2rem] block"
              />
              <div className="py-6 text-center">
                <p className="text-portfolio-black font-chinese font-black text-xl tracking-wider">扫描二维码添加微信</p>
                <p className="text-portfolio-black/40 font-display text-sm tracking-[0.2em] mt-1">SCAN TO CONNECT</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Modal */}
      <AnimatePresence>
        {emailOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmailOpen(false)}
              className="absolute inset-0 bg-portfolio-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-portfolio-gray p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(255,255,255,0.05)] max-w-lg w-full text-center border border-white/10"
            >
              <button 
                onClick={() => setEmailOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X size={20} className="text-white" />
              </button>
              
              <div className="w-20 h-20 rounded-full bg-portfolio-lime/10 flex items-center justify-center mx-auto mb-8 border border-portfolio-lime/20">
                <Mail size={32} className="text-portfolio-lime" />
              </div>

              <h3 className="text-white font-chinese font-black text-2xl mb-2">我的邮箱地址</h3>
              <p className="text-white/40 font-display text-sm tracking-[0.2em] mb-10 uppercase">Connect with me via email</p>
              
              <div className="bg-portfolio-black p-6 rounded-2xl border border-white/5 mb-8 select-all">
                <span className="text-portfolio-lime font-display text-2xl tracking-wider">{EMAIL_ADDRESS}</span>
              </div>

              <button 
                onClick={handleCopyEmail}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-black tracking-[0.1em] uppercase ${copied ? 'bg-green-500 text-white' : 'bg-portfolio-lime text-portfolio-black hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(217,255,0,0.2)]'}`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? '已成功复制' : '一键复制邮箱'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section className="min-h-screen pt-32 pb-20 px-12 lg:px-24 flex flex-col justify-center relative max-w-[1400px] mx-auto">
          <div className="w-full flex flex-col items-start gap-12 relative">
            <div className="flex flex-col items-start">
              <div className="mb-8">
                <span className="bg-portfolio-lime text-portfolio-black px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm shadow-lg">
                  CREATIVE VISUAL
                </span>
              </div>
              
              <h1 className="text-[18vw] lg:text-[14rem] font-display leading-[0.75] mb-20 flex flex-col items-start select-none">
                <span className="text-white">VISUAL</span>
                <span className="text-portfolio-lime ml-[10vw] lg:ml-[12rem]">PORTFOLIO.</span>
              </h1>
              
              <div className="flex items-center gap-6 mt-4">
                 <a 
                   href="#about" 
                   className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group hover:border-portfolio-lime hover:bg-portfolio-lime/10 transition-all cursor-pointer shadow-xl"
                 >
                    <ChevronRight size={22} className="text-white group-hover:text-portfolio-lime" />
                 </a>
                 <span className="text-2xl lg:text-3xl font-chinese font-black text-white tracking-[0.1em] uppercase">刘芷言个人作品集</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / RESUME SECTION */}
        <section id="about" className="py-24 bg-portfolio-lime text-portfolio-black overflow-hidden relative">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              
              {/* Left Column - Profile & Philosophy Cards */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                
                {/* Profile Top */}
                <div className="flex flex-col items-center text-center">
                  {/* 头像区域 */}
                  <div className="w-56 h-56 rounded-full bg-white shadow-2xl mb-8 overflow-hidden flex items-center justify-center p-4 border-4 border-portfolio-black/5 ring-8 ring-portfolio-black/5">
                    <div className="w-full h-full rounded-full bg-stone-100 overflow-hidden relative flex items-center justify-center">
                      <img 
                        src={MYphoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h2 className="text-6xl font-chinese font-black tracking-tight mb-5">刘芷言</h2>
                  
                  {/* 2002.8 Badge */}
                  <div className="border border-portfolio-black/80 px-6 py-0.5 rounded-full mb-2">
                      <span className="font-display font-black text-xl tracking-wider">2002.8</span>
                  </div>

                  {/* Role with underline */}
                  <div className="relative inline-block px-12 py-1.5 border-b border-portfolio-black/20 mb-4">
                    <p className="text-lg font-chinese font-black tracking-widest uppercase">游戏美宣设计师</p>
                  </div>

                  {/* 联系方式 - 字号调小 (text-[15px]) 并美化复制按钮 */}
                  <div className="flex flex-col gap-5 font-black text-portfolio-black/80 items-center">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-[15px] tracking-tight">
                            <Phone size={16} className="mr-1" /> 18959332789
                        </span>
                        <button 
                            onClick={() => handleCopy('18959332789', 'phone')}
                            className="px-2 py-[2px] border border-portfolio-black/50 rounded text-[9px] font-black hover:bg-portfolio-black hover:text-white transition-all uppercase tracking-wider"
                        >
                            {phoneCopied ? '已复制' : '复制'}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span 
                            className="flex items-center gap-2 cursor-pointer hover:text-portfolio-black transition-colors text-[15px] tracking-tight" 
                            onClick={() => setEmailOpen(true)}
                        >
                            <Mail size={16} className="mr-1" /> {EMAIL_ADDRESS}
                        </span>
                        <button 
                            onClick={() => handleCopy(EMAIL_ADDRESS, 'email')}
                            className="px-2 py-[2px] border border-portfolio-black/50 rounded text-[9px] font-black hover:bg-portfolio-black hover:text-white transition-all uppercase tracking-wider"
                        >
                            {emailCopied ? '已复制' : '复制'}
                        </button>
                    </div>
                  </div>
                </div>

                {/* Philosophy Cards - Bottom Aligned in Left Col */}
                <div className="flex flex-col gap-3 mt-28 lg:mt-auto w-[85%] mx-auto">
                   {philosophyCards.map((item, i) => (
                    <div key={i} className="bg-portfolio-black text-white p-5 rounded-[1.5rem] relative border border-white/5">
                      {/* Top Right Decoration */}
                      <div className="absolute -top-2.5 -right-2.5 bg-portfolio-lime text-portfolio-black rounded-full p-0.5 border-[2px] border-[#D9FF00] shadow-sm z-10">
                         <Smile size={14} strokeWidth={2.5} />
                      </div>

                      <h3 className="text-[13px] font-chinese font-black mb-2 flex items-center gap-1.5 text-white">
                        <span className="w-3 h-3 rounded-full border-[2px] border-portfolio-lime flex-shrink-0"></span> 
                        {item.title}
                      </h3>
                      <p className="text-[10px] font-chinese leading-[1.8] text-[#cccccc] text-justify font-medium">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Work & Education */}
              {/* Changed justify-between to gap to allow Education section to move up (jump up) */}
              <div className="lg:col-span-8 flex flex-col gap-12 lg:gap-20">
                
                {/* 1. 工作经历 - Top of Right Col */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-10 border-b border-portfolio-black/10 pb-4">
                    <div className="flex items-center gap-4">
                        <Briefcase size={28} />
                        <h3 className="text-3xl font-chinese font-black">工作经历</h3>
                    </div>
                    <span className="hidden md:block font-display text-4xl text-white/40 italic pr-4">Experience</span>
                  </div>
                  {/* Remove space-y-2 to allow continuous line connection */}
                  <div className="flex flex-col">
                    <ExperienceItem 
                      isFirst={true}
                      company="深圳市闲闲互娱网络科技有限公司" 
                      role="美宣设计师" 
                      date="2024.11 - 2025.12"
                      items={[
                        <span key="1">独立负责<strong className="mx-1 font-black">《风色传说》、《呷饱未?疆疆酱》、《爱琳诗篇》</strong>等多款游戏海外多地区的主视觉海报、商店图、logo、icon及网站等美宣视觉设计。</span>,
                        "配合团队其他素材需求产出，对接及监修外包团队产出素材。"
                      ]}
                    />
                    <ExperienceItem 
                      company="天津紫龙奇点互动娱乐有限公司" 
                      role="视觉设计实习生" 
                      date="2023.08 - 2024.06"
                      items={[
                        <span key="1">负责<strong className="mx-1 font-black">《仙境传说：新启航》、《第七史诗》、《龙之国物语》</strong>等游戏的宣传海报、推广图片、各渠道产品广告等相关视觉设计。</span>,
                        "深度参与新项目《仙境传说：新启航》视觉策划。"
                      ]}
                    />
                    <ExperienceItem 
                      company="深圳市及时沟通广告有限公司" 
                      role="平面设计实习生" 
                      date="2022.06 - 2022.09"
                      items={[
                        "负责第十四届保利和乐中国Festival 系列先导海报设计。",
                        "负责保利集团 IP 形象更新手册设计。"
                      ]}
                    />
                  </div>
                </div>

                {/* 2. 教育经历 - Bottom of Right Col (Aligns with Cards) */}
                <div className="mt-auto">
                  <div className="flex items-center justify-between gap-4 mb-10 border-b border-portfolio-black/10 pb-4">
                    <div className="flex items-center gap-4">
                        <GraduationCap size={28} />
                        <h3 className="text-3xl font-chinese font-black">教育经历</h3>
                    </div>
                    <span className="hidden md:block font-display text-4xl text-white/40 italic pr-4">Education</span>
                  </div>
                  
                  {/* 使用与工作经历相同的左侧线条结构 */}
                  <div className="relative pl-10 pb-2">
                    {/* Line starts from top-2 (no antenna) */}
                    <div className="absolute left-[-1px] top-2 bottom-0 w-[2px] bg-portfolio-black/20"></div>
                    <div className="absolute top-2 left-[-7px] w-3.5 h-3.5 rounded-full bg-portfolio-black border-4 border-portfolio-lime shadow-[0_0_0_2px_rgba(17,17,17,1)] z-10"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-y-2">
                      <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
                        <h4 className="text-3xl font-chinese font-black leading-tight text-portfolio-black">江西师范大学</h4>
                        <span className="text-base font-bold text-portfolio-black/70 mb-1">
                          本科 · 广告学
                        </span>
                      </div>
                      <div className="mt-1 md:mt-0 flex-shrink-0">
                          <span className="font-sans text-lg font-bold text-portfolio-black/80">
                            2020 - 2024
                          </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-1">
                        <div className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                               <div className="w-[3px] h-3.5 bg-portfolio-black"></div>
                               <span className="font-chinese text-[14px] font-bold text-[#333333]">全国大学生广告艺术大赛 (大广赛)</span>
                           </div>
                           <span className="font-chinese text-[14px] font-black text-right ml-4">省一等奖</span>
                        </div>
                        <div className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                               <div className="w-[3px] h-3.5 bg-portfolio-black"></div>
                               <span className="font-chinese text-[14px] font-bold text-[#333333]">正大书画协会 手绘教学部部长</span>
                           </div>
                           <span className="font-chinese text-[14px] font-black text-right ml-4">优秀学生干部</span>
                        </div>
                        <div className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                               <div className="w-[3px] h-3.5 bg-portfolio-black"></div>
                               <span className="font-chinese text-[14px] font-bold text-[#333333]">国家励志奖学金</span>
                           </div>
                           <span className="font-chinese text-[14px] font-black text-right ml-4">全系仅2人</span>
                        </div>
                        <div className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                               <div className="w-[3px] h-3.5 bg-portfolio-black"></div>
                               <span className="font-chinese text-[14px] font-bold text-[#333333]">江西省大学生科技创新竞赛</span>
                           </div>
                           <span className="font-chinese text-[14px] font-black text-right ml-4">一等奖</span>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKS SECTION - Vertical Stacked Images 70% width */}
        <section id="works" ref={worksRef} className="bg-portfolio-black min-h-screen relative py-0 flex flex-col items-center"> 
            <div className="flex flex-col w-full items-center gap-0">
                {WORK_IMAGES.map((img, index) => (
                    <div key={index} id={`work-${index}`} className="w-[70%] relative">
                        <img src={img} alt={`Work ${index + 1}`} className="w-full h-auto block" />
                    </div>
                ))}
            </div>
        </section>

        {/* Fixed Left Nav for Works */}
        <div className={`fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50 transition-opacity duration-500 ${showWorkNav ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {[0, 2, 3].map((workIndex) => (
                <button 
                key={workIndex}
                onClick={() => scrollToWork(workIndex)}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 border border-transparent shadow-lg ${
                    activeWorkIndex === workIndex || (workIndex === 0 && activeWorkIndex === 1)
                    ? 'bg-portfolio-lime shadow-[0_0_15px_#D9FF00] scale-125'
                    : 'bg-zinc-600 hover:bg-zinc-400'
                }`}
                aria-label={`Jump to work ${workIndex + 1}`}
                />
            ))}
        </div>

        {/* CONTACT / FOOTER */}
        <section id="contact" className="py-48 bg-portfolio-black border-t border-white/5 relative overflow-hidden min-h-[95vh] flex flex-col justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0 px-10">
                <span className="text-[28vw] font-display font-black text-white/[0.02] tracking-[0.05em] select-none uppercase leading-none block w-full whitespace-nowrap">PORTFOLIO</span>
            </div>

            <div className="container mx-auto px-8 relative z-10">
                <div className="flex flex-col items-center justify-center text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        className="mb-28 flex flex-col items-center"
                    >
                        <h2 className="text-[10vw] md:text-[8rem] lg:text-[10rem] font-display font-black leading-[0.9] flex flex-col items-center">
                            <span className="text-white uppercase tracking-[0.05em]">THANKS</span>
                            <span className="text-portfolio-lime uppercase block tracking-[0.08em]">FOR WATCHING</span>
                        </h2>
                    </motion.div>

                    <div className="flex items-center justify-center gap-14 md:gap-24">
                        <div 
                          onClick={() => setEmailOpen(true)}
                          className="flex flex-col items-center gap-4 group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-portfolio-lime group-hover:bg-white/5 transition-all duration-300">
                                <Mail className="text-white group-hover:text-portfolio-lime" size={24} />
                            </div>
                            <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.3em]">EMAIL</span>
                        </div>
                        <div 
                          onClick={() => setWechatOpen(true)}
                          className="flex flex-col items-center gap-4 group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-portfolio-lime group-hover:bg-white/5 transition-all duration-300">
                                <MessageSquare className="text-white group-hover:text-portfolio-lime" size={24} />
                            </div>
                            <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.3em]">WECHAT</span>
                        </div>
                        <a 
                          href={ZHIPIN_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-4 group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-portfolio-lime group-hover:bg-white/5 transition-all duration-300">
                                <ExternalLink className="text-white group-hover:text-portfolio-lime" size={24} />
                            </div>
                            <span className="text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.3em]">LINK</span>
                        </a>
                    </div>
                </div>

                <div className="mt-64 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 pt-14">
                    <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.15em]">© Liu Zhiyan 2026 Visual Portfolio.</p>
                    <div className="flex items-center gap-3.5 group">
                        <div className="w-2.5 h-2.5 rounded-full bg-portfolio-lime shadow-[0_0_12px_rgba(217,255,0,0.6)] animate-pulse"></div>
                        <p className="text-[13px] font-black uppercase tracking-[0.1em] text-white/80 group-hover:text-white transition-colors">WAITING FOR CONTACT</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Floating Action Buttons Area (Bottom Right) */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end">
        {/* Scroll To Top Button */}
        <motion.button 
          onClick={scrollToTop}
          className="w-14 h-14 bg-portfolio-lime rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-black/10"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={28} className="text-portfolio-black rotate-[-90deg]" />
        </motion.button>

        {/* PDF Download Button (Floating) */}
        <motion.a 
          href={PDF_LINK}
          download
          className="w-14 h-14 bg-portfolio-lime rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-black/10"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Download size={24} className="text-portfolio-black" />
        </motion.a>

        {/* Dismissible Hint Label */}
        <AnimatePresence>
          {hintVisible && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl"
            >
              <span className="text-[10px] font-chinese font-black text-white/90 tracking-wide">
                如果加载时间太久可下载PDF文件
              </span>
              <button 
                onClick={() => setHintVisible(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;