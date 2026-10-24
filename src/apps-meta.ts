/**
 * App metadata for the suite launcher.
 *
 * `dir` must match the folder name at the repo root (and therefore the folder
 * sync-apps.mjs writes into public/apps/).
 */
export type AppMeta = {
  dir: string
  title: string
  agent: string
  blurb: string
  icon: string
  accent: string
}

export const APP_META: AppMeta[] = [
  {
    dir: 'ProperOS',
    title: 'ProperOS',
    agent: 'Suite Orchestrator',
    blurb: 'The central nervous system. Commands the six specialist agents and runs the full-suite pipeline.',
    icon: '🧠',
    accent: '#00f3ff',
  },
  {
    dir: 'ProperViral',
    title: 'ProperViral',
    agent: 'Master YouTube Ideation Agent',
    blurb: 'Niche analysis, viral concepts, and a growth blueprint aimed at $10k/month.',
    icon: '🚀',
    accent: '#22d3ee',
  },
  {
    dir: 'ProperStory',
    title: 'ProperStoryz',
    agent: 'Viral Script Architect',
    blurb: 'Turns a title or niche into a production packet — psychological hooks and retention storyboards.',
    icon: '📖',
    accent: '#a855f7',
  },
  {
    dir: 'ProperVoCaL',
    title: 'ProperVoCaL',
    agent: 'Master Voice Architect',
    blurb: 'Voice synthesis and audio engineering for high-retention voiceovers and soundscapes.',
    icon: '🎙️',
    accent: '#f472b6',
  },
  {
    dir: 'ProperPixelz',
    title: 'ProperPixelz',
    agent: 'AI Visual Engine',
    blurb: 'Image and video generation studio with multi-engine support and batch processing.',
    icon: '🎨',
    accent: '#34d399',
  },
  {
    dir: 'ProperFuzion',
    title: 'ProperFuzion',
    agent: 'AI Video Producer',
    blurb: 'Video production hub pairing human creativity with a Master AI Director.',
    icon: '🎬',
    accent: '#f59e0b',
  },
  {
    dir: 'ProperSocialz',
    title: 'ProperSocialz',
    agent: 'Master Social Media Agent',
    blurb: 'Orchestrates presence across Facebook, Instagram, Pinterest, X, TikTok, Reddit, and LinkedIn.',
    icon: '📡',
    accent: '#60a5fa',
  },
  {
    dir: 'ProperFlux',
    title: 'ProperFlux',
    agent: 'Master Trading & Web3 Agent',
    blurb: 'Trading dashboard, market tracker, and Token/NFT creation engine.',
    icon: '⚡',
    accent: '#fbbf24',
  },
]
