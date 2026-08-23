import { Waves, Sprout, Trash2, Recycle, Droplets, type LucideIcon } from 'lucide-react'
import type { PillTone } from '@/components/patterns/StatusPill'

/**
 * The 80 guide tips, extracted verbatim from the previous 672-line
 * resources page so that page could become presentation-only. Content is
 * unchanged; only the presentation metadata (icon, tone) was replaced —
 * the originals carried hardcoded hex gradients, one of which was a flat
 * string where the others were gradients, and one of which was blue on a
 * green-branded site.
 */

export interface GuideSection {
  title: string
  type: string
  content: string
  tips: string[]
}

export interface Guide {
  id: string
  title: string
  description: string
  icon: LucideIcon
  tone: PillTone
  sections: GuideSection[]
}

export const GUIDES: Guide[] = [
  {
    id: "beach-cleanup",
    title: "Beach Cleanup Guide",
    description: "Complete guide to organizing effective beach cleanup events",
    icon: Waves,
    tone: 'info',
    sections: [
      {
        title: "Preparation",
        type: "preparation",
        content: "Identify polluted beaches, gather volunteers, get permission from local authorities, and arrange cleaning tools like gloves, bags, and bins.",
        tips: [
          "Contact local environmental agencies for permits",
          "Create volunteer registration system",
          "Prepare safety briefing materials",
          "Coordinate with waste management services",
        ],
      },
      {
        title: "Safety Measures",
        type: "safety",
        content: "Ensure volunteers wear gloves and closed shoes, provide first aid kits, and stay hydrated throughout the event.",
        tips: [
          "Mandatory safety gear for all participants",
          "Set up hydration stations",
          "Have trained first aid personnel",
          "Establish emergency contact protocols",
        ],
      },
      {
        title: "Cleanup Process",
        type: "process",
        content: "Start from one end, collect segregated waste (plastic, metal, glass, etc.), and dispose of it responsibly in bins or recycling centers.",
        tips: [
          "Use color-coded collection bags",
          "Document waste types and quantities",
          "Take before/after photos",
          "Work systematically across the area",
        ],
      },
      {
        title: "After Cleanup",
        type: "followup",
        content: "Celebrate and appreciate volunteers, post impact stats on social media, and share learnings for future drives.",
        tips: [
          "Calculate total waste collected",
          "Share impact metrics with community",
          "Gather feedback for improvement",
          "Plan regular follow-up cleanups",
        ],
      },
    ],
  },
  {
    id: "tree-plantation",
    title: "Tree Plantation Guide",
    description: "Step-by-step guide for successful tree planting initiatives",
    icon: Sprout,
    tone: 'success',
    sections: [
      {
        title: "Preparation",
        type: "preparation",
        content: "Choose native tree species, prepare land, gather saplings, spades, watering cans, and protective gear.",
        tips: [
          "Research native species suitable for the climate",
          "Test soil quality and pH levels",
          "Plan spacing for mature tree growth",
          "Ensure adequate water source availability",
        ],
      },
      {
        title: "Safety Measures",
        type: "safety",
        content: "Educate about proper lifting, digging depth, and avoid harsh tools for children participants.",
        tips: [
          "Provide age-appropriate tools",
          "Teach proper lifting techniques",
          "Supervise children at all times",
          "Avoid planting during extreme weather",
        ],
      },
      {
        title: "Plantation Process",
        type: "process",
        content: "Dig appropriate pits, plant saplings, water them, and apply compost or mulch around the base.",
        tips: [
          "Dig holes 2-3 times the root ball width",
          "Remove saplings from containers gently",
          "Water immediately after planting",
          "Apply organic mulch to retain moisture",
        ],
      },
      {
        title: "Care and Maintenance",
        type: "followup",
        content: "Assign groups to maintain plants for the next 6–12 months with regular watering and protection.",
        tips: [
          "Create maintenance schedule",
          "Install protective barriers if needed",
          "Monitor for pests and diseases",
          "Celebrate milestones and growth",
        ],
      },
    ],
  },
  {
    id: "waste-management",
    title: "Waste Management Guide",
    description: "Comprehensive approach to sustainable waste management",
    icon: Trash2,
    tone: 'primary',
    sections: [
      {
        title: "Understanding Waste",
        type: "preparation",
        content: "Learn to differentiate between biodegradable, non-biodegradable, and hazardous waste.",
        tips: [
          "Educate community on waste categories",
          "Create visual guides for waste sorting",
          "Understand local recycling capabilities",
          "Identify hazardous waste disposal sites",
        ],
      },
      {
        title: "Segregation",
        type: "process",
        content: "Use color-coded bins: green for wet, blue for dry, red for hazardous. Educate communities.",
        tips: [
          "Place clear labels on all bins",
          "Conduct regular community workshops",
          "Monitor and provide feedback",
          "Reward proper segregation practices",
        ],
      },
      {
        title: "Composting",
        type: "process",
        content: "Encourage home/community composting using kitchen waste for soil enrichment.",
        tips: [
          "Provide composting bins to households",
          "Teach proper composting ratios",
          "Monitor temperature and moisture",
          "Use finished compost in community gardens",
        ],
      },
      {
        title: "Recycling",
        type: "followup",
        content: "Partner with recyclers for paper, plastic, metal, and glass. Avoid sending recyclables to landfills.",
        tips: [
          "Establish partnerships with recycling centers",
          "Create collection schedules",
          "Track recycling quantities",
          "Explore upcycling opportunities",
        ],
      },
    ],
  },
  {
    id: "ewaste-disposal",
    title: "E-Waste Disposal Guide",
    description: "Safe and responsible electronic waste disposal practices",
    icon: Recycle,
    tone: 'warning',
    sections: [
      {
        title: "Awareness",
        type: "preparation",
        content: "Understand the harm caused by improper disposal of electronic waste.",
        tips: [
          "Learn about toxic materials in electronics",
          "Understand environmental impact",
          "Educate community about e-waste dangers",
          "Promote responsible consumption",
        ],
      },
      {
        title: "Collection Drives",
        type: "process",
        content: "Organize e-waste collection camps for households, offices, and schools.",
        tips: [
          "Partner with schools and offices",
          "Advertise collection dates widely",
          "Provide incentives for participation",
          "Ensure secure data destruction",
        ],
      },
      {
        title: "Safe Disposal",
        type: "process",
        content: "Tie up with government-authorized recyclers for dismantling and proper disposal.",
        tips: [
          "Verify recycler certifications",
          "Ensure proper dismantling processes",
          "Track disposal certificates",
          "Avoid informal sector disposal",
        ],
      },
      {
        title: "Upcycling",
        type: "followup",
        content: "Promote reuse or donation of functional electronics to schools or NGOs.",
        tips: [
          "Test functionality before donation",
          "Partner with educational institutions",
          "Create refurbishment programs",
          "Extend product lifecycles",
        ],
      },
    ],
  },
  {
    id: "water-conservation",
    title: "Water Conservation Guide",
    description: "Effective strategies for water conservation and management",
    icon: Droplets,
    tone: 'info',
    sections: [
      {
        title: "Assessment",
        type: "preparation",
        content: "Evaluate local water usage, leakages, and opportunities to save water.",
        tips: [
          "Conduct water audits in buildings",
          "Identify and fix leakages",
          "Monitor consumption patterns",
          "Assess rainwater harvesting potential",
        ],
      },
      {
        title: "Techniques",
        type: "process",
        content: "Install aerators, use rainwater harvesting, and promote drip irrigation for plants.",
        tips: [
          "Install low-flow fixtures",
          "Set up rainwater collection systems",
          "Use greywater for non-potable uses",
          "Implement smart irrigation systems",
        ],
      },
      {
        title: "Community Action",
        type: "process",
        content: "Organize workshops, water audits, and awareness drives for responsible use.",
        tips: [
          "Conduct educational workshops",
          "Create water conservation pledges",
          "Organize community challenges",
          "Share water-saving tips regularly",
        ],
      },
      {
        title: "Long-Term Strategy",
        type: "followup",
        content: "Collaborate with authorities to restore water bodies and push sustainable policies.",
        tips: [
          "Advocate for policy changes",
          "Participate in watershed restoration",
          "Support sustainable development",
          "Monitor water quality regularly",
        ],
      },
    ],
  }

]

export function getGuide(id: string): Guide | undefined {
  return GUIDES.find((g) => g.id === id)
}

export const GUIDE_IDS = GUIDES.map((g) => g.id)
